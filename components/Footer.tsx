import Link from "next/link";
import { MessageCircle, Send, Globe, Mail } from "lucide-react";
import { COLLEGE_TYPES, SECTIONS } from "@/lib/data";
import NewsletterForm from "@/components/NewsletterForm";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-bg-soft">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="group inline-flex">
              <Logo variant="inline" />
            </Link>
            <p className="mt-4 text-sm text-muted leading-relaxed max-w-xs">
              Premium, campus-verified apparel for every IIT, NIT and IIIT.
              Wear your vibe — represent your campus with pride.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {[MessageCircle, Send, Globe, Mail].map((Icon, i) => (
                <a key={i} href="#" className="grid place-items-center w-9 h-9 rounded-lg border border-line-strong bg-bg text-ink transition-colors hover:bg-bg-soft">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="h-card text-sm uppercase tracking-wide">Quick Links</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <li><Link href="/" className="hover:text-ink transition-colors">Home</Link></li>
              <li><Link href="/colleges" className="hover:text-ink transition-colors">Colleges</Link></li>
              <li><Link href="/about" className="hover:text-ink transition-colors">About us</Link></li>
              <li><Link href="/contact" className="hover:text-ink transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="h-card text-sm uppercase tracking-wide">Get campus drops first</h4>
            <p className="mt-4 text-sm text-muted">New designs land every week. No spam.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>© {new Date().getFullYear()} Campus Things. Not affiliated with any institute — fan-made campus merch.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-ink">Privacy</a>
            <a href="#" className="hover:text-ink">Terms</a>
            <a href="#" className="hover:text-ink">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
