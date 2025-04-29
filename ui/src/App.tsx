import { trpc } from "@shared/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
// import { httpBatchLink } from "@trpc/client";

export const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // httpBatchLink({
        //   url: "/trpc",
        // }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div>
          <h1>Wellcome</h1>
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
