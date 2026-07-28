"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Photo } from "@/lib/data";

export interface CartLine {
  key: string;         // productId + size
  productId: string;
  name: string;
  collegeId: string;
  price: number;
  garment: string;
  print: string;
  kind: string;
  size: string;
  qty: number;
  /** photographed products carry their shots so the bag shows the real
      garment rather than falling back to the mockup */
  photo?: Photo;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  add: (line: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      add: (line, qty = 1) =>
        set((s) => {
          const key = `${line.productId}__${line.size}`;
          const existing = s.lines.find((l) => l.key === key);
          if (existing) {
            return {
              open: true,
              lines: s.lines.map((l) =>
                l.key === key ? { ...l, qty: l.qty + qty } : l
              ),
            };
          }
          return { open: true, lines: [...s.lines, { ...line, key, qty }] };
        }),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      setQty: (key, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.key === key ? { ...l, qty: Math.max(1, qty) } : l))
            .filter((l) => l.qty > 0),
        })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
      count: () => get().lines.reduce((n, l) => n + l.qty, 0),
      subtotal: () => get().lines.reduce((n, l) => n + l.qty * l.price, 0),
    }),
    { name: "campusthreads-cart" }
  )
);
