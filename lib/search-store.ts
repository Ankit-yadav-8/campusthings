"use client";

import { create } from "zustand";

/**
 * Open state for the site-wide search overlay. It lives in a store rather
 * than in the navbar so anything on the page can raise it — the nav icon
 * today, an empty-state prompt or a keyboard shortcut later — without
 * threading a callback down through the tree.
 *
 * Deliberately not persisted: a search panel that reopens itself on the
 * next visit would be a bug, not a feature.
 */
interface SearchState {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export const useSearch = create<SearchState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
