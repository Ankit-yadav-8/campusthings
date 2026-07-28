"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { inr } from "@/lib/data";
import CartLineThumb from "@/components/CartLineThumb";

export default function CartPage() {
  const { lines, remove, setQty, subtotal } = useCart();
  const mounted = useHydrated();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<string>("");

  const total = mounted ? subtotal() : 0;
  const shipping = total > 999 || total === 0 ? 0 : 79;
  const discount = Math.round(total * applied);
  const payable = total - discount + shipping;

  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (c === "CAMPUS10") { setApplied(0.1); setCouponMsg("10% off applied 🎉"); }
    else if (c === "VIBE20") { setApplied(0.2); setCouponMsg("20% off applied 🎉"); }
    else { setApplied(0); setCouponMsg("Invalid code — try CAMPUS10"); }
  };

  if (mounted && lines.length === 0) {
    return (
      <div className="container-x py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-coral-soft grid place-items-center">
            <ShoppingBag className="w-9 h-9 text-ink" />
          </div>
          <h1 className="mt-7 h-section">Your bag is <span className="text-coral-strong accent-rule">empty</span></h1>
          <p className="mt-2 text-ink-soft">Looks like you haven&apos;t added any campus pride yet.</p>
          <Link href="/shop" className="mt-8 btn btn-accent">
            Start shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <h1 className="h-section">
        Your cart {mounted && <span className="text-muted">({lines.length})</span>}
      </h1>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* lines */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {mounted && lines.map((l) => (
              <motion.div
                key={l.key}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="flex gap-4 p-4 card-brut"
              >
                <Link href={`/product/${l.productId}`} className="relative w-24 h-24 rounded-xl bg-bg-soft shrink-0 overflow-hidden">
                  <CartLineThumb line={l} sizes="96px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/product/${l.productId}`} className="h-card leading-snug hover:text-coral transition-colors line-clamp-1">{l.name}</Link>
                      <p className="text-xs text-muted mt-0.5 capitalize">Size {l.size} · {l.kind}</p>
                    </div>
                    <button onClick={() => remove(l.key)} className="text-muted hover:text-coral transition-colors" aria-label="Remove">
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-line-strong rounded-lg bg-white">
                      <button onClick={() => setQty(l.key, l.qty - 1)} className="w-8 h-8 grid place-items-center hover:bg-coral-soft transition-colors" aria-label="Decrease"><Minus className="w-4 h-4" /></button>
                      <span className="w-8 text-center text-sm font-bold">{l.qty}</span>
                      <button onClick={() => setQty(l.key, l.qty + 1)} className="w-8 h-8 grid place-items-center hover:bg-coral-soft transition-colors" aria-label="Increase"><Plus className="w-4 h-4" /></button>
                    </div>
                    <span className="font-display font-extrabold">{inr(l.price * l.qty)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4 text-ink-soft hover:text-ink transition-colors">
            ← Continue shopping
          </Link>
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-28 card-brut bg-bg-soft p-6 space-y-4">
          <h2 className="h-card text-lg">Order summary</h2>

          {/* coupon */}
          <div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="field h-11 pl-9 pr-3 text-sm uppercase"
                />
              </div>
              <button onClick={applyCoupon} className="btn btn-sm btn-accent h-11 shrink-0">Apply</button>
            </div>
            {couponMsg && <p className={`mt-2 text-xs font-bold ${applied > 0 ? "text-ink" : "text-coral"}`}>{couponMsg}</p>}
            <p className="mt-1.5 text-[11px] text-muted">Try <b>CAMPUS10</b> or <b>VIBE20</b></p>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-line text-sm">
            <Row label="Subtotal" value={inr(total)} />
            {discount > 0 && <Row label="Discount" value={`− ${inr(discount)}`} accent />}
            <Row label="Shipping" value={shipping === 0 ? "Free" : inr(shipping)} />
          </div>
          <div className="flex justify-between h-card text-xl pt-3 border-t border-line">
            <span>Total</span><span>{inr(payable)}</span>
          </div>

          <Link href="/checkout" className="btn btn-accent btn-block mt-1">
            Proceed to checkout <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="pt-2 space-y-2 text-xs text-muted">
            <p className="flex items-center gap-2"><Truck className="w-3.5 h-3.5" /> Free shipping on orders over ₹999</p>
            <p className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" /> Secure checkout · 7-day easy returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className={accent ? "font-bold text-coral" : "font-bold text-ink"}>{value}</span>
    </div>
  );
}
