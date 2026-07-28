import Link from "next/link";
import { ArrowRight, Recycle } from "lucide-react";
import Hero from "@/components/Hero";
import BuyBoxCard from "@/components/BuyBoxCard";
import Reveal from "@/components/Reveal";
import { allProducts, type Product } from "@/lib/data";

export default function Home() {
  // Three prints for the hero stack to link through to. The store is tees
  // only now, so these vary by fabric colour rather than by garment — the
  // old picks asked for a hoodie and a lower, which no longer exist.
  const all = allProducts();
  const heroPicks = [
    all.find((p) => p.photo),
    all.find((p) => p.garment === "#ffffff"),
    all.find((p) => p.garment === "#f4efe6"),
  ].filter((p): p is Product => Boolean(p));

  return (
    <>
      <Hero products={heroPicks} />

      {/* The t-shirt shelf, now carrying the heading the category accordion
          used to own. The accordion cycled six sections to say what the
          store sells; the shelf says it with the garments themselves, so
          the heading stays and the machinery under it goes. */}
      <section className="bg-smoke py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="h-section">
                One tee. Every campus. <br className="hidden sm:block" />
                Built for <span className="text-coral-strong accent-rule">yours</span><span className="text-coral-strong">.</span>
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 items-stretch">
            {[
              "iit-roorkee", "iit-bombay", "iit-delhi", "iit-kanpur",
              "iit-madras", "iit-guwahati", "iit-bhu-varanasi", "iit-kharagpur",
            ].map((cid) => all.find((p) => p.collegeId === cid && p.section === "design-tshirt"))
             .filter(Boolean)
             .map((p, i) => (
              <BuyBoxCard key={p!.id} product={p as Product} index={i} />
            ))}
          </div>

          <Reveal>
            <div className="mt-12 text-center">
              <Link href="/shop?cat=design-tshirt" className="btn btn-white">
                Shop all t-shirts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Classic Simple Wear section */}
      <section className="bg-smoke py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="h-section">
                Classic Simple Wear. <br className="hidden sm:block" />
                Timeless designs for <span className="text-coral-strong accent-rule">every</span><span className="text-coral-strong"> day.</span>
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 items-stretch">
            {[
              "iit-roorkee",
              "iit-madras",
              "iit-kharagpur",
              "iit-guwahati",
            ].flatMap((c) => {
              const whiteTee = all.find((p) => p.collegeId === c && p.section === "simple-tshirt" && p.garment === "#ffffff");
              const blackTee = all.find((p) => p.collegeId === c && p.section === "simple-tshirt" && p.garment === "#14151a");
              return [blackTee, whiteTee].filter(Boolean);
            }).map((p, i) => (
              <BuyBoxCard key={p!.id} product={p as Product} index={i} />
            ))}
          </div>

          <Reveal>
            <div className="mt-12 text-center">
              <Link href="/shop?cat=simple-tshirt" className="btn btn-white">
                Shop simple t-shirts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Steps />
      <CtaBand />
    </>
  );
}

/* ----------------------------- steps ----------------------------- *
 *  Three outlined cards with one rule threaded through them.
 *
 *  The trick is that the rule and the cards' top borders are collinear:
 *  a single hairline runs the full width behind the row, the cards sit on
 *  top with a solid background, so the line is only *visible* in the two
 *  gutters — and where it disappears, each card's own top border carries
 *  it onward at exactly the same height. One continuous thread, drawn by
 *  two different things.
 *
 *  Markers straddle that seam: a ring centred on the card's top edge, so
 *  it reads as a node punched into the line rather than a dot parked
 *  above a box.
 * ------------------------------------------------------------------ */
const STEPS = [
  { title: "Find your campus", desc: "Search 80+ IITs, NITs & IIITs and open your store." },
  { title: "Pick your fit", desc: "Choose the garment, colour and size that's you." },
  { title: "Delivered to your hostel", desc: "Fast, tracked shipping anywhere in India." },
];

function Steps() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <Reveal>
          <h2 className="h-section text-center">
            From crest to campus in <span className="text-coral-strong accent-rule">three steps</span>
          </h2>
        </Reveal>

        <div className="relative mt-16">
          {/* The through-line. Sits at the exact y of the cards' top borders
              so the cards hide it and continue it in the same stroke, and is
              inset by the 16px corner radius at both ends — run to left-0 and
              it shoots straight past the outer corners while the border is
              already curving away, which leaves a stray tick at each end.
              Ending it on the straight part hands the line to the corner,
              and the corner does the bending. */}
          <span
            aria-hidden
            className="hidden md:block absolute left-4 right-4 top-0 h-px bg-ink/35"
          />

          <ol className="grid gap-12 md:grid-cols-3 md:gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                {/* border weight matches the rail exactly — they are meant to
                    read as one continuous stroke, so they can't drift apart */}
                <li className="group relative h-full rounded-2xl border border-ink/35 bg-white px-6 pt-11 pb-8 text-center transition-colors hover:border-ink/60">
                  <span
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 -top-[11px] grid place-items-center w-[22px] h-[22px] rounded-full border border-ink/35 bg-white transition-colors group-hover:border-ink/60"
                  >
                    <span className="w-[7px] h-[7px] rounded-full bg-ink" />
                  </span>

                  <h3 className="text-[17px] font-medium text-ink leading-snug">{s.title}</h3>
                  <p className="body-light mt-2.5 text-[14.5px] leading-relaxed text-ink-soft max-w-[28ch] mx-auto">
                    {s.desc}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- cta band --------------------------- */
function CtaBand() {
  return (
    <section className="py-12">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] bg-ink text-white p-10 sm:p-16 text-center">
            <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #8577b8, transparent 42%), radial-gradient(circle at 80% 30%, #6d5da1, transparent 42%)" }} />
            <div className="relative">
              <span className="chip chip-accent">
                <Recycle className="w-3.5 h-3.5" /> New drops every week
              </span>
              <h2 className="mt-5 h-section text-white sm:text-5xl">
                Represent your <span className="text-[#b3a5e0] accent-rule accent-rule-light">campus</span><span className="text-[#b3a5e0]">.</span>
              </h2>
              <p className="mt-4 text-white/70 max-w-lg mx-auto">
                80+ institutes, hundreds of designs, one place. Find your college and wear it proud.
              </p>
              <Link href="/colleges" className="mt-8 btn btn-accent">
                Start shopping <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
