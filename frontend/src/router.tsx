import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { GridGame } from "./components/GridGame/GridGame";
import { Root } from "./components/Root/Root";
import { SignUpPage } from "./components/auth/SignUpPage/SignUpPage";
import { LoginPage } from "./components/auth/LoginPage/LoginPage";

const rootRoute = createRootRoute({
  component: () => <Root />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: GridGame,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: () => <SignUpPage />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

const routeTree = rootRoute.addChildren([indexRoute, signUpRoute, loginRoute]);

export const router = createRouter({ routeTree, defaultPreload: "intent" });
