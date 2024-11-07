import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { GridGame } from "./components/GridGame/GridGame";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: GridGame,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree, defaultPreload: "intent" });
