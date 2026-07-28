"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import GarmentThumb from "@/components/GarmentThumb";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { inr, type Product } from "@/lib/data";

/* ------------------------------------------------------------------ *
 *  Storefront card with the controls on the card.
 *
 *  The whole buying decision sits in the tile: quantity, add to cart and
 *  a straight-to-checkout button, so a shopper who already knows the size
 *  they want never has to open the product page. Used for the t-shirt
 *  shelves, where that's the common case.
 *
 *  Note the card is deliberately *not* one big link — buttons can't be
 *  nested inside an anchor. The image, title and price link through; the
 *  controls are siblings.
 * ------------------------------------------------------------------ */
export default function BuyBoxCard({
  product, index = 0,
}: { product: Product; index?: number }) {
  const { added, addToCart, buyNow } = useAddToCart(product);
  const [qty, setQty] = useState(1);
  const onSale = product.mrp > product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col min-w-0"
    >
      <Link
        href={`/product/${product.id}`}
        className="block rounded-xl overflow-hidden"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f6f6f6] rounded-xl">
          <GarmentThumb
            product={product}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
            hoverFlip
          />
          {onSale && (
            <span className="absolute top-3 right-3 z-10 rounded-full bg-white px-3 py-1 text-[11px] leading-none text-ink shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              Sale
            </span>
          )}
        </div>
      </Link>

      <Link href={`/product/${product.id}`} className="block mt-3.5">
        <h3 className="text-[15px] leading-snug text-ink line-clamp-1">{product.name}</h3>
        <p className="mt-1 flex items-baseline gap-2 text-[13.5px]">
          <span className="text-ink">{inr(product.price)}</span>
          {onSale && <span className="text-muted line-through">{inr(product.mrp)}</span>}
        </p>
      </Link>

      {/* controls — pushed to the bottom so every card in a row lines its
          buttons up even when the titles wrap to different heights */}
      <div className="mt-3 flex flex-col gap-2.5 flex-1 justify-end">
        {/* Wraps rather than overflows. The stepper is a fixed 111px and the
            button can't shrink below its label, which together need ~264px —
            more than a shop column gets at xl:grid-cols-4, so the row used to
            spill over the neighbouring card. Given a basis wider than the
            label, the button drops to its own full-width line instead
            whenever it can't sit beside the stepper. */}
        <div className="flex flex-wrap items-stretch gap-2.5">
          <Stepper qty={qty} setQty={setQty} name={product.name} />

          <button
            onClick={() => addToCart(qty)}
            className="flex-1 basis-36 min-w-0 inline-flex items-center justify-center gap-2 h-12 px-4 rounded-full border-[1.5px] border-ink/85 bg-white text-[14.5px] text-ink transition-colors duration-200 hover:bg-ink hover:text-white"
          >
            {added ? <Check className="w-[18px] h-[18px]" /> : <ShoppingBag className="w-[18px] h-[18px]" />}
            <span className="truncate">{added ? "Added" : "Add to cart"}</span>
          </button>
        </div>

        <button
          onClick={() => buyNow(qty)}
          className="h-12 w-full rounded-xl bg-ink text-white text-[15px] font-medium transition-opacity duration-200 hover:opacity-85"
        >
          Buy it now
        </button>
      </div>
    </motion.div>
  );
}

/* − 1 + in a rounded well. Shared with the product page's buy box. */
export function Stepper({
  qty, setQty, name,
}: { qty: number; setQty: (n: number) => void; name: string }) {
  return (
    <div className="flex items-center h-12 rounded-xl border-[1.5px] border-ink/85 bg-white shrink-0">
      <button
        onClick={() => setQty(Math.max(1, qty - 1))}
        disabled={qty <= 1}
        aria-label={`Decrease quantity of ${name}`}
        className="grid place-items-center w-10 h-full rounded-l-xl text-ink transition-colors hover:bg-black/[0.04] disabled:opacity-35 disabled:hover:bg-transparent"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-7 text-center text-[15px] tabular-nums text-ink">{qty}</span>
      <button
        onClick={() => setQty(qty + 1)}
        aria-label={`Increase quantity of ${name}`}
        className="grid place-items-center w-10 h-full rounded-r-xl text-ink transition-colors hover:bg-black/[0.04]"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
