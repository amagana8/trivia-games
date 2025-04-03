import { atom } from "jotai";
import type { Column } from "../../../bff/src/pb/gridGame";
import { trpc } from "../trpc";

export const allGridGamesQueryAtom = atom(() => trpc.gridGame.getAllGridGames.query());

export const gridGameAtom = atom<{ id: string; title: string; grid: Column[] }>(
  { id: "", title: "", grid: [] }
);
