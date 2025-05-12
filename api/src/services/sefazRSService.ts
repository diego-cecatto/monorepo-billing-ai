import axios, { AxiosRequestConfig } from "axios";
import { A1Service } from "./A1Service";
import { create } from "xmlbuilder2";
import soap from "soap";
import { DistribuicaoDFe } from "node-mde";
import config from "../config";
import { XmlUtils } from "./../utils/XMLUtils";
import https from "https";
import { GzipUtils } from "./../utils/GzipUtils";

export class SefazRSService {
  URLS = {
    PROD: {
      CONSULTA:
        "https://nfe.sefazrs.rs.gov.br/ws/NfeConsulta4/NfeConsulta4.asmx?wsdl",
    },
  };
  constructor() {}

  private generateFindXML(chaveNFe: string): string {
    return create({ version: "1.0", encoding: "UTF-8" })
      .ele("consSitNFe", {
        xmlns: "http://www.portalfiscal.inf.br/nfe",
        versao: "4.00",
        Id: "_0",
      })
      .ele("tpAmb")
      .txt("1")
      .up()
      .ele("xServ")
      .txt("CONSULTAR")
      .up()
      .ele("chNFe")
      .txt(chaveNFe)
      .end({ prettyPrint: false });
  }

  private wrapSoapEnvelope(signedXml: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Header>
    <nfeCabecMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NfeConsulta4">
      <cUF>43</cUF>
      <versaoDados>4.00</versaoDados>
    </nfeCabecMsg>
  </soap12:Header>
  <soap12:Body>
    <nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NfeConsulta4">
      ${signedXml}
    </nfeDadosMsg>
  </soap12:Body>
</soap12:Envelope>`;
  }

  async sendFind(NFSKey: string) {
    try {
      const a1 = new A1Service();
      const wsdl_options = {};
      await a1.signSoapRequest(wsdl_options);
      const client = await soap.createClientAsync(this.URLS.PROD.CONSULTA, {
        wsdl_options,
      });

      const args = {
        nfeDadosMsg: {
          consSitNFe: {
            xmlns: "http://www.portalfiscal.inf.br/nfe/wsdl/NfeConsulta4",
            tpAmb: "1",
            xServ: "CONSULTAR",
            chNFe: NFSKey,
          },
        },
      };

      const [result] = await (client as any).nfeConsultaNF2Async(args);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async sendConsulta(chaveNFe: string) {
    try {
      const a1 = new A1Service();

      const findXML = this.generateFindXML(chaveNFe.replace(/ /g, ""));
      const signedXML = await a1.signXml(findXML);

      const conf: AxiosRequestConfig = {
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction:
            '"http://www.portalfiscal.inf.br/nfe/wsdl/NfeConsulta4/nfeConsultaNF"',
        },
        timeout: 30000,
      };

      await a1.asignHeader(conf);

      const { data } = await axios.post(
        this.URLS.PROD.CONSULTA,
        this.wrapSoapEnvelope(signedXML.replace(/<\?xml.*?\?>/, "")),
        conf,
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  private buildEnvelope(chave: string): string {
    const tpAmb = "1";
    return `<?xml version="1.0" encoding="UTF-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <nfeConsultaNF2 xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NfeConsulta4">
          <nfeDadosMsg>
            <consSitNFe>
              <tpAmb>${tpAmb}</tpAmb>
              <xServ>CONSULTAR</xServ>
              <chNFe>${chave}</chNFe>
            </consSitNFe>
          </nfeDadosMsg>
        </nfeConsultaNF2>
      </soap:Body>
    </soap:Envelope>`;
  }

  async getNFEByKey(key: string) {
    try {
      const a1 = new A1Service();

      const client = axios.create({
        httpsAgent: await a1.getAgent(),
        headers: { "Content-Type": "text/xml; charset=utf-8" },
      });

      const xmlBody = this.buildEnvelope(key);

      const response = await client.post(this.URLS.PROD.CONSULTA, xmlBody, {
        headers: {
          SOAPAction:
            "http://www.portalfiscal.inf.br/nfe/wsdl/NfeConsulta4/nfeConsultaNF2",
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  async getNFEByKey2(key: string) {
    try {
      const a1 = new A1Service();
      const distribuicao = new DistribuicaoDFe({
        pfx: await a1.readFile(),
        passphrase: config.a1.pfxPassword,
        cnpj: config.CNPJ,
        cUFAutor: "43",
        tpAmb: "1",
      });

      const consulta = await distribuicao.consultaChNFe(key.replace(/ /g, ""));

      if (consulta.error) {
        throw new Error(consulta.error);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export class SefazService {
  constructor() {}

  CA = [
    "-----BEGIN CERTIFICATE-----\r\nMIIHAjCCBOqgAwIBAgIJAJVIeKgiEmNTMA0GCSqGSIb3DQEBDQUAMIGYMQswCQYD\r\nVQQGEwJCUjETMBEGA1UECgwKSUNQLUJyYXNpbDE9MDsGA1UECww0SW5zdGl0dXRv\r\nIE5hY2lvbmFsIGRlIFRlY25vbG9naWEgZGEgSW5mb3JtYWNhbyAtIElUSTE1MDMG\r\nA1UEAwwsQXV0b3JpZGFkZSBDZXJ0aWZpY2Fkb3JhIFJhaXogQnJhc2lsZWlyYSB2\r\nMTAwHhcNMjAwMzEyMTkzMTQyWhcNMzIwNzAxMTIwMDU5WjCBjDELMAkGA1UEBhMC\r\nQlIxEzARBgNVBAoMCklDUC1CcmFzaWwxNTAzBgNVBAsMLEF1dG9yaWRhZGUgQ2Vy\r\ndGlmaWNhZG9yYSBSYWl6IEJyYXNpbGVpcmEgdjEwMTEwLwYDVQQDDChBdXRvcmlk\r\nYWRlIENlcnRpZmljYWRvcmEgZG8gU0VSUFJPIFNTTHYxMIICIjANBgkqhkiG9w0B\r\nAQEFAAOCAg8AMIICCgKCAgEA61jQVBX27GVzyZkJuyrEezqjBGdLSJDFRyGdwxbm\r\n8Ntr0AA8blhDaN5ASDOjqDESMA7xF38znfkZWBMLxJ3Ob0271W6G9bqgTwp/svhZ\r\ns91UcbZW6sB7gyxzMTGWLxcFMeBrurM0QpMVsp8hDH5Suv5rfP0YB9brz60k104u\r\nHG625rAcbRKHn7XsWJ1ZUQcwRzx1g0L1NlUKpsk0+eOAxTcVSVRTO33k+n6Gve83\r\n4MXMiG6Orved4isnEvQnl4AecCXOuUuM3vXZ+kdJGTpNy1HOy0coFdKCJSSCxU/y\r\nTbTiAiRJTc8rbvor3I7k7wR4ZDR8alDbW/Sbw1JEMtbQqMOXEOV7iEUIub0/uNT2\r\ng0oM4pu8DAxhIwy2YQCpjfCbzYu2bf1nabuOEQ2B4mFt/zgoxa5FLsM+0IjpCi8u\r\nz9RqLvYFo9pIy5BTi7JMkVfbgqcOv7vkQf3xF7sODdInCVRIbB0R6xpHm+bpitx9\r\nt5ip+Sf24QFlKbjy0gwVAnaEyf/iQF+t8qgcFBO65kyfH/2vs6iYg5TNhFKtjpqQ\r\niTyI7YkRkfTbLFdcgZbiRUUs5TFi0BkS4PAWupO1GgV9sJdk9gm3Z+KNZDgoAnu7\r\nCvhq1JXt6t7qO96WzBx9q9hi7T6eld1VFrV5Ya5kxM9Lgh+XcBDwfnDLI1Yoozbd\r\nMbkCAwEAAaOCAVcwggFTMIGtBgNVHSAEgaUwgaIwTwYGYEwBAYEJMEUwQwYIKwYB\r\nBQUHAgEWN2h0dHBzOi8vcmVwb3NpdG9yaW8uc2VycHJvLmdvdi5ici9kb2NzL2Rw\r\nY3NlcnByb3NzbC5wZGYwTwYGYEwBAgFpMEUwQwYIKwYBBQUHAgEWN2h0dHBzOi8v\r\ncmVwb3NpdG9yaW8uc2VycHJvLmdvdi5ici9kb2NzL2RwY3NlcnByb3NzbC5wZGYw\r\nQAYDVR0fBDkwNzA1oDOgMYYvaHR0cDovL2FjcmFpei5pY3BicmFzaWwuZ292LmJy\r\nL0xDUmFjcmFpenYxMC5jcmwwHwYDVR0jBBgwFoAUdPN+//yfU3rxfOurPqSm2hi6\r\nRWMwHQYDVR0OBBYEFK0WT0vxDL7CiqKFGNcNRiWTIuPNMA8GA1UdEwEB/wQFMAMB\r\nAf8wDgYDVR0PAQH/BAQDAgGGMA0GCSqGSIb3DQEBDQUAA4ICAQCDvWkOYakalAHB\r\n3ZcifI9yLyuTtjR8eYXlfDesYr7zMFVlmduVghCgueBMZxmht9BpLq9/ceBWu1q8\r\nsKge5oNNyySPmBJFe+CLjtB7Z1Ljk0Q/7A59lMCDZajojJlSEnH6pdhxA1JD58E0\r\ndGsom3SufuBWxdNfgsvpQNXDoKp48VlkyL4DKFCdJExtzuR5IlcQbB1FrmB5m2zo\r\nGG6j7UdoevmikIv01la+8kyn7CF5aNubRE0cfwxulik5LNM1uLIwfUVwYbbQiB8z\r\nbaLUOS2lU/pYr+seLQ7VBPHps/guGB9hKei/Df49KWjDVplu3+AuZhBHqiK533VJ\r\nf9Uwv3Rvx8FCobT54OCrAVfnFs8F6sM3dPh1u7AbW3Ddpeo4oBH5kBA0feLvLk7v\r\nmOnOq64oPMMoj+g6x0B0v7tGqOrNBZK486MaU/uaJi+omx+Le9EfyIz39BbRYGdV\r\nJvO/9P8vn5XnNXsmqziw08ENLjHcrro48tRm3YX0/BUgoitjMUqyzlKTgQ8UOpfi\r\nXeJzqvxvUMO/HgZK9aknN3WQXWXxIFG01OHsEOTd2Nddqbrth5qmZE+1IxwEH+ys\r\nQQzlV0pnPL5K0bRuPCqvH4Jr0CmwV2PqD6dkjI/Sy77XDkTP8adAuYjIEynBoQ0b\r\ntqY/0rJPT3dztepWAwRHhKbvO1yYkA==\r\n-----END CERTIFICATE-----\r\n",
    "-----BEGIN CERTIFICATE-----\r\nMIIGrDCCBJSgAwIBAgIJANLVi0S/gZNCMA0GCSqGSIb3DQEBDQUAMIGYMQswCQYD\r\nVQQGEwJCUjETMBEGA1UECgwKSUNQLUJyYXNpbDE9MDsGA1UECww0SW5zdGl0dXRv\r\nIE5hY2lvbmFsIGRlIFRlY25vbG9naWEgZGEgSW5mb3JtYWNhbyAtIElUSTE1MDMG\r\nA1UEAwwsQXV0b3JpZGFkZSBDZXJ0aWZpY2Fkb3JhIFJhaXogQnJhc2lsZWlyYSB2\r\nMTAwHhcNMTkwNzAxMTkxNTU5WhcNMzIwNzAxMTIwMDU5WjCBmDELMAkGA1UEBhMC\r\nQlIxEzARBgNVBAoMCklDUC1CcmFzaWwxPTA7BgNVBAsMNEluc3RpdHV0byBOYWNp\r\nb25hbCBkZSBUZWNub2xvZ2lhIGRhIEluZm9ybWFjYW8gLSBJVEkxNTAzBgNVBAMM\r\nLEF1dG9yaWRhZGUgQ2VydGlmaWNhZG9yYSBSYWl6IEJyYXNpbGVpcmEgdjEwMIIC\r\nIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAk3AxKl1ZtP0pNyjChqO7qNkn\r\n+/sClZeqiV/Kd7KnnbkDbI2y3VWcUG7feCE/deIxot6GH6JXncRG794UZl+4doD0\r\nD0/cEwBd4DvrDSZm0RT40xhmYYOTxZDJxv+coTHdmsT5aNmSkktfjzYX4HQHh/7M\r\nem+kTOpT/3E4K6B7KVs9HkOT7nXx5yU1qYbVWqI0qpJM9mOTSFx8C9HiKcHvLCvt\r\n1ioXKPAmFuHPkayOcXP2MXeb+VRNjWKU4E+L2t5uZPKVx1M/9i1DztlLb4K8OfYg\r\nGaPDUSF1sxnoGk5qZHLleO6KjCpmuQepmgsBvxi2YNO7X2YUwQQx1AXNSolgtkAR\r\n5gt+1WzxhbFUhItQqlhqxgWHefLmiT5T/Ctz/P2v+zSO4efkkIzsi1iwD+ypZvM2\r\nlnIvB24RcSN6jzmCahLPX4CwjwIK6JsSoMVxIhpZHCguUP4LXqP8IWUZ6WgS/4zB\r\n7B9E0EICl2rM1PRy+6ulv+ZOW256e8a0pijUB+hXM1msUq9L92476FAAX8va3sP7\r\n+Uut94+bGHmubcTLImWUPrxNT7QyrvE3FyHicfiHioeFL2oV4cXTLZrEq2wS8R4P\r\nKPdSzNn5Z9e2uMEGYQaSNO+OwvVycpIhOBOqrm12wJ9ZhWKtM5UOo34/o37r5ZBI\r\nTYXAGbhqQDB9mWXwH+0CAwEAAaOB9jCB8zBOBgNVHSAERzBFMEMGBWBMAQEAMDow\r\nOAYIKwYBBQUHAgEWLGh0dHA6Ly9hY3JhaXouaWNwYnJhc2lsLmdvdi5ici9EUENh\r\nY3JhaXoucGRmMEAGA1UdHwQ5MDcwNaAzoDGGL2h0dHA6Ly9hY3JhaXouaWNwYnJh\r\nc2lsLmdvdi5ici9MQ1JhY3JhaXp2MTAuY3JsMB8GA1UdIwQYMBaAFHTzfv/8n1N6\r\n8Xzrqz6kptoYukVjMB0GA1UdDgQWBBR0837//J9TevF866s+pKbaGLpFYzAPBgNV\r\nHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBBjANBgkqhkiG9w0BAQ0FAAOCAgEA\r\neCNhBSuy/Ih/T+1VOtAJju85SrtoE3vET1qXASpmjQllDHG/ph7VFNRAkC+gha+B\r\nCbjoA5oJ/8wwl+Qdp1KGz6nXXFTLx3osU+kjm0srmBf9nyXHPqvFyvBeB0A7sYb7\r\nTmII9GKD20oCxsdkccR/oE/JuTaNnGq0GYZ2aDb5v62uLi21Y6P9UBiTxZqQ4ojW\r\nET6kXNjlK238jpXv17FR8Sg3VusCvX7Q8eJkavvHHZDeWck2fSA+ycAc2JeL2Z0B\r\nMSxGWpH32WM9J8+6XqCJUXHiWEV0zCE8wDYiYC+047pTxQI/gB/FcU7jvylh98DJ\r\nkQPHd/Tp6Og3ynlDA9n9uBbxYHVRZs9vsZ/7xTFaxRe+zk8dhgKgZ/3RrcMFB570\r\n2t8LFbyuUE/kQVY6rZ0QJ9qMWQ7VPLRwRhiMeU3k8WDJb/tBbOXHBqldTbWyQ+mp\r\nMEDWhbrzE/IED82wAuO23Tb05cYk2xC7+Izef8fSc3XdJDuPSbcDpWukzyCDtSEH\r\nisLiGEtIbYRiPsF3czlQPsnIEVoTTCWxHCH1zYR6zScSv18Qh69qVe2J40K5jZoP\r\nGEOhq/oKhVJQAdvAFW5Odp7mF3Tk9nivjjsctJSxY26LFiV5GRV+07SSse4ti0aO\r\njO5PLg5SWjfcOtBG2rz02EIvQAmLcb0kGBtfdj0lW/w=\r\n-----END CERTIFICATE-----\r\n",
  ];

  URLS = {
    DIST: {
      PROD: "https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl",
      HOM: "https://hom1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl",
    },
  };

  private async createSchema(NFEKey: string) {
    return {
      nfeDistDFeInteresse: {
        nfeDadosMsg: {
          distDFeInt: {
            tpAmb: 1,
            cUFAutor: 43,
            CNPJ: config.CNPJ,
            consChNFe: {
              ["chNFe"]: NFEKey,
            },
            "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
            "@_versao": "1.01",
          },
        },
        "@_xmlns": "http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe",
      },
    };
  }

  async getNFEByKey(NFEKey: string) {
    const a1 = new A1Service();
    const { cert, key } = await a1.p12ToPem();

    const AgentOptions = {
      cert,
      key,
      ca: this.CA,
      rejectUnauthorized: false,
    };

    const httpsAgent = new https.Agent(AgentOptions);

    const rq = await axios
      .create({
        baseURL: this.URLS.DIST.PROD,
        headers: {
          "User-Agent": `node-mde/0.14.13`,
          "Content-Type": "application/soap+xml; charset=utf-8",
        },
        httpsAgent: httpsAgent,
        timeout: 60000,
      })
      .request({
        method: "POST",
        data: XmlUtils.envelopar(
          XmlUtils.jsonToXml(await this.createSchema(NFEKey.replace(/ /g, ""))),
        ),
      });

    const data = await this.montarResponse(rq.data);
    console.log(data);
  }

  async montarResponse(data: string) {
    const retorno: any = {};

    const json = XmlUtils.xmlToJson(data);

    if (json.error) {
      retorno.error = json.error;
    }

    const {
      "soap:Envelope": {
        "soap:Body": {
          nfeDistDFeInteresseResponse: {
            nfeDistDFeInteresseResult: { retDistDFeInt = {} } = {},
          } = {},
        } = {},
      } = {},
    } = json;

    const { loteDistDFeInt = {} } = retDistDFeInt;

    if (loteDistDFeInt.docZip) {
      if (!Array.isArray(loteDistDFeInt.docZip)) {
        loteDistDFeInt["docZip"] = [loteDistDFeInt.docZip];
      }
    } else {
      loteDistDFeInt["docZip"] = [];
    }

    const docZip = await Promise.all(
      loteDistDFeInt["docZip"].map(async (doc: any) => {
        const notaXml = await GzipUtils.unzip(doc.value);
        const notaJson = XmlUtils.xmlToJson(notaXml);
        return {
          xml: notaXml,
          json: notaJson,
          nsu: doc["@_NSU"],
          schema: doc["@_schema"],
        };
      }),
    );

    retorno["tpAmb"] = retDistDFeInt.tpAmb || "";
    retorno["verAplic"] = retDistDFeInt.verAplic || "";
    retorno["cStat"] = retDistDFeInt.cStat || "";
    retorno["xMotivo"] = retDistDFeInt.xMotivo || "";
    retorno["dhResp"] = retDistDFeInt.dhResp || "";
    retorno["ultNSU"] = retDistDFeInt.ultNSU || "";
    retorno["maxNSU"] = retDistDFeInt.maxNSU || "";

    retorno["docZip"] = docZip;

    return retorno;
  }
}
