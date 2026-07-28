"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star, ShoppingBag, Check,
  Ruler, Heart, Plus
} from "lucide-react";
import GarmentMockup, { type GarmentFace } from "@/components/GarmentMockup";
import { Stepper } from "@/components/BuyBoxCard";
import { useAddToCart } from "@/lib/use-add-to-cart";
import {
  inr, tint, SIZES, CAP_SIZES, type Product, type College,
} from "@/lib/data";



export default function ProductDetail({ product, college }: { product: Product; college: College }) {
  const { added, addToCart, buyNow } = useAddToCart(product);
  const sizes = product.kind === "cap" ? CAP_SIZES : SIZES;
  const [size, setSize] = useState<string>(product.kind === "cap" ? "Free Size" : "M");
  const [qty, setQty] = useState(1);
  const [wish, setWish] = useState(false);

  const discount = Math.round((1 - product.price / product.mrp) * 100);

  return (
    <div className="grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_420px] gap-8 lg:gap-12 xl:gap-16 items-stretch">
      {/* gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 relative h-full">
        <button
          onClick={() => setWish((w) => !w)}
          className="absolute z-10 top-4 right-4 sm:top-6 sm:right-6 grid place-items-center w-11 h-11 rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white"
          aria-label="Wishlist"
        >
          <Heart className={`w-5 h-5 ${wish ? "fill-coral text-coral" : "text-ink"}`} />
        </button>

        <div
          className="relative overflow-hidden h-full min-h-[400px] grid place-items-center"
          style={{ background: tint(college.hue, 97) }}
        >
          <div className="relative w-[90%] h-[90%]">
            <Face product={product} college={college} face="front" sizes="(max-width: 640px) 100vw, 50vw" preload />
          </div>
        </div>

        <div
          className="relative overflow-hidden h-full min-h-[400px] grid place-items-center"
          style={{ background: tint(college.hue, 97) }}
        >
          <div className="relative w-[90%] h-[90%]">
            <Face product={product} college={college} face="back" sizes="(max-width: 640px) 100vw, 50vw" preload />
          </div>
        </div>
      </div>

      {/* info */}
      <div>
        <Link href={`/college/${college.id}`} className="chip chip-accent transition-colors">
          {college.name}
        </Link>
        <h1 className="mt-4 h-section">{product.name}</h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-coral text-coral" />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-muted">({product.reviews} reviews)</span>
          </span>
        </div>

        <div className="mt-5 flex items-end gap-3">
          <span className="font-display text-3xl font-extrabold track-display">{inr(product.price)}</span>
          <span className="text-lg text-muted line-through">{inr(product.mrp)}</span>
          {discount > 0 && <span className="mb-1 chip chip-accent chip-sq">Save {discount}%</span>}
        </div>
        <p className="mt-1 text-xs text-muted">Inclusive of all taxes · MRP incl. free campus print</p>

        {/* size */}
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <p className="h-card text-sm">Select size</p>
            <button className="flex items-center gap-1 text-xs text-muted hover:text-ink"><Ruler className="w-3.5 h-3.5" /> Size guide</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`min-w-[52px] px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  size === s ? "border-ink bg-ink text-white" : "border-line-strong bg-white hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* buy box */}
        <div className="mt-7 space-y-3">
          <div className="flex items-stretch gap-3">
            <Stepper qty={qty} setQty={setQty} name={product.name} />
            <button
              onClick={() => addToCart(qty, size)}
              className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full border-[1.5px] border-ink/85 bg-white text-[15px] text-ink transition-colors duration-200 hover:bg-ink hover:text-white"
            >
              {added ? <Check className="w-[18px] h-[18px]" /> : <ShoppingBag className="w-[18px] h-[18px]" />}
              {added ? "Added to bag" : "Add to cart"}
            </button>
          </div>
          <button
            onClick={() => buyNow(qty, size)}
            className="h-12 w-full rounded-xl bg-ink text-white text-[15px] font-medium transition-opacity duration-200 hover:opacity-85"
          >
            Buy it now · {inr(product.price * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}

function Face({
  product, college, face, zoom, sizes, preload,
}: {
  product: Product;
  college: College;
  face: GarmentFace;
  zoom?: boolean;
  sizes: string;
  preload?: boolean;
}) {
  const transform = zoom ? "scale(2.05) translateY(9%)" : undefined;

  if (product.photo) {
    return (
      <span className="absolute inset-0 overflow-hidden">
        <Image
          src={product.photo[face]}
          alt={`${product.name} — ${face}`}
          fill
          sizes={sizes}
          preload={preload}
          className="object-contain"
          style={{ transform }}
        />
      </span>
    );
  }

  return (
    <span className="absolute inset-0 overflow-hidden grid place-items-center">
      <GarmentMockup
        kind={product.kind}
        garment={product.garment}
        print={product.print}
        label={college.short}
        sub={product.section}
        face={face}
        className="w-full h-full"
        style={transform ? { transform } : undefined}
      />
    </span>
  );
}
