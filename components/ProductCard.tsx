"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Plus, Check } from "lucide-react";
import { useState } from "react";
import GarmentThumb from "@/components/GarmentThumb";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { inr, type Product, getCollege } from "@/lib/data";

/* ------------------------------------------------------------------ *
 *  The compact product card — everything that isn't a t-shirt.
 *
 *  Flat: a soft grey image tile and left-aligned type, no border around
 *  the card and no offset shadow. The tile's fill is the only thing
 *  separating the product from the page, which is enough, and it means a
 *  grid of these reads as a row of garments rather than a row of boxes.
 *
 *  Same silhouette as BuyBoxCard so the two can sit in one grid — that
 *  one just carries the buying controls as well.
 * ------------------------------------------------------------------ */
export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { added, addToCart } = useAddToCart(product);
  const [liked, setLiked] = useState(false);
  const college = getCollege(product.collegeId);
  const onSale = product.mrp > product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <div className="relative">
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#f6f6f6]">
            <GarmentThumb
              product={product}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
              hoverFlip
            />
          </div>
        </Link>

        {onSale && (
          <span className="pointer-events-none absolute top-3 right-3 z-10 rounded-full bg-white px-3 py-1 text-[11px] leading-none text-ink shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            Sale
          </span>
        )}

        {/* Both controls are mouse-only affordances sitting on the tile —
            the product page has the real, keyboard-reachable versions. */}
        <button
          onClick={() => setLiked((v) => !v)}
          tabIndex={-1}
          aria-label={`Save ${product.name}`}
          className="absolute top-3 left-3 grid place-items-center w-9 h-9 rounded-full bg-white/90 text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-coral-strong text-coral-strong" : ""}`} />
        </button>

        <button
          onClick={() => addToCart()}
          tabIndex={-1}
          aria-label={`Quick add ${product.name} to cart`}
          className="absolute bottom-3 right-3 grid place-items-center w-9 h-9 rounded-full bg-white text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      <Link href={`/product/${product.id}`} className="block mt-3.5">
        <p className="text-[11.5px] tracking-wide text-muted">{college?.short}</p>
        <h3 className="mt-1 text-[15px] leading-snug text-ink line-clamp-1">
          {product.name.split("·").slice(1).join("·").trim() || product.name}
        </h3>
        <p className="mt-1 flex items-baseline gap-2 text-[13.5px]">
          <span className="text-ink">{inr(product.price)}</span>
          {onSale && <span className="text-muted line-through">{inr(product.mrp)}</span>}
        </p>
      </Link>
    </motion.div>
  );
}
