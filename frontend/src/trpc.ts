import { createTRPCClient, httpBatchLink } from '@trpc/client';

import type { AppRouter } from '../../bff/src/router';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      fetch(url, options) {
        return fetch(url, { ...options, credentials: 'include' });
      },
      url: `${import.meta.env.VITE_BFF_URL}/trpc`,
    }),
  ],
});
