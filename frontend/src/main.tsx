import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GridGame } from './components/GridGame/GridGame';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: GridGame,
});
const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree, defaultPreload: 'intent' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
