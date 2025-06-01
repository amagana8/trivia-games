import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import { GameSelect } from './pages/GameSelect/GameSelect';
import { GridGame } from './pages/GridGame/GridGame';
import { Home } from './pages/Home/Home';
import { Lobby } from './pages/Lobby/Lobby';
import { Login } from './pages/Login/Login';
import { PlaySelect } from './pages/PlaySelect/PlaySelect';
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

const selectPlayRoute = createRoute({
  component: PlaySelect,
  getParentRoute: () => rootRoute,
  path: '/play',
});

const lobbyRoute = createRoute({
  component: Lobby,
  getParentRoute: () => rootRoute,
  path: '/lobby/$gameRoomId',
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  signUpRoute,
  loginRoute,
  selectGameRoute,
  gridGameRoute,
  selectPlayRoute,
  lobbyRoute,
]);

export const router = createRouter({ defaultPreload: 'intent', routeTree });
