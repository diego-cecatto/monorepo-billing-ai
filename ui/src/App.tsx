import { trpc } from "@shared/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
// import { Analyze } from "pages/Analyze";
import Home from "./pages/Home";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:5174/api",
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/test" element={<Home />} />
            {/* <Route path="/analyze" element={<Analyze />} /> */}
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
