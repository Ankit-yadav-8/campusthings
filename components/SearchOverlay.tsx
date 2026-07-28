"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { useSearch } from "@/lib/search-store";
import { inr, searchProducts } from "@/lib/data";
import GarmentThumb from "@/components/GarmentThumb";

const RESULT_LIMIT = 8;

export default function SearchOverlay() {
  const { open, setOpen } = useSearch();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const results = useMemo(() => searchProducts(q, RESULT_LIMIT), [q]);

  // focus the field on open, and lock the page behind the panel
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  // following a result navigates; the panel has to get out of the way
  useEffect(() => setOpen(false), [pathname, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-ink/35 backdrop-blur-[2px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed left-1/2 -translate-x-1/2 top-20 sm:top-24 z-[71] w-[calc(100%-2rem)] max-w-2xl rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)] overflow-hidden"
          >
            {/* Query row. The input carries no resting border and opts out of
                the global focus ring — a heavy black rectangle appearing the
                instant the panel autofocuses looked like an error state. A
                hairline appears on hover instead. */}
            <div className="flex items-stretch border-b border-line">
              <div className="flex flex-1 items-center gap-3 px-4 py-2 min-w-0">
                <Search className="w-[18px] h-[18px] shrink-0 text-ink-soft" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products or campuses"
                  aria-label="Search products"
                  className="flex-1 min-w-0 h-11 px-2 rounded-lg bg-transparent text-[15px] text-ink placeholder:text-muted border border-transparent hover:border-black/15 focus:border-black/15 outline-none focus-visible:outline-none transition-colors"
                />
                {q && (
                  <button
                    onClick={() => { setQ(""); inputRef.current?.focus(); }}
                    className="flex items-center gap-1.5 shrink-0 text-[14px] text-ink-soft hover:text-ink transition-colors"
                  >
                    <X className="w-4 h-4" /> Clear
                  </button>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="grid place-items-center w-12 shrink-0 border-l border-line text-ink-soft hover:text-ink transition-colors"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* results */}
            {/* capped so the panel stays a panel — at 70vh it filled the
                screen and read as a page rather than an overlay */}
            <div className="max-h-[46vh] overflow-y-auto px-4 py-4">
              {results.length === 0 ? (
                <p className="py-10 text-center text-ink-soft">
                  Nothing matches &ldquo;{q}&rdquo;. Try a campus name or code — IIT Bombay, NIT-T.
                </p>
              ) : (
                <>
                  <p className="text-[14px] font-medium text-ink mb-3">Products</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5">
                    {results.map((p) => (
                      <Link key={p.id} href={`/product/${p.id}`} className="group block">
                        <div className="relative aspect-[4/5] overflow-hidden bg-smoke-tile">
                          <GarmentThumb product={p} sizes="(max-width: 1024px) 40vw, 200px" />
                        </div>
                        <h3 className="mt-2.5 text-[13.5px] leading-snug text-ink line-clamp-2">
                          {p.name}
                        </h3>
                        {p.mrp > p.price && (
                          <p className="mt-0.5 text-[12.5px] text-muted line-through">{inr(p.mrp)}</p>
                        )}
                        <p className="text-[12.5px] text-ink">{inr(p.price)}</p>
                      </Link>
                    ))}
                  </div>

                  {/* only offered once a query narrows things — with no query
                      the panel is already showing the featured set */}
                  {q.trim() && (
                    <div className="mt-7 mb-1 flex justify-center">
                      <Link
                        href={`/shop?q=${encodeURIComponent(q.trim())}`}
                        className="inline-flex items-center justify-center h-14 px-10 rounded-[14px] bg-ink text-white text-[15px] hover:opacity-90 transition-opacity"
                      >
                        View all
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
