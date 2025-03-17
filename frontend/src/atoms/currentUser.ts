import { atom } from "jotai";

export const currentUserAtom = atom<{
  userId: string;
  username: string;
} | null>(null);
