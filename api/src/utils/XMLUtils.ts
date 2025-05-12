import { XMLBuilder, XMLParser } from "fast-xml-parser";

export class XmlUtils {
  static envelopar(xml: string) {
    return `<?xml version="1.0" encoding="utf-8"?><soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Body>${xml}</soap12:Body></soap12:Envelope>`;
  }

  static jsonToXml(json: any) {
    return new XMLBuilder({
      ignoreAttributes: false,
    }).build(json);
  }

  static xmlToJson(xml: string) {
    return new XMLParser({
      attributeNamePrefix: "@_",
      textNodeName: "value",
      ignoreAttributes: false,
      allowBooleanAttributes: false,
      parseAttributeValue: false,
      parseTagValue: false,
      trimValues: true,
    }).parse(xml);
  }
}
