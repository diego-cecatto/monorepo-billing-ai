import config from "../config";
import { openaiClient } from "../clients/openaiClient";
import { CompositionResult } from "../types/composition";

export async function analyzeComposition(
  product: string,
): Promise<CompositionResult> {
  const response = await openaiClient.chat.completions.create({
    model: config.openai.openaiApiModel,
    messages: [
      {
        role: "system",
        content:
          "Você é um nutricionista que estrutura a composição de alimentos.",
      },
      {
        role: "user",
        content: `Analise o produto: "${product}" e retorne JSON conforme o tipo.`,
      },
    ],
    temperature: config.openai.openaiApiTemperature,
  });
  const content = response.choices[0].message.content;
  return JSON.parse(content || "{}") as CompositionResult;
}
