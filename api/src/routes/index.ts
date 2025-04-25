import { router } from "../config/rtpc";
import { analyzeRouter } from "./analyzeRoutes";

export const appRouter = router({
  analyze: analyzeRouter,
});

export type AppRouter = typeof appRouter;
