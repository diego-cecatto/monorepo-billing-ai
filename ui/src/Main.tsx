import ReactDOM from "react-dom/client";
import { trpc } from "@shared/trpc";
import { trpcClient } from "./config/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root") ?? document.createElement("div"),
).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>,
);
