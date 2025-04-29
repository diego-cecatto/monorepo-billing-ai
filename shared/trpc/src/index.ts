import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "api/src/routes";

type TrpcClientType = ReturnType<typeof createTRPCReact<AppRouter>>;

export const trpc: TrpcClientType = createTRPCReact<AppRouter>();
