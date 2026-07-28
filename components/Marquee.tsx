import { COLLEGES } from "@/lib/data";

export default function Marquee() {
  const items = COLLEGES.map((c) => c.short);
  const row = [...items, ...items];
  return (
    <div className="relative border-y border-line bg-bg-soft py-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg-soft to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg-soft to-transparent z-10" />
      <div className="flex w-max animate-marquee gap-3">
        {row.map((s, i) => (
          <span
            key={i}
            className="chip whitespace-nowrap"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
