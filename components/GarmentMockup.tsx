import type { GarmentKind } from "@/lib/data";

/** Which side of the garment is facing the camera. */
export type GarmentFace = "front" | "back";

/**
 * Self-contained SVG apparel mockup — no image assets required.
 * Renders a tee / oversized / hoodie / sweatshirt / cap in the given
 * fabric colour, printed with the campus wordmark.
 *
 * `face` mirrors how the real photography is shot: the front carries a
 * small left-chest crest, the back the full lockup. Anything that flips a
 * photographed product front-to-back can flip a mockup the same way, so
 * the two kinds of product behave identically everywhere they sit together.
 */
export default function GarmentMockup({
  kind,
  garment,
  print,
  label,
  sub,
  face = "front",
  className,
  style,
}: {
  kind: GarmentKind;
  garment: string;
  print: string;
  label: string;
  sub?: string;
  face?: GarmentFace;
  className?: string;
  style?: React.CSSProperties;
}) {
  const isWhite = garment.toLowerCase() === "#ffffff" || garment.toLowerCase() === "#fff";
  const seam = isWhite ? "rgba(0,0,0,0.10)" : "rgba(0,0,0,0.16)";
  const edge = isWhite ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.001)";

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      style={style}
      role="img"
      aria-label={`${label} ${kind}, ${face}`}
    >
      <defs>
        <linearGradient id="ct-sheen" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#000" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="ct-floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft floor shadow */}
      <ellipse cx="200" cy="370" rx="118" ry="20" fill="url(#ct-floor)" />

      {kind === "cap" ? (
        <Cap garment={garment} print={print} label={label} seam={seam} edge={edge} />
      ) : kind === "lower" ? (
        <Lower garment={garment} print={print} label={label} seam={seam} edge={edge} />
      ) : (
        <Shirt
          kind={kind}
          garment={garment}
          print={print}
          label={label}
          sub={sub}
          face={face}
          seam={seam}
          edge={edge}
        />
      )}
    </svg>
  );
}

function Shirt({
  kind, garment, print, label, sub, face, seam, edge,
}: {
  kind: GarmentKind; garment: string; print: string; label: string;
  sub?: string; face: GarmentFace; seam: string; edge: string;
}) {
  const oversized = kind === "oversized";
  const hoodie = kind === "hoodie";
  const crew = kind === "sweatshirt";

  // body outline — slightly boxier for oversized
  const body = oversized
    ? "M132 82 C150 108 250 108 268 82 L312 96 L384 168 L344 214 L312 190 L312 366 L88 366 L88 190 L56 214 L16 168 L88 96 Z"
    : "M140 74 C154 100 246 100 260 74 L300 88 L372 154 L338 200 L308 178 L308 362 L92 362 L92 178 L62 200 L28 154 L100 88 Z";

  return (
    <g>
      {/* hood behind shoulders */}
      {hoodie && (
        <path
          d="M150 92 C150 40 250 40 250 92 C250 118 226 128 200 128 C174 128 150 118 150 92 Z"
          fill={garment} stroke={edge} strokeWidth="2"
        />
      )}

      <path d={body} fill={garment} stroke={edge} strokeWidth="2" strokeLinejoin="round" />
      <path d={body} fill="url(#ct-sheen)" strokeLinejoin="round" />

      {/* sleeve seams */}
      <path d={oversized ? "M118 150 L96 190" : "M124 146 L100 186"} stroke={seam} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d={oversized ? "M282 150 L304 190" : "M276 146 L300 186"} stroke={seam} strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Collar. From behind you see the closed neck band and the tape seam
          sewn just below it, not the scooped opening the front shows.
          Both curves have to sit *inside* the body outline, whose own
          neckline dips to y≈94 on the regular block and y≈101 on the
          oversized one — draw them any higher and they float off the
          garment onto the background. */}
      {face === "back" ? (
        <>
          <path
            d={
              hoodie ? "M156 98 C170 120 230 120 244 98"
              : oversized ? "M150 100 C168 122 232 122 250 100"
              : "M156 92 C172 114 228 114 244 92"
            }
            fill="none" stroke={seam} strokeWidth={hoodie ? 8 : 5.5} strokeLinecap="round"
          />
          {!hoodie && (
            <path
              d={oversized
                ? "M156 110 C172 128 228 128 244 110"
                : "M162 102 C176 120 224 120 238 102"}
              fill="none" stroke={seam} strokeWidth="1.6" opacity="0.55" strokeLinecap="round"
            />
          )}
        </>
      ) : crew || hoodie ? (
        <path
          d={hoodie ? "M156 92 C170 116 230 116 244 92" : "M150 80 C168 104 232 104 250 80"}
          fill="none" stroke={seam} strokeWidth={hoodie ? 8 : 6} strokeLinecap="round"
        />
      ) : (
        <path d="M150 78 C168 104 232 104 250 78" fill="none" stroke={seam} strokeWidth="4" strokeLinecap="round" />
      )}

      {/* hoodie extras: kangaroo pocket + drawstrings — both front-only */}
      {hoodie && face === "front" && (
        <>
          <path d="M156 300 L156 336 L244 336 L244 300 C244 290 156 290 156 300 Z" fill="none" stroke={seam} strokeWidth="2.5" />
          <path d="M186 128 L182 176" stroke={print} strokeWidth="4" strokeLinecap="round" />
          <path d="M214 128 L218 176" stroke={print} strokeWidth="4" strokeLinecap="round" />
          <circle cx="182" cy="178" r="4" fill={print} />
          <circle cx="218" cy="178" r="4" fill={print} />
        </>
      )}

      {/* ribbed hem for crew/sweatshirt */}
      {crew && <path d="M92 350 L308 350" stroke={seam} strokeWidth="6" strokeLinecap="round" />}

      {face === "back" ? (
        <BackPrint print={print} label={label} sub={sub} y={hoodie ? 216 : 204} />
      ) : (
        <ChestCrest print={print} label={label} y={hoodie ? 176 : 162} />
      )}
    </g>
  );
}

