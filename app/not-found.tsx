import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <p className="font-display text-7xl font-extrabold track-display text-line-strong">404</p>
      <h1 className="mt-4 h-section">This page took a <span className="text-coral-strong accent-rule">gap year</span></h1>
      <p className="mt-2 text-muted">We couldn&apos;t find what you were looking for.</p>
      <Link href="/colleges" className="mt-8 btn btn-accent">
        <ArrowLeft className="w-4 h-4" /> Browse colleges
      </Link>
    </div>
  );
}
