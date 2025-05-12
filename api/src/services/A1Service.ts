import https from "https";
import fs from "fs/promises";
import { SignedXml } from "xml-crypto";
import forge from "node-forge";
import config from "../config";
// import { DOMParser } from "@xmldom/xmldom";

export class A1Service {
  constructor() {
    if (!config.a1.pfxPassword) {
      throw new Error("pfxPassword are required");
    }
  }

  async readFile() {
    return await fs.readFile("./cert/certificate.pfx");
  }

  async asignHeader(axiosHeader: any) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      passphrase: config.a1.pfxPassword,
      pfx: await this.readFile(),
    });
    axiosHeader.httpsAgent = httpsAgent;
  }

  private async extractKeyAndCert(): Promise<{
    privateKeyPem: string;
    certificatePem: string;
  }> {
    const pfx = await this.readFile();
    const p12Asn1 = forge.asn1.fromDer(pfx.toString("binary"), false);
    const p12 = forge.pkcs12.pkcs12FromAsn1(
      p12Asn1,
      false,
      config.a1.pfxPassword,
    );

    const keyObj = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[
      forge.pki.oids.pkcs8ShroudedKeyBag
    ]?.[0]?.key;

    const certObj = p12.getBags({ bagType: forge.pki.oids.certBag })[
      forge.pki.oids.certBag
    ]?.[0]?.cert;

    if (!keyObj || !certObj) {
      throw new Error("keyObj or certObj not found");
    }
    return {
      privateKeyPem: forge.pki.privateKeyToPem(keyObj),
      certificatePem: forge.pki.certificateToPem(certObj),
    };
  }

  async signXml(xml: string): Promise<string> {
    const { privateKeyPem, certificatePem } = await this.extractKeyAndCert();

    const sig = new SignedXml({
      privateKey: privateKeyPem,
      publicCert: certificatePem,
      signatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
      canonicalizationAlgorithm:
        "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
    });

    sig.addReference({
      xpath: "//*[local-name()='consSitNFe']",
      transforms: [
        "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
        "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
      ],
      digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
    });
    sig.computeSignature(xml);

    return sig.getSignedXml();
  }

  async signSoapRequest(options: any) {
    options.pfx = await this.readFile();
    options.passphrase = config.a1.pfxPassword;
    options.strictSSL = true;
  }

  async getAgent() {
    const pfx = await this.readFile();

    return new https.Agent({
      pfx,
      passphrase: config.a1.pfxPassword,
      rejectUnauthorized: true,
    });
  }

  async p12ToPem() {
    if (!config.a1.pfxPassword) {
      throw new Error("pfxPassword are required");
    }

    const p12buffer = (await this.readFile()).toString("base64");

    const asn = forge.asn1.fromDer(forge.util.decode64(p12buffer));
    const p12 = forge.pkcs12.pkcs12FromAsn1(asn, true, config.a1.pfxPassword);

    const keyData = p12
      .getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })
      ?.[
        forge.pki.oids.pkcs8ShroudedKeyBag
      ]?.concat(p12.getBags({ bagType: forge.pki.oids.keyBag })?.[forge.pki.oids.keyBag] ?? []);

    const certBags = p12
      .getBags({ bagType: forge.pki.oids.certBag })
      ?.[
        forge.pki.oids.certBag
      ]?.sort((a, b) => new Date(a.cert!.validity.notAfter).getTime() - new Date(b.cert!.validity.notAfter).getTime());

    if (!keyData?.[0].key || !certBags?.[0].cert) {
      throw new Error("keyData or certBags not found");
    }
    const rsaPrivateKey = forge.pki.privateKeyToAsn1(keyData[0].key);
    const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);
    const cert = forge.pki.certificateToPem(certBags[0].cert)?.toString();
    const key = forge.pki.privateKeyInfoToPem(privateKeyInfo)?.toString();

    if (!cert || !key) {
      throw new Error("cert or key not found");
    }

    return {
      cert,
      key,
    };
  }
}
