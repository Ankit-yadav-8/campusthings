"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion, useMotionValue, useSpring, useTransform, useReducedMotion,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { type Product } from "@/lib/data";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/* The stack is a composition, not a grid: each slot is placed by hand
   inside an aspect-ratio box so the arrangement survives every viewport.
   `depth` drives how far the card drifts under the cursor. Captions sit
   on the print's bottom margin, the way a contact sheet is annotated.

   Ratios sit close to the 1:1 source so object-cover only trims a few
   percent — the mockups are front/back pairs and lose their point the
   moment a sleeve gets cropped off. */
const SLOTS = [
  {
    caption: "ROORKEE / 01",
    img: "/mockups/roorkee-01.png",
    alt: "IIT Roorkee navy tee, front and back",
    box: "right-0 top-0 w-[57%] z-10",
    tilt: 2.6,
    depth: 14,
    ratio: "aspect-[4/4.2]",
  },
  {
    caption: "DELHI / 02",
    img: "/mockups/delhi-02.png",
    alt: "IIT Delhi tee, front and back",
    box: "left-0 top-[24%] w-[49%] z-30",
    tilt: -3.6,
    depth: 34,
    ratio: "aspect-[3/3.4]",
  },
  {
    caption: "ROORKEE / 03",
    img: "/mockups/roorkee-03.png",
    alt: "IIT Roorkee tee, front and back detail",
    box: "right-[5%] bottom-0 w-[47%] z-20",
    tilt: 1.4,
    depth: 24,
    ratio: "aspect-[4/3.6]",
    selected: true,
  },
] as const;

export default function Hero({ products }: { products: Product[] }) {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);

  // raw pointer offset from the stack's centre, normalised to -0.5…0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 110, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 110, damping: 18, mass: 0.4 });

  function track(e: React.MouseEvent) {
    if (reduce) return;
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function release() {
    px.set(0);
    py.set(0);
  }

  return (
    <section className="relative overflow-hidden">
      <div className="container-x pt-12 pb-12 lg:pt-16 lg:pb-16">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-14 lg:gap-10 items-center">
          {/* ========================= copy ========================= */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            {/* lines are explicit — the rule under the accent line has to
                break exactly where the design says, not where measure says */}
            <h1 className="hero-heading text-ink">
              <span className="block">Master your</span>
              <span className="block">
                <span className="text-coral-strong accent-rule">campus life</span>
              </span>
              <span className="block">
                grind<span className="text-coral-strong">.</span>
              </span>
            </h1>

            <div className="body-light mt-8 max-w-[44ch] text-[17px] leading-[1.6] text-ink-soft">
              <p>Curated kits and essentials for the 4 a.m. deadlines.</p>
              {/* Prata has no italic, so this stays on Inter — which does */}
              <p className="italic mt-1">Honest picks, peer made.</p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/shop" className="btn btn-accent group">
                Start packing
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

          </motion.div>

          {/* ======================= card stack ====================== */}
          <div
            ref={stage}
            onMouseMove={track}
            onMouseLeave={release}
            className="relative w-full max-w-[560px] mx-auto lg:max-w-none aspect-square"
          >
            <DropSeal />

            {SLOTS.map((slot, i) => (
              <PhotoCard
                key={slot.caption}
                slot={slot}
                product={products[i % Math.max(products.length, 1)]}
                sx={sx}
                sy={sy}
                delay={0.15 + i * 0.12}
                eager={i === 0}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

/* ------------------------------------------------------------------ *
 *  A single print in the stack. Lives in its own component so it can
 *  own the hooks that map the shared pointer springs to its depth.
 * ------------------------------------------------------------------ */
function PhotoCard({
  slot, product, sx, sy, delay, eager,
}: {
  slot: (typeof SLOTS)[number];
  product?: Product;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  delay: number;
  eager?: boolean;
}) {
  const x = useTransform(sx, (v) => v * slot.depth);
  const y = useTransform(sy, (v) => v * slot.depth * 0.7);

  return (
    <motion.div
      style={{ x, y, rotate: slot.tilt }}
      initial={{ opacity: 0, y: 34, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      whileHover={{ scale: 1.025, zIndex: 40 }}
      className={cn("absolute bg-white p-2.5 pb-7 photo-shadow", slot.box)}
    >
      <Link
        href={product ? `/product/${product.id}` : "/shop"}
        aria-label={product?.name ?? "Shop the drop"}
        className={cn("relative block overflow-hidden bg-[#f2f2f0]", slot.ratio)}
      >
        <Image
          src={slot.img}
          alt={slot.alt}
          fill
          sizes="(max-width: 1024px) 45vw, 27vw"
          preload={eager}
          className="object-cover"
        />

        {/* film-frame vignette settles the print into the card */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 30%, transparent 52%, rgba(25,21,16,0.11) 100%)",
          }}
        />

        {"selected" in slot && slot.selected && (
          <span className="absolute right-2.5 top-2.5 bg-ink text-white px-2.5 py-1 label label-sm">
            Selected
          </span>
        )}
      </Link>

      {/* contact-sheet annotation on the print's bottom margin */}
      <span className="absolute left-3 bottom-2 label label-sm text-muted">
        {slot.caption}
      </span>
    </motion.div>
  );
}

/* Coral drop card with a rotating ring of type, and the dark PICK disc
   biting into its corner. The only pure ornament, so it earns the accent. */
function DropSeal() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: -4 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
      className="absolute left-[2%] top-0 z-[15] w-[38%] aspect-[1/0.94]"
    >
      <div className="relative w-full h-full bg-coral overflow-hidden rounded-2xl">
        {/* rotating ring of type */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full animate-spin-slow"
          aria-hidden
        >
          <path
            id="ct-seal-arc"
            d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0"
            fill="none"
          />
          <text
            fill="#fff"
            fontSize="7.4"
            fontWeight="600"
            letterSpacing="2.2"
            fontFamily="var(--font-jetbrains), monospace"
          >
            <textPath href="#ct-seal-arc" startOffset="0">
              &middot; NEW DROP &middot; CAMPUS THINGS &middot; 25/26&nbsp;
            </textPath>
          </text>
        </svg>

        {/* static centre */}
        <div className="absolute inset-0 grid place-content-center text-center text-white leading-none">
          <p className="font-display text-[clamp(13px,3.4vw,26px)] font-bold">25/26</p>
          <p className="font-display text-[clamp(15px,4vw,30px)] font-bold mt-1">New Drop</p>
          <p className="mt-2 label label-sm text-white/85">&bull; Live</p>
        </div>
      </div>

      {/* PICK disc bites into the bottom-left corner */}
      <span className="absolute -bottom-5 -left-4 grid place-items-center w-[38%] aspect-square rounded-full bg-ink text-coral label label-sm">
        Pick
      </span>
    </motion.div>
  );
}
