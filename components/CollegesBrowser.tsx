"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, ArrowRight, X } from "lucide-react";
import {
  COLLEGES, productsForCollege, tint, getCollege, heroProductForCollege,
  type CollegeType,
} from "@/lib/data";
import GarmentThumb from "@/components/GarmentThumb";

type Filter = "all" | CollegeType;

export default function CollegesBrowser() {
  // No tab control any more, so the type filter is read-only: it comes from
  // ?type= and nothing in the UI changes it. The footer and the college
  // breadcrumbs still link in that way, so the filtering itself has to stay.
  const params = useSearchParams();
  const requested = (params.get("type") as Filter) ?? "all";
  const filter: Filter = ["IIT", "NIT", "IIIT"].includes(requested) ? requested : "all";
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return COLLEGES.filter((c) => {
      if (filter !== "all" && c.type !== filter) return false;
      if (!query) return true;
      return (
        c.name.toLowerCase().includes(query) ||
        c.short.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query)
      );
    });
  }, [filter, q]);

  return (
    <div>
      {/* header */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="container-x relative py-12 text-center">
          <h1 className="h-section">Find your <span className="text-coral-strong accent-rule">college store</span></h1>

          {/* search — centred block, but the field itself stays left-read */}
          <div className="mt-6 relative max-w-lg mx-auto text-left">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
            {/* id is the anchor target for the navbar's search icon */}
            <input
              id="college-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search IIT Bombay, NIT-T, Hyderabad…"
              className="field h-13 pl-12 pr-11"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-7 h-7 rounded-md border border-line-strong bg-white hover:bg-bg-soft transition-colors" aria-label="Clear">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </section>

      {/* grid */}
      <section className="container-x py-10">
        <p className="text-sm text-muted mb-6">{results.length} result{results.length !== 1 && "s"}</p>
        <AnimatePresence mode="popLayout">
          {results.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <p className="h-card text-lg">No campus found</p>
              <p className="text-muted text-sm mt-1">Try another name, abbreviation or city.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {results.map((c, i) => (
                <CollegeCard key={c.id} id={c.id} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

function CollegeCard({ id, index }: { id: string; index: number }) {
  const c = getCollege(id)!;
  const products = productsForCollege(id);
  // the six photographed campuses lead their card with the real shot
  const preview = heroProductForCollege(id);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.03 }}
    >
      <Link
        href={`/college/${c.id}`}
        className="group card-brut card-lift block overflow-hidden h-full"
      >
        <div className="relative aspect-[4/3]" style={{ background: `linear-gradient(160deg, ${tint(c.hue, 96)}, #fff)` }}>
          <span className="absolute z-10 top-3 left-3 chip text-[11px] px-2.5 py-0.5" style={{ color: `hsl(${c.hue} 55% 38%)` }}>
            {c.type}
          </span>
          <GarmentThumb
            product={preview}
            sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 260px"
            hoverFlip
          />
        </div>
        <div className="p-4">
          <h3 className="h-card leading-tight line-clamp-1">{c.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <MapPin className="w-3.5 h-3.5" /> {c.city} · Est. {c.estd}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted">{products.length} products</span>
            <span className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
                 Shop <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
