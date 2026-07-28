"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, ShoppingBag, Trash2, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { inr } from "@/lib/data";
import CartLineThumb from "@/components/CartLineThumb";

export default function CartDrawer() {
  const { lines, open, setOpen, remove, setQty, subtotal } = useCart();
  const mounted = useHydrated();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const total = mounted ? subtotal() : 0;
  const shipping = total > 999 || total === 0 ? 0 : 79;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[61] h-full w-full max-w-[420px] bg-bg border-l border-line flex flex-col"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-line">
              <div className="flex items-center gap-2 h-card text-lg">
                <ShoppingBag className="w-5 h-5" /> Your Bag
                <span className="text-muted font-semibold text-sm">({lines.length})</span>
              </div>
              <button onClick={() => setOpen(false)} className="grid place-items-center w-9 h-9 rounded-lg border border-line-strong bg-white transition-colors hover:bg-bg-soft" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 grid place-items-center text-center px-8">
                <div>
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-coral-soft grid place-items-center">
                    <ShoppingBag className="w-7 h-7 text-ink" />
                  </div>
                  <p className="mt-5 h-card text-lg">Your bag is empty</p>
                  <p className="mt-1 text-sm text-muted">Add some campus pride to get started.</p>
                  <Link href="/shop" onClick={() => setOpen(false)} className="mt-5 btn btn-sm btn-accent">
                    Start shopping
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {lines.map((l) => (
                    <motion.div
                      key={l.key}
                      layout
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}
                      className="flex gap-3 p-2.5 rounded-xl bg-bg-soft"
                    >
                      <div className="relative w-20 h-20 rounded-lg bg-bg shrink-0 overflow-hidden">
                        <CartLineThumb line={l} sizes="80px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="h-card text-sm leading-snug truncate">{l.name}</p>
                        <p className="text-xs text-muted mt-0.5">Size {l.size}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-line-strong rounded-md bg-bg">
                            <button onClick={() => setQty(l.key, l.qty - 1)} className="w-7 h-7 grid place-items-center hover:bg-coral-soft transition-colors" aria-label="Decrease"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
                            <button onClick={() => setQty(l.key, l.qty + 1)} className="w-7 h-7 grid place-items-center hover:bg-coral-soft transition-colors" aria-label="Increase"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                          <span className="text-sm font-bold">{inr(l.price * l.qty)}</span>
                        </div>
                      </div>
                      <button onClick={() => remove(l.key)} className="self-start text-muted hover:text-coral transition-colors" aria-label="Remove"><Trash2 className="w-4 h-4" /></button>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-line px-5 py-4 space-y-3">
                  <div className="flex justify-between text-sm text-muted">
                    <span>Subtotal</span><span className="text-ink font-bold">{inr(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted">
                    <span>Shipping</span>
                    <span className="text-ink font-bold">{shipping === 0 ? "Free" : inr(shipping)}</span>
                  </div>
                  <div className="flex justify-between h-card text-lg pt-2 border-t border-line">
                    <span>Total</span><span>{inr(total + shipping)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="btn btn-accent btn-block"
                  >
                    Checkout · {inr(total + shipping)}
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center py-2 text-sm font-bold underline underline-offset-4 text-ink-soft hover:text-ink transition-colors"
                  >
                    View full cart
                  </Link>
                  <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secure checkout · 7-day easy returns
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
