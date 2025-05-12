import { Request, Response, NextFunction } from "express";

export class SupplyController {
  async DANFEProducts(req: Request, res: Response, next: NextFunction) {
    try {
      //   const { product } = req.body;
      //   if (!product) {
      //     return res.status(400).json({ error: "Product is required" });
      //   }
      //   const result = await analyzeComposition(product);
      //   res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
