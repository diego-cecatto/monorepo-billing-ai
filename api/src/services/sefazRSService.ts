// import { itemNFCe } from "types/nfse/item";
// import xml2js from "xml2js";

import SeproIDClient, { Certificate } from "./seproService";

export class SefasRSService {
  constructor() {}

  async getProducts(NFSEKey: string) {
    // const xmlKey = `<?xml version="1.0" encoding="UTF-8"?>
    // <consSitNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
    //     <tpAmb>1</tpAmb>
    //     <xServ>CONSULTAR</xServ>
    //     <chNFe>${NFSEKey}</chNFe>
    // </consSitNFe>`;
    const client = new SeproIDClient();

    // Descobre certificados
    const certs: Certificate[] = await client.discoverCertificates();
    console.log(NFSEKey);
    console.log("Certificados:", certs);

    // const res = await fetch(
    //   `https://nfe.sefazrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/soap+xml; charset=utf-8",
    //     },
    //     body: xmlKey,
    //   }
    // );

    // const parser = new DOMParser();
    // const doc = parser.parseFromString(await res.text(), "text/xml");

    // const xml = doc.documentElement.outerHTML;

    // const parser2 = new xml2js.Parser();
    // const result = await parser2.parseStringPromise(xml);

    // if (result.retEvento.protNFe.cStat[0] !== "100") {
    //   throw new Error(`Error: ${result.retEvento.protNFe.xMotivo[0]}`);
    // }

    // return {
    //   chNFe: result.retEvento.protNFe.chNFe[0],
    //   itens: result.retEvento.protNFe.NFe.infNFe[0].det.map(
    //     (item: itemNFCe) => ({
    //       descricao: item.prod[0].xProd[0],
    //       quantidade: parseFloat(item.prod[0].qCom[0]),
    //       unidade: item.prod[0].uCom[0],
    //       preco: parseFloat(item.prod[0].vUnCom[0]),
    //       valorTotal: parseFloat(item.prod[0].vProd[0]),
    //     })
    //   ),
    //   xMotivo: result.retEvento.protNFe.xMotivo[0],
    // };
  }
}
