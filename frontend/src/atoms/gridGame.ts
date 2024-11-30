import { atom } from "jotai";
import type { Column } from "../../../bff/src/pb/gridGame";

export const gridGameAtom = atom<Column[]>([]);

export const usedQuestionsAtom = atom((get) =>
  new Set(get(gridGameAtom).flatMap(({ questions }) => questions))
);
