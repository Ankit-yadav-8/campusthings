"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/data";

/**
 * Everything a product needs to reach the bag, in one place: the line is
 * built from the product exactly once, so the grid cards, the buy-box cards
 * and the detail page can't disagree about what got added.
 *
 * `added` latches for a beat so a button can show a tick without the caller
 * having to own a timer.
 */
export function useAddToCart(product: Product) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const line = (size: string) => ({
    productId: product.id,
    name: product.name,
    collegeId: product.collegeId,
    price: product.price,
    garment: product.garment,
    print: product.print,
    kind: product.kind,
    size,
    photo: product.photo,
  });

  const defaultSize = product.kind === "cap" ? "Free Size" : "M";

  return {
    added,
    /** adds and opens the drawer (the store does the opening) */
    addToCart(qty = 1, size = defaultSize) {
      add(line(size), qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    },
    /** straight to checkout — the drawer would be in the way here */
    buyNow(qty = 1, size = defaultSize) {
      add(line(size), qty);
      useCart.getState().setOpen(false);
      router.push("/checkout");
    },
  };
}
