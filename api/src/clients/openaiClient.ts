import { OpenAI } from "openai";
import config from "../config";

export const openaiClient = new OpenAI({ apiKey: config.openai.openaiApiKey });