/* The front: a small crest high on the wearer's left chest, the way the
   photographed tees are printed. Deliberately understated — the back is
   what the garment is bought for, and the card's hover flip only pays off
   if the two faces don't compete. */
function ChestCrest({ print, label, y }: { print: string; label: string; y: number }) {
  return (
    <g transform={`translate(248, ${y})`} textAnchor="middle">
      <circle cx="0" cy="0" r="17" fill="none" stroke={print} strokeWidth="2" />
      <circle cx="0" cy="0" r="11.5" fill="none" stroke={print} strokeWidth="1" opacity="0.55" />
      <text x="0" y="5.5" fontSize="13" fontWeight="800" fill={print}
        fontFamily="var(--font-body), sans-serif">★</text>
      <text x="0" y="31" fontSize="9.5" fontWeight="700" letterSpacing="1.4"
        fill={print} fontFamily="var(--font-body), sans-serif">{label}</text>
    </g>
  );
}

/* The back: the full lockup, centred between the shoulder blades and ruled
   above and below, echoing the arc-and-rule layout of the real prints. */
function BackPrint({
  print, label, sub, y,
}: { print: string; label: string; sub?: string; y: number }) {
  return (
    <g transform={`translate(200, ${y})`} textAnchor="middle">
      {/* kept inside the shoulder line — run it wider and it crosses the
          sleeve seams, which reads as the print bleeding onto the sleeve */}
      <path d="M-56 -52 L56 -52" stroke={print} strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <circle cx="0" cy="-30" r="15" fill="none" stroke={print} strokeWidth="2" />
      <text x="0" y="-25" fontSize="13" fontWeight="800" fill={print}
        fontFamily="var(--font-body), sans-serif">★</text>

      <text x="0" y="10" fontSize="34" fontWeight="800" letterSpacing="0.5"
        fill={print} fontFamily="var(--font-body), sans-serif">{label}</text>

      <path d="M-62 26 L62 26" stroke={print} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <text x="0" y="45" fontSize="10.5" fontWeight="600" letterSpacing="3"
        fill={print} opacity="0.9" fontFamily="var(--font-body), sans-serif">
        {(sub ?? "CAMPUS THINGS").toUpperCase()}
      </text>
      <text x="0" y="66" fontSize="8.5" fontWeight="500" letterSpacing="2.4"
        fill={print} opacity="0.7" fontFamily="var(--font-body), sans-serif">
        CAMPUS THINGS
      </text>
    </g>
  );
}

