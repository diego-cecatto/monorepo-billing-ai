import { router } from "../config/rtpc";
import { analyzeRouter } from "./analyzeRoutes";
import { supplyRouter } from "./supplyRoutes";

export const appRouter = router({
  analyze: analyzeRouter,
  supply: supplyRouter,
});

export type AppRouter = typeof appRouter;
