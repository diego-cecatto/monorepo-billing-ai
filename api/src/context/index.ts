import { openaiClient } from "../clients/openaiClient";

export function createContext() {
  return { openaiClient };
}
export type Context = ReturnType<typeof createContext>;
