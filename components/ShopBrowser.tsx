"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
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
  const [sheet, setSheet] = useState(false);

  const filtered = useMemo(() => {
    const lo = min ? parseInt(min) : 0;
    const hi = max ? parseInt(max) : Infinity;
    const q = query?.trim().toLowerCase() ?? "";
    let out = products.filter((p) => {
      if (cat !== "all" && p.section !== cat) return false;
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

  const Sidebar = (
    <div className="space-y-8">
      {SECTIONS.length > 1 && (
        <div>
          <h4 className="h-card text-lg mb-3">Categories</h4>
          <ul className="space-y-1">
            <CatItem active={cat === "all"} onClick={() => { setCat("all"); setLimit(PAGE); }}>All Products</CatItem>
            {SECTIONS.map((s) => (
              <CatItem key={s.id} active={cat === s.id} onClick={() => { setCat(s.id); setLimit(PAGE); }}>{s.name}</CatItem>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="h-card text-lg mb-3">Filter by</h4>
        <p className="text-sm font-medium text-ink-soft mb-2">Price</p>
        <div className="flex items-center gap-2">
          <input value={min} onChange={(e) => { setMin(e.target.value.replace(/\D/g, "")); setLimit(PAGE); }} inputMode="numeric" placeholder="Min"
            className="field h-10 text-sm" />
          <span className="text-muted">–</span>
          <input value={max} onChange={(e) => { setMax(e.target.value.replace(/\D/g, "")); setLimit(PAGE); }} inputMode="numeric" placeholder="Max"
            className="field h-10 text-sm" />
        </div>
      </div>

      <button onClick={reset} className="text-sm font-bold underline underline-offset-4 hover:text-coral transition-colors">Clear all filters</button>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-28">{Sidebar}</div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center gap-3 justify-between pb-5 mb-6 border-b border-line">
          <h2 className="h-card text-2xl">
            {query?.trim()
              ? `Results for "${query.trim()}"`
              : cat === "all" ? "All Products" : SECTIONS.find((s) => s.id === cat)?.name}
            <span className="ml-2 text-sm font-sans text-muted">({filtered.length})</span>
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setSheet(true)} className="lg:hidden btn btn-sm btn-white">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="hidden sm:inline">Sort by:</span>
              <span className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                  className="field h-10 w-auto appearance-none pl-3 pr-8 text-sm font-semibold cursor-pointer">
                  <option value="featured">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top rated</option>
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted text-xs">▾</span>
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
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

      {/* mobile filter sheet */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSheet(false)} className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-[2px] lg:hidden" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-[61] max-h-[82vh] overflow-y-auto rounded-t-[22px] border-t border-x border-line bg-page p-6 lg:hidden">
              <div className="flex items-center justify-between mb-5">
                <h3 className="h-card text-xl">Filters</h3>
                <button onClick={() => setSheet(false)} className="grid place-items-center w-9 h-9 rounded-lg border border-line-strong bg-white transition-colors hover:bg-bg-soft"><X className="w-5 h-5" /></button>
              </div>
              {Sidebar}
              <button onClick={() => setSheet(false)} className="mt-6 btn btn-accent btn-block">
                Show {filtered.length} results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function CatItem({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "text-left text-sm py-1 transition-colors",
          active ? "text-ink font-bold" : "text-ink-soft hover:text-ink"
        )}
      >
        {children}
      </button>
    </li>
  );
}
