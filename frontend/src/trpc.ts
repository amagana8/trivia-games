import { createTRPCClient, httpBatchLink, TRPCLink } from '@trpc/client';
import { observable, Unsubscribable } from '@trpc/server/observable';

import type { AppRouter } from '../../bff/src/router';

const refreshTokenLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      let next$: Unsubscribable;

      attempt(1);

      function attempt(attempts: number) {
        next$ = next(op).subscribe({
          complete() {
            observer.complete();
          },
          async error(error) {
            if (attempts < 2 && error.data && error.data.code === 'UNAUTHORIZED') {
              try {
                const res = await fetch(`${import.meta.env.VITE_BFF_URL}/refresh_token`, {
                  credentials: 'include',
                  method: 'POST',
                });

                if (res.ok) {
                  attempt(attempts + 1);
                } else {
                  const data = await res.json();
                  console.error('Failed to refresh token:', data.error);
                }
              } catch (e) {
                console.error('Error refreshing token:', e);
              }
            }
            observer.error(error);
          },
          next(value) {
            observer.next(value);
          },
        });
      }

      return () => {
        next$.unsubscribe();
      };
    });
  };
};

export const trpc = createTRPCClient<AppRouter>({
  links: [
    refreshTokenLink,
    httpBatchLink({
      fetch(url, options) {
        return fetch(url, { ...options, credentials: 'include' });
      },
      url: `${import.meta.env.VITE_BFF_URL}/trpc`,
    }),
  ],
});
