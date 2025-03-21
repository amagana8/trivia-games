import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import type { FC } from "react";
import { router } from "./router";
import { trpc } from "./trpc";
import { httpBatchLink } from "@trpc/client";
import { CssBaseline } from "@mui/material";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3003/trpc",
      fetch(url, options) {
        return fetch(url, { ...options, credentials: "include" });
      },
    }),
  ],
});

export const App: FC = () => (
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </trpc.Provider>
);
