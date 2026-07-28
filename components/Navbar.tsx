"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { Home, LayoutGrid, GraduationCap, Info, Mail, ShoppingBag, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useSearch } from "@/lib/search-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

const LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: LayoutGrid },
  { href: "/colleges", label: "Colleges", icon: GraduationCap },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const mounted = useHydrated();
  const [scrolled, setScrolled] = useState(false);
  const count = useCart((s) => s.count());
  const setOpen = useCart((s) => s.setOpen);
  const setSearchOpen = useSearch((s) => s.setOpen);

  // the bar never retracts — scroll only decides whether it sits flat or
  // lifts onto its translucent, blurred state
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // how far the tan band drops below the bar — the band's whole visible height
  const bandDrop = scrolled ? "-bottom-[3px]" : "-bottom-[4px]";

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Full-bleed bar with rounded bottom corners, over a tan band.

            The band used to be a box-shadow (0 6px 0 0). An offset shadow is
            a *copy of the same rounded rect* moved down, so near the corners
            its straight side is still running while the bar has already
            started curving in — the copy pokes out sideways and leaves a
            square notch where the two curves disagree. Drawing the band as
            its own element instead lets it carry a larger radius (28 + the
            offset), so its curve stays outside the bar's the whole way
            round and the corner comes out clean. */}
        <div className="relative">
          {/* Square backdrop behind both rounded layers. Outside the band's
              34px curve the header is transparent, so the page ground showed
              through as a cream wedge in each bottom corner — against the
              white page that read as a chip out of the bar.

              It shares `bandDrop` with the band on purpose: if the backdrop
              reached lower, the extra would show as a white line running the
              full width beneath the tan. */}
          <div aria-hidden className={cn("absolute inset-x-0 top-0 bg-page", bandDrop)} />
          <div
            aria-hidden
            className={cn(
              "absolute inset-x-0 top-0 rounded-b-[34px] bg-[var(--shadow)]",
              "transition-[bottom] duration-300",
              bandDrop
            )}
          />
          <div
            className={cn(
              "relative border-x-[1.6px] border-b-[1.6px] border-ink rounded-b-[28px]",
              "transition-[background-color,backdrop-filter] duration-300",
              scrolled ? "bg-white/92 backdrop-blur-xl" : "bg-white"
            )}
          >
          <nav
            aria-label="Primary"
            className={cn(
              "container-x relative flex items-center gap-3",
              "transition-[height] duration-300",
              scrolled ? "h-[60px]" : "h-[68px]"
            )}
          >
            {/* left: logo */}
            <Link href="/" className="group shrink-0 relative z-10" aria-label="Campus Things — home">
              <Logo variant="inline" />
            </Link>

            {/* center: links */}
            {/* Centred on desktop. Below lg it drops out of the absolute
                centring and becomes an inline scrollable row — with the
                hamburger gone this list is the only navigation small screens
                have, so it can't be display:none any more. */}
            <ul
              className={cn(
                "flex items-center gap-1 z-10 min-w-0 overflow-x-auto no-scrollbar",
                "lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:overflow-visible"
              )}
            >
              {LINKS.map((l) => (
                <li key={l.label}>
                  {/* .nav-link carries the sizing and both states — the active
                      route styles off aria-current, so there's no second
                      source of truth for "which link is current" */}
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className="nav-link"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* right: search + cart + hamburger — all plain type and icon
                now, matching the light nav links rather than the brutalist
                fill-and-offset the bar used to carry */}
            <div className="flex items-center gap-1 ml-auto shrink-0 relative z-10">
              <button
                onClick={() => setSearchOpen(true)}
                className="nav-icon"
                aria-label="Search products"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              <button
                onClick={() => setOpen(true)}
                className="nav-link gap-2"
                aria-label={`Open cart${mounted && count > 0 ? `, ${count} items` : ""}`}
              >
                <ShoppingBag className="w-[17px] h-[17px]" />
                <span className="hidden sm:inline">Cart</span>
                <AnimatePresence>
                  {mounted && count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.45, duration: 0.45 }}
                      className="grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-ink text-white text-[10.5px] font-medium tabular-nums"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

            </div>
          </nav>
          </div>
        </div>

      </header>
    </>
  );
}
