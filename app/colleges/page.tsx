import { Suspense } from "react";
import type { Metadata } from "next";
import CollegesBrowser from "@/components/CollegesBrowser";

export const metadata: Metadata = {
  title: "All Colleges — IITs, NITs & IIITs | Campus Things",
  description: "Browse official-style merch stores for every IIT, NIT and IIIT. Search by name, abbreviation or city.",
};

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-muted">Loading colleges…</div>}>
      <CollegesBrowser />
    </Suspense>
  );
}
