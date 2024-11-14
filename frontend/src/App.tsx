import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import type { FC } from "react";
import { router } from "./router";
import { trpc } from "./trpc";
import { httpBatchLink } from "@trpc/client";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "http://localhost:3003/trpc" })],
});

export const App: FC = () => (
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </trpc.Provider>
);
