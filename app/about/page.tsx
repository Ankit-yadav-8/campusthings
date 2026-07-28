import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Palette, Shirt, HeartHandshake, Leaf, MapPin, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import Logo from "@/components/Logo";
import { COLLEGES } from "@/lib/data";

export const metadata: Metadata = {
  title: "About us | Campus Things",
  description:
    "Campus Things makes premium, campus-verified apparel for every IIT, NIT and IIIT. Learn our story, our craft, and why students across India wear their vibe.",
};

const VALUES = [
  { icon: Shirt, title: "Heavyweight fabric", desc: "180–360 GSM combed cotton & fleece, pre-shrunk and bio-washed to last." },
  { icon: Palette, title: "Campus-verified art", desc: "Crests and wordmarks researched and drawn right — no cheap knock-offs." },
  { icon: HeartHandshake, title: "Made with love", desc: "Every piece is printed, checked and packed by a small team that cares." },
  { icon: Leaf, title: "Responsibly made", desc: "Water-based inks, made-to-order runs, minimal waste, proudly Made in India." },
];

const STATS = [
  { n: `${COLLEGES.length}+`, l: "Campuses covered" },
  { n: "12,000+", l: "Orders delivered" },
  { n: "4.9★", l: "Average rating" },
  { n: "3–5 days", l: "Pan-India delivery" },
];

export default function AboutPage() {
  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="container-x relative py-20 text-center">
          <Reveal className="flex flex-col items-center">
            <span className="chip chip-accent">
              <Sparkles className="w-3.5 h-3.5" /> Our story
            </span>
            <h1 className="mt-6 font-display text-editorial max-w-3xl">
              We help students <span className="text-coral-strong accent-rule">wear their vibe</span><span className="text-coral-strong">.</span>
            </h1>
            <p className="mt-5 text-lg text-ink-soft max-w-2xl">
              Campus Things started with a simple frustration — official college merch was either impossible to find
              or looked cheap. So we built a place where every IIT, NIT and IIIT gets apparel worth repping.
            </p>
          </Reveal>
        </div>
      </section>

      {/* stats */}
      <section className="border-b border-line bg-bg-soft">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4 gap-6 py-12">
          {STATS.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.06} className="text-center">
              <p className="font-display text-4xl sm:text-5xl font-extrabold track-display text-ink">{s.n}</p>
              <p className="mt-1 label label-sm text-muted">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* story split */}
      <section className="container-x py-20 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div className="relative card-brut rounded-[22px] bg-bg-soft p-12 grid place-items-center">
            <Logo variant="stacked" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="h-section">From a hostel idea to <span className="text-coral-strong accent-rule">80+ campuses</span></h2>
          <div className="mt-5 space-y-4 text-ink-soft leading-relaxed">
            <p>
              What began as a batch of tees for one hostel wing turned into a mission: give every campus in India
              apparel that actually feels premium. We obsess over fabric weight, print sharpness and fits that
              look good on and off campus.
            </p>
            <p>
              We&apos;re students and alumni ourselves. We know the difference between a shirt you wear once and one
              you live in — so we build for the second kind.
            </p>
          </div>
          <Link href="/shop" className="mt-8 btn btn-accent">
            Explore the catalog <ArrowRight className="w-5 h-5" />
          </Link>
        </Reveal>
      </section>

      {/* values */}
      <section className="container-x pb-8">
        <Reveal>
          <h2 className="h-section text-center">What we <span className="text-coral-strong accent-rule">stand for</span></h2>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.07}>
              <div className="h-full card-brut card-lift p-7">
                <span className="grid place-items-center w-12 h-12 rounded-lg bg-coral-soft text-ink">
                  <v.icon className="w-6 h-6" />
                </span>
                <h3 className="mt-5 h-card text-lg">{v.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="container-x py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] bg-ink text-white p-10 sm:p-16 text-center">
            <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #8577b8, transparent 42%), radial-gradient(circle at 80% 30%, #6d5da1, transparent 42%)" }} />
            <div className="relative">
              <h2 className="h-section text-white sm:text-5xl">Ready to rep <span className="text-[#b3a5e0] accent-rule accent-rule-light">your campus</span>?</h2>
              <p className="mt-4 text-white/70 max-w-lg mx-auto flex items-center justify-center gap-1.5">
                <MapPin className="w-4 h-4" /> Delivering to hostels across India, 3–5 days.
              </p>
              <Link href="/shop" className="mt-8 btn btn-accent">
                Start shopping <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
