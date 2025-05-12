import zlib from "zlib";

export class GzipUtils {
  static unzip(str: string) {
    const buf = Buffer.from(str, "base64");
    return new Promise<string>((resolve, reject) => {
      zlib.unzip(buf, function (err, buffer) {
        if (err) reject(err);
        const content = buffer.toString("utf8");
        resolve(content);
      });
    });
  }
}
