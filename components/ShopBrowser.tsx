"use client";

import { useMemo, useState } from "react";
import BuyBoxCard from "@/components/BuyBoxCard";
import {
  shopOrder, SECTIONS, getCollege,
  type Product, type SectionId,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const PAGE = 12;

export default function ShopBrowser({
  initialCat, query,
}: { initialCat?: SectionId; query?: string }) {
  const products = useMemo(() => shopOrder().filter((p) => p.photo), []);
  const [cat, setCat] = useState<SectionId | "all">(initialCat ?? "all");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const lo = min ? parseInt(min) : 0;
    const hi = max ? parseInt(max) : Infinity;
    const q = query?.trim().toLowerCase() ?? "";
    let out = products.filter((p) => {
      if (cat !== "all" && p.section !== cat) return false;
      if (cat === "all" && p.hideFromAll) return false;
      if (p.price < lo || p.price > hi) return false;
      if (q) {
        const college = getCollege(p.collegeId);
        const haystack = [p.name, college?.name, college?.short, college?.city]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    if (sort !== "featured") {
      out = [...out].sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        return 0;
      });
    }
    return out;
  }, [products, cat, min, max, sort, query]);

  const shown = filtered.slice(0, limit);
  const reset = () => { setCat("all"); setMin(""); setMax(""); setLimit(PAGE); };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="pb-6 mb-6 border-b border-line space-y-5">
          <h2 className="h-card text-2xl flex items-center justify-between">
            <span>
              {query?.trim()
                ? `Results for "${query.trim()}"`
                : cat === "all" ? "All Products" : SECTIONS.find((s) => s.id === cat)?.name}
              <span className="ml-2 text-sm font-sans text-muted">({filtered.length})</span>
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-4 bg-bg-soft p-2 sm:p-3 rounded-xl border border-line justify-between">
            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              {/* Category Pills */}
              {SECTIONS.length > 1 && (
                <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-line-strong rounded-lg shadow-sm">
                  <button
                    onClick={() => { setCat("all"); setLimit(PAGE); }}
                    className={cn("px-3 py-1.5 text-sm font-bold rounded-md whitespace-nowrap transition-colors", cat === "all" ? "bg-accent text-white shadow-sm" : "text-ink-soft hover:text-ink hover:bg-bg-soft")}
                  >
                    All Products
                  </button>
                  {SECTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setCat(s.id); setLimit(PAGE); }}
                      className={cn("px-3 py-1.5 text-sm font-bold rounded-md whitespace-nowrap transition-colors", cat === s.id ? "bg-accent text-white shadow-sm" : "text-ink-soft hover:text-ink hover:bg-bg-soft")}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Price Filter */}
              <div className="flex items-center gap-2 shrink-0 bg-white border border-line-strong rounded-lg p-1 shadow-sm">
                <span className="text-sm font-bold text-ink-soft pl-2 hidden sm:inline-block">Price:</span>
                <input value={min} onChange={(e) => { setMin(e.target.value.replace(/\D/g, "")); setLimit(PAGE); }} inputMode="numeric" placeholder="Min ₹"
                  className="w-16 h-8 text-sm px-2 text-center font-medium outline-none bg-transparent placeholder:text-muted" />
                <span className="text-muted">–</span>
                <input value={max} onChange={(e) => { setMax(e.target.value.replace(/\D/g, "")); setLimit(PAGE); }} inputMode="numeric" placeholder="Max ₹"
                  className="w-16 h-8 text-sm px-2 text-center font-medium outline-none bg-transparent placeholder:text-muted" />
              </div>

              {/* Clear Filters */}
              {(min || max) && (
                <button onClick={() => { setMin(""); setMax(""); setLimit(PAGE); }} className="text-sm font-bold text-coral hover:text-coral-dark transition-colors shrink-0">
                  Clear price
                </button>
              )}
            </div>

            {/* Sort By */}
            <label className="flex items-center gap-2 text-sm text-muted shrink-0 bg-white border border-line-strong rounded-lg p-1 pl-3 shadow-sm ml-auto">
              <span className="hidden sm:inline font-bold text-ink-soft">Sort by:</span>
              <span className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-8 w-auto appearance-none pl-1 pr-7 text-sm font-bold text-ink cursor-pointer outline-none bg-transparent">
                  <option value="featured">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top rated</option>
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted text-xs">▾</span>
              </span>
            </label>
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="py-24 text-center">
            <p className="h-card text-xl">No matches found</p>
            <p className="mt-2 text-muted">Try clearing a filter or widening the price range.</p>
            <button onClick={reset} className="mt-6 btn btn-sm btn-accent">Reset filters</button>
          </div>
        ) : (
          <div className={`grid grid-cols-2 ${cat === "all" ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-4 sm:gap-6 items-stretch`}>
            {shown.map((p, i) => <BuyBoxCard key={p.id} product={p} index={i} />)}
          </div>
        )}

        {limit < filtered.length && (
          <div className="mt-12 text-center">
            <button onClick={() => setLimit((l) => l + PAGE)} className="btn btn-white">
              Load more
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
