import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Globe, AtSign } from "lucide-react";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact us | Campus Things",
  description: "Questions, bulk orders or campus collabs? Reach the Campus Things team — we reply within 24 hours.",
};

const INFO = [
  { icon: MapPin, title: "Studio", lines: ["Campus Things HQ", "IIT Roorkee, Roorkee, Uttarakhand – 247667"] },
  { icon: Phone, title: "Phone", lines: ["+91 81188 26194", "Mon–Sat, 10am – 7pm"] },
  { icon: Mail, title: "Email", lines: ["hello@campusthings.in", "orders@campusthings.in"] },
  { icon: Clock, title: "Support hours", lines: ["Mon – Sat: 10:00 – 19:00", "Sun: closed"] },
];

export default function ContactPage() {
  return (
    <div className="container-x py-14">
      <Reveal className="text-center max-w-2xl mx-auto">
        <h1 className="h-section">We&apos;d love to <span className="text-coral-strong accent-rule">hear from you</span></h1>
        <p className="body-light mt-4 text-ink-soft">
          Bulk orders for your fest or hostel, a design request, or just a hello — drop us a line and the
          team will get back within a day.
        </p>
      </Reveal>

      {/* items-stretch is the default, but the grid items here are the Reveal
          wrappers — so both they and the cards inside need h-full for the two
          columns to finish level */}
      <div className="mt-12 grid lg:grid-cols-[1fr_1.1fr] gap-8 items-stretch">
        {/* info column */}
        <Reveal className="h-full">
          <div className="card-brut bg-bg-soft p-8 h-full flex flex-col">
            <h2 className="h-card text-2xl">Contact details</h2>
            <p className="mt-2 text-sm text-ink-soft">Reach us on whatever&apos;s easiest.</p>
            <div className="mt-8 space-y-6">
              {INFO.map((it) => (
                <div key={it.title} className="flex items-start gap-4">
                  <span className="grid place-items-center w-11 h-11 rounded-lg bg-white border border-line text-ink shrink-0">
                    <it.icon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="h-card text-sm">{it.title}</p>
                    {it.lines.map((l) => <p key={l} className="text-sm text-ink-soft">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>
            {/* mt-auto pins the social row to the bottom, so the extra height
                this column gains lands as breathing room above it rather than
                as a gap trailing under the card */}
            <div className="mt-auto pt-8 border-t border-line">
              <p className="h-card text-sm">Follow the vibe</p>
              <div className="mt-3 flex gap-2">
                {[AtSign, Globe, MessageCircle, Send].map((Icon, i) => (
                  <a key={i} href="#" className="grid place-items-center w-10 h-10 rounded-lg border border-line-strong bg-white text-ink transition-colors hover:bg-bg-soft">
                    <Icon className="w-4.5 h-4.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* form column */}
        <Reveal delay={0.1} className="h-full">
          <div className="card-brut p-8 h-full">
            <h2 className="h-card text-2xl">Send a message</h2>
            <p className="mt-2 text-sm text-ink-soft mb-6">Fill this in and we&apos;ll email you back.</p>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
