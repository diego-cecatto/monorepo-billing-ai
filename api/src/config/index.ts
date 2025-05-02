import { config } from "dotenv";

config();

export default {
  port: process.env.PORT || 3001,
  openai: {
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    openaiApiBaseUrl:
      process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1",
    openaiApiModel: process.env.OPENAI_API_MODEL || "gpt-4",
    openaiApiMaxTokens: process.env.OPENAI_API_MAX_TOKENS || 1000,
    openaiApiTemperature:
      parseInt(process.env.OPENAI_API_TEMPERATURE || "0.5") || 0.5,
    openaiApiTopP: process.env.OPENAI_API_TOP_P || 1,
    openaiApiFrequencyPenalty: process.env.OPENAI_API_FREQUENCY_PENALTY || 0,
    openaiApiPresencePenalty: process.env.OPENAI_API_PRESENCE_PENALTY || 0,
  },
  a3: {
    clientId: process.env.A3_CLOUD_CLIENT_ID || "",
    clientSecret: process.env.A3_CLOUD_CLIENT_SECRET || "",
    service: process.env.A3_CLOUD_SERVICE_NAME || "",
  },
};
