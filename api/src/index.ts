import express, { Express } from "express";
import cors from "cors";
import { createContext } from "./config/rtpc/context";
import { appRouter } from "./routes";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import config from "./config";

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

if (process.env.NODE_ENV === "production") {
  app.listen(config.port, () => {
    console.log(`tRPC server running on port ${config.port}`);
  });
}

export { app };