function Lower({
  garment, print, label, seam, edge,
}: { garment: string; print: string; label: string; seam: string; edge: string }) {
  return (
    <g>
      {/* waistband */}
      <rect x="128" y="60" width="144" height="26" rx="10" fill={garment} stroke={edge} strokeWidth="2" />
      <rect x="128" y="60" width="144" height="26" rx="10" fill="url(#ct-sheen)" />
      {/* drawstrings */}
      <path d="M192 82 L188 104" stroke={print} strokeWidth="4" strokeLinecap="round" />
      <path d="M208 82 L212 104" stroke={print} strokeWidth="4" strokeLinecap="round" />
      <circle cx="188" cy="106" r="4" fill={print} />
      <circle cx="212" cy="106" r="4" fill={print} />

      {/* two tapered legs */}
      <path
        d="M130 86 L198 86 L196 176 L188 344 L138 344 L150 190 C150 150 140 120 130 100 Z"
        fill={garment} stroke={edge} strokeWidth="2" strokeLinejoin="round"
      />
      <path
        d="M270 86 L202 86 L204 176 L212 344 L262 344 L250 190 C250 150 260 120 270 100 Z"
        fill={garment} stroke={edge} strokeWidth="2" strokeLinejoin="round"
      />
      <path d="M130 86 L198 86 L196 176 L188 344 L138 344 L150 190 C150 150 140 120 130 100 Z" fill="url(#ct-sheen)" />
      <path d="M270 86 L202 86 L204 176 L212 344 L262 344 L250 190 C250 150 260 120 270 100 Z" fill="url(#ct-sheen)" />

      {/* centre seam + inseam shading */}
      <path d="M200 86 L200 176" stroke={seam} strokeWidth="2.5" />
      <path d="M200 176 L196 300" stroke={seam} strokeWidth="1.6" opacity="0.7" />
      {/* ribbed ankle cuffs */}
      <rect x="138" y="330" width="52" height="18" rx="7" fill={garment} stroke={seam} strokeWidth="2" />
      <rect x="212" y="330" width="52" height="18" rx="7" fill={garment} stroke={seam} strokeWidth="2" />

      {/* side stripe + hip wordmark */}
      <path d="M138 110 L134 300" stroke={print} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      <text x="168" y="150" textAnchor="middle" fontSize="15" fontWeight="800" letterSpacing="0.5"
        fill={print} fontFamily="var(--font-body), sans-serif" transform="rotate(-90 168 150)">{label}</text>
    </g>
  );
}

function Cap({
  garment, print, label, seam, edge,
}: { garment: string; print: string; label: string; seam: string; edge: string }) {
  return (
    <g transform="translate(0, 40)">
      {/* brim */}
      <path d="M96 250 C96 300 320 300 320 254 L320 244 C320 236 96 236 96 244 Z"
        fill={garment} stroke={edge} strokeWidth="2" />
      <path d="M96 250 C96 300 320 300 320 254" fill="url(#ct-sheen)" />
      {/* crown */}
      <path d="M112 250 C112 150 288 150 288 250 Z" fill={garment} stroke={edge} strokeWidth="2" />
      <path d="M112 250 C112 150 288 150 288 250 Z" fill="url(#ct-sheen)" />
      {/* panel seams */}
      <path d="M200 156 L200 250" stroke={seam} strokeWidth="2" />
      <path d="M160 165 C168 210 168 232 168 250" stroke={seam} strokeWidth="1.6" fill="none" />
      <path d="M240 165 C232 210 232 232 232 250" stroke={seam} strokeWidth="1.6" fill="none" />
      <circle cx="200" cy="162" r="5" fill={seam} />
      {/* front print */}
      <text x="200" y="222" textAnchor="middle" fontSize="26" fontWeight="800"
        fill={print} fontFamily="var(--font-body), sans-serif">{label}</text>
    </g>
  );
}
