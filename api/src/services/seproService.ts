import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import config from "./../config";

export interface Certificate {
  alias: string;
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
}

export interface SignatureResponse {
  signature: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class SeproIDClient {
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string =
    "https://serproid.serpro.gov.br/oauth/v1/oauth/client-token";
  private signatureUrl: string =
    "https://serproid.serpro.gov.br/oauth/v1/oauth/signature";
  private certDiscoveryUrl?: string =
    "https://serproid.serpro.gov.br/oauth/v1/oauth/certificate-discovery";

  private _token: string | null = null;
  private _expiresAt = 0;

  constructor() {
    this.clientId = config.a3.clientId;
    this.clientSecret = config.a3.clientSecret;
  }

  private async _fetchToken(): Promise<void> {
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const res: AxiosResponse<TokenResponse> = await axios.post(
      this.tokenUrl,
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const { access_token, expires_in } = res.data;
    this._expiresAt = Date.now() + (expires_in - 60) * 1000;
    this._token = access_token;
  }

  public async getAccessToken(): Promise<string> {
    if (!this._token || Date.now() >= this._expiresAt) {
      await this._fetchToken();
    }
    return this._token as string;
  }

  public invalidateToken(): void {
    this._token = null;
    this._expiresAt = 0;
  }

  private async _request<T = any>(
    options: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const token = await this.getAccessToken();
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    try {
      return await axios.request<T>(options);
    } catch (err: any) {
      const status: number | undefined = err.response?.status;
      if (status === 401 || status === 403) {
        this.invalidateToken();
        const newToken = await this.getAccessToken();
        options.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };
        return await axios.request<T>(options);
      }
      throw err;
    }
  }

  public async discoverCertificates(): Promise<Certificate[]> {
    if (!this.certDiscoveryUrl) {
      throw new Error("certDiscoveryUrl não configurado");
    }
    const res = await this._request<{ certificates: Certificate[] }>({
      url: this.certDiscoveryUrl,
      method: "get",
    });
    return res.data.certificates;
  }

  /**
   * Assina dados em Base64 e retorna a assinatura em Base64.
   * @param alias      Identificador do certificado.
   * @param dataBase64 Conteúdo a ser assinado, em Base64.
   * @param algorithm  Algoritmo de assinatura (ex: 'SHA256withRSA').
   */
  public async signData(
    alias: string,
    dataBase64: string,
    algorithm: string = "SHA256withRSA",
  ): Promise<string> {
    const res = await this._request<SignatureResponse>({
      url: this.signatureUrl,
      method: "post",
      data: { alias, algorithm, data: dataBase64 },
      headers: { "Content-Type": "application/json" },
    });
    return res.data.signature;
  }
}

export default SeproIDClient;
