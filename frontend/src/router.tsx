import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

import { GameSelect } from './pages/GameSelect/GameSelect';
import { GridGame } from './pages/GridGame/GridGame';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Root } from './pages/Root/Root';
import { SignUp } from './pages/SignUp/SignUp';

const rootRoute = createRootRoute({
  component: Root,
});

const indexRoute = createRoute({
  component: Home,
  getParentRoute: () => rootRoute,
  path: '/',
});

const signUpRoute = createRoute({
  component: SignUp,
  getParentRoute: () => rootRoute,
  path: '/sign-up',
});

const loginRoute = createRoute({
  component: Login,
  getParentRoute: () => rootRoute,
  path: '/login',
});

const selectGameRoute = createRoute({
  component: GameSelect,
  getParentRoute: () => rootRoute,
  path: '/select-game',
});

const gridGameRoute = createRoute({
  component: GridGame,
  getParentRoute: () => rootRoute,
  path: '/grid-game',
});

const routeTree = rootRoute.addChildren([indexRoute, signUpRoute, loginRoute, selectGameRoute, gridGameRoute]);

export const router = createRouter({ defaultPreload: 'intent', routeTree });
