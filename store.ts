import { atom } from "jotai";

export const tokenAtom = atom("");
export const emailAtom = atom("");
export const onlineAtom = atom(false);
export const onlineUsersAtom = atom(new Map<string, string>());