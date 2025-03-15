import {
  createRootRoute,
  createRoute,
  createRouter
} from "@tanstack/react-router";
import { GridGame } from "./components/GridGame/GridGame";
import { Root } from "./components/Root/Root";

const rootRoute = createRootRoute({
  component: () => <Root />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: GridGame,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree, defaultPreload: "intent" });
