import {
  createTRPCReact,
  type inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import type { AppRouter } from "api/src/routes";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type TrpcClientType = ReturnType<typeof createTRPCReact<AppRouter>>;

export const trpc: TrpcClientType = createTRPCReact<AppRouter>();

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
