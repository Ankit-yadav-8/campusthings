import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ShopBrowser from "@/components/ShopBrowser";
import { SECTIONS, type SectionId } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop all — Tees, Hoodies, Lowers & more | Campus Things",
  description:
    "Shop the full Campus Things catalog — tees, oversized fits, hoodies, sweatshirts, lowers & joggers and caps for every IIT, NIT and IIIT.",
};

export default async function ShopPage({
  searchParams,
}: PageProps<"/shop">) {
  const sp = await searchParams;
  const raw = typeof sp.cat === "string" ? sp.cat : undefined;
  const initialCat = SECTIONS.some((s) => s.id === raw) ? (raw as SectionId) : undefined;
  const query = typeof sp.q === "string" ? sp.q : undefined;

  return (
    <div className="container-x pt-16 pb-14 sm:pt-24 sm:pb-16">
      <Reveal>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="h-section">Shop <span className="text-coral-strong accent-rule">all products</span></h1>
          <p className="body-light mt-4 text-ink-soft">
            Every drop across 80+ campuses in one place.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 sm:mt-16">
        <ShopBrowser initialCat={initialCat} query={query} />
      </div>
    </div>
  );
}
