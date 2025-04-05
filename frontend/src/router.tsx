import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

import { LoginPage } from './components/auth/LoginPage/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage/SignUpPage';
import { GridGame } from './components/GridGame/GridGame';
import { Root } from './components/Root/Root';

const rootRoute = createRootRoute({
  component: () => <Root />,
});

const indexRoute = createRoute({
  component: GridGame,
  getParentRoute: () => rootRoute,
  path: '/',
});

const signUpRoute = createRoute({
  component: () => <SignUpPage />,
  getParentRoute: () => rootRoute,
  path: '/sign-up',
});

const loginRoute = createRoute({
  component: () => <LoginPage />,
  getParentRoute: () => rootRoute,
  path: '/login',
});

const routeTree = rootRoute.addChildren([indexRoute, signUpRoute, loginRoute]);

export const router = createRouter({ defaultPreload: 'intent', routeTree });
