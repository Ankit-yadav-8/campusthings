import { cn } from "@/lib/utils";

/**
 * Campus Things wordmark — set as live text in Great Vibes rather than
 * placed as an image. The brand artwork is a JPG with its background baked
 * in, so it could only ever render as a dark plaque; as type it takes the
 * page's ink colour, stays crisp at any size, and is selectable and
 * searchable.
 *
 *  variant="inline"  → compact lockup for the navbar / footer
 *  variant="stacked" → larger lockup with tagline for hero / about
 */
export default function Logo({
  variant = "inline",
  className,
  onDark = false,
}: {
  variant?: "inline" | "stacked";
  className?: string;
  onDark?: boolean;
}) {
  // Script faces carry a lot of side bearing in the swashes — the leading
  // "C" and the "gs" exit stroke both overhang. leading-none plus a little
  // horizontal padding keeps the glyphs off their neighbours without
  // pushing the optical left edge out of line with the nav below it.
  const wordmark = cn(
    "font-script leading-none px-0.5",
    onDark ? "text-white" : "text-ink",
  );

  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex flex-col items-center select-none", className)}>
        <span className={cn(wordmark, "text-[4.5rem] sm:text-[5.5rem]")}>Campus Things</span>
        <span className="mt-4 flex items-center gap-2 label label-sm text-ink-soft">
          <span className="h-px w-6 bg-ink/40" /> Wear your vibe <span className="h-px w-6 bg-ink/40" />
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center select-none", className)}>
      <span className={cn(wordmark, "wordmark-inline transition-transform group-hover:scale-[1.03]")}>
        Campus Things
      </span>
    </span>
  );
}
