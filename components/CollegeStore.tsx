
"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import ProductCard from "@/components/ProductCard";
import BuyBoxCard from "@/components/BuyBoxCard";
import { SECTIONS, productsForCollege, type Product, type SectionId } from "@/lib/data";

/* The t-shirt shelves carry the full buy box on the card — tees are the
   volume seller and the size decision is the least fraught, so the shopper
   can commit from the grid. Every other section keeps the compact card. */
function Card({ product, index }: { product: Product; index: number }) {
  return (product.section === "design-tshirt" || product.section === "simple-tshirt")
    ? <BuyBoxCard product={product} index={index} />
    : <ProductCard product={product} index={index} />;
}

export default function CollegeStore({ collegeId }: { collegeId: string }) {
  const products = useMemo(() => productsForCollege(collegeId), [collegeId]);
  const [active, setActive] = useState<SectionId | "all">("all");

  const present = SECTIONS.filter((s) => products.some((p) => p.section === s.id));
  const shown = active === "all" ? products : products.filter((p) => p.section === active);

  return (
    <div>
      {/* Sticky section filter, parked directly under the header. Reads the
          bar's height from --nav-h rather than the 76px it used to guess:
          the header shrinks to 60px on scroll, which is exactly when this row
          becomes sticky, so the guess left a gap the page showed through. */}
      {/* Same reasoning as the shop sidebar: with a single section the row
          is "All" next to a chip selecting the same products. */}
      {present.length > 1 && (
        <div
          className="sticky z-30 -mx-5 px-5 py-3 bg-page/95 backdrop-blur border-y border-line mb-8"
          style={{ top: "calc(var(--nav-h) - 8px)" }}
        >
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <Chip active={active === "all"} onClick={() => setActive("all")}>All · {products.length}</Chip>
            {present.map((s) => (
              <Chip key={s.id} active={active === s.id} onClick={() => setActive(s.id)}>
                {s.emoji} {s.name}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {active === "all" ? (
        <div className="space-y-14">
          {present.map((s) => {
            const items = products.filter((p) => p.section === s.id);
            return (
              // extra scroll margin on top of the global one: this row has
              // the sticky filter bar above it as well as the header
              <div key={s.id} id={s.id} className="scroll-mt-[150px]">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="h-card text-2xl flex items-center gap-2">
                    <span>{s.emoji}</span> {s.name}
                  </h2>
                  <button onClick={() => setActive(s.id)} className="text-sm font-bold underline underline-offset-4 hover:text-coral transition-colors">
                    View all {items.length}
                  </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
                  {items.map((p, i) => <Card key={p.id} product={p} index={i} />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch"
        >
          {shown.map((p, i) => <Card key={p.id} product={p} index={i} />)}
        </motion.div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
        active ? "border-ink bg-ink text-white" : "border-line-strong bg-white text-ink-soft hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}
