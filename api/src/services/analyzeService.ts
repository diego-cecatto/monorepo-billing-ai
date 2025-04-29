// import config from "../config";
// import { openaiClient } from "../clients/openaiClient";
import { CompositionResult } from "../types/composition";

// product: string
export async function analyzeComposition(): Promise<CompositionResult> {
  // const response = await openaiClient.chat.completions.create({
  //   model: config.openai.openaiApiModel,
  //   messages: [
  //     {
  //       role: "system",
  //       content:
  //         "Você é um nutricionista que estrutura a composição de alimentos.",
  //     },
  //     {
  //       role: "user",
  //       content: `Analise o produto: "${product}" e retorne JSON conforme o tipo.`,
  //     },
  //   ],
  //   temperature: config.openai.openaiApiTemperature,
  // });
  // const content = response.choices[0].message.content;
  const content =
    '{ "name": "name", "ingredients": ["ingredient1", "ingredient2"], "isGlutenFree": true, "hasAllergens": false, "allergens": ["allergen1", "allergen2"] }';
  return JSON.parse(content || "{}") as CompositionResult;
}
