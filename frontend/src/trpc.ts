import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../bff/src/router";

export const trpc = createTRPCReact<AppRouter>();
