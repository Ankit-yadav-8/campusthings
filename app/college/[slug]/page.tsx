import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Calendar, ChevronRight, Star, Truck } from "lucide-react";
import CollegeStore from "@/components/CollegeStore";
import GarmentThumb from "@/components/GarmentThumb";
import {
  COLLEGES, getCollege, productsForCollege, heroProductForCollege, tint,
  sectionsForCollege, listPhrase,
} from "@/lib/data";

export function generateStaticParams() {
  return COLLEGES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata(
  { params }: PageProps<"/college/[slug]">
): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollege(slug);
  if (!c) return { title: "College not found | Campus Things" };

  // Both strings name the shelves this store actually has. A college that
  // only stocks tees used to get titled "Tees, Hoodies & More" anyway.
  const stocked = sectionsForCollege(c.id);
  const lead =
    stocked.length > 2
      ? `${stocked[0].name}, ${stocked[1].name} & More`
      : stocked.map((s) => s.name).join(" & ");

  return {
    title: `${c.name} Merch — ${lead} | Campus Things`,
    description: `Shop official-style ${c.name} apparel: ${listPhrase(
      stocked.map((s) => s.name.toLowerCase())
    )} printed with the ${c.short} crest.`,
  };
}

export default async function CollegePage({ params }: PageProps<"/college/[slug]">) {
  const { slug } = await params;
  const college = getCollege(slug);
  if (!college) notFound();

  const products = productsForCollege(college.id);
  const hero = heroProductForCollege(college.id);
  const stocked = sectionsForCollege(college.id);

  return (
    <>
      {/* breadcrumb + hero */}
      <section className="relative overflow-hidden border-b border-line" style={{ background: `linear-gradient(160deg, ${tint(college.hue, 96)}, #fff)` }}>
        <div className="container-x relative py-10">
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-6">
            <Link href="/" className="hover:text-ink">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/colleges?type=${college.type}`} className="hover:text-ink">{college.type}s</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-bold">{college.short}</span>
          </nav>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <span className="chip" style={{ color: `hsl(${college.hue} 55% 38%)` }}>
                {college.type} · Official-style merch
              </span>
              <h1 className="mt-5 h-section">{college.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {college.city}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Est. {college.estd}</span>
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-coral text-coral" /> 4.9 · {products.length} products</span>
                <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-ink" /> Free shipping ₹999+</span>
              </div>
              <p className="mt-5 max-w-lg text-ink-soft leading-relaxed">
                Everything for the {college.short} faithful — {listPhrase(stocked.map((s) => s.prose))}.
              </p>
            </div>

            <div className="relative hidden lg:block">
              <Link
                href={`/product/${hero.id}`}
                className="group mx-auto block w-64 card-brut card-lift rounded-[22px] overflow-hidden"
                aria-label={hero.name}
              >
                <span className="relative block aspect-square">
                  <GarmentThumb product={hero} sizes="256px" hoverFlip preload />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-8">
        <CollegeStore collegeId={college.id} />
      </section>
    </>
  );
}
