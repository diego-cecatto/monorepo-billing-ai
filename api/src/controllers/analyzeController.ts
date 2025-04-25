import { Request, Response, NextFunction } from "express";
import { analyzeComposition } from "../services/analyzeService";

export async function analyzeController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { product } = req.body;
    if (!product) {
      return res.status(400).json({ error: "Product is required" });
    }
    const result = await analyzeComposition(product);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
