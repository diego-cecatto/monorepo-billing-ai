import config from "../config";
import { openaiClient } from "../clients/openaiClient";
import { Product, Unit } from "../types/composition";

export async function analyzeComposition(): Promise<Product> {
  const product = "Coxinha";
  const example: Product = {
    name: "Coxinha",
    ingredients: {
      ingredient1: {
        name: "ingredient1",
        quantity: "quantity",
        unit: Unit.Gram,
      },
    },
    isGlutenFree: true,
    isLactoseFree: true,
    isNutFree: true,
    isVegetarian: true,
    allergens: ["gluten", "lactose"],
  };
  const response = await openaiClient.chat.completions.create({
    model: config.openai.openaiApiModel,
    messages: [
      {
        role: "system",
        content: `Você é um padeiro e precisará determinar os ingredientes e a quatidade de cada ingrediente, retornando um JSON, como no exemplo:
         ${JSON.stringify(example, null, 2)}.`,
      },
      {
        role: "user",
        content: `Analise o produto: "${product}" e retorne JSON conforme o tipo.`,
      },
    ],
    temperature: config.openai.openaiApiTemperature,
  });
  const content = response.choices[0].message.content;
  // const content =
  // '{ "name": "name", "ingredients": ["ingredient1", "ingredient2"], "isGlutenFree": true, "hasAllergens": false, "allergens": ["allergen1", "allergen2"] }';
  return JSON.parse(content || "{}") as Product;
}
