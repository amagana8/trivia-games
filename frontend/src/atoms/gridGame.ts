import { atom } from "jotai";
import type { Column } from "../../../bff/src/pb/gridGame";

export const gridGameAtom = atom<{ id: string; title: string; grid: Column[] }>(
  { id: "", title: "", grid: [] }
);

export const usedQuestionsAtom = atom(
  (get) => new Set(get(gridGameAtom).grid.flatMap(({ questions }) => questions))
);
