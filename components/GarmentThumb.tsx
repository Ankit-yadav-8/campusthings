"use client";

import Image from "next/image";
import { useState } from "react";
import GarmentMockup, { type GarmentFace } from "@/components/GarmentMockup";
import { getCollege, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * A product's visual, whichever kind it has: real photography if the
 * product carries any, the generated SVG otherwise. Shared so no two grids
 * can drift apart on it.
 *
 * The product PNGs have had their studio backdrop keyed out, so they sit
 * on transparency and can be inset like the mockups — `contain` inside a
 * margin, with the tile colour showing through behind the garment. (Back
 * when the grey backdrop was still baked in, any inset exposed it as a
 * rectangle and the photos had to bleed to the edges instead.)
 *
 * `face` picks the side shown at rest. `hoverFlip` stacks the opposite face
 * on top and cross-fades to it when an ancestor marked `group` is hovered —
 * which now works for mockups too, since those have a back as well.
 */
export default function GarmentThumb({
  product,
  sizes,
  face = "back",
  hoverFlip = false,
  preload = false,
  className,
}: {
  product: Product;
  sizes: string;
  /** which side rests face-up — defaults to the back, where the print is */
  face?: GarmentFace;
  hoverFlip?: boolean;
  preload?: boolean;
  className?: string;
}) {
  const college = getCollege(product.collegeId);
  const other: GarmentFace = face === "front" ? "back" : "front";

  if (product.photo) {
    return (
      // tight inset: the PNGs are trimmed to the garment's bounding box, so
      // this padding is the entire margin — the file has none of its own
      <span className={cn("absolute inset-0 p-3", className)}>
        <span className="relative block w-full h-full">
          <Photo
            src={product.photo[face]}
            alt={`${product.name}, ${face}`}
            sizes={sizes}
            preload={preload}
            variant={hoverFlip ? "rest" : "solo"}
          />
          {hoverFlip && (
            <Photo
              src={product.photo[other]}
              alt=""
              aria-hidden
              sizes={sizes}
              variant="flip"
            />
          )}
        </span>
      </span>
    );
  }

  const mockup = (f: GarmentFace, hidden?: boolean) => (
    <GarmentMockup
      kind={product.kind}
      garment={product.garment}
      print={product.print}
      label={college?.short ?? "CT"}
      sub={product.section}
      face={f}
      className={cn(
        "absolute inset-0 w-full h-full transition-opacity duration-500",
        hidden ? "opacity-0 group-hover:opacity-100" : "group-hover:opacity-0"
      )}
    />
  );

  return (
    <span className={cn("absolute inset-0 grid place-items-center p-5", className)}>
      <span className="relative block w-full h-full">
        {hoverFlip ? (
          <>
            {mockup(face)}
            {mockup(other, true)}
          </>
        ) : (
          <GarmentMockup
            kind={product.kind}
            garment={product.garment}
            print={product.print}
            label={college?.short ?? "CT"}
            sub={product.section}
            face={face}
            className="w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
      </span>
    </span>
  );
}

/**
 * One photograph, faded up once it has actually decoded. Without this the
 * garment snaps in at full opacity a beat after the tile paints, which is
 * the single most visible piece of jank on the grids.
 *
 * `variant` is a closed set rather than a free className because the resting
 * and flipped faces set *conflicting* opacity utilities. Two single-class
 * selectors are resolved by stylesheet order, not by the order they appear
 * in the attribute, so composing them from the outside is a coin toss.
 */
function Photo({
  src, alt, sizes, preload, variant, ...rest
}: {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  variant: "solo" | "rest" | "flip";
  "aria-hidden"?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...rest}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      onLoad={() => setLoaded(true)}
      className={cn(
        "object-contain transition-opacity duration-500 ease-out",
        !loaded && "opacity-0",
        loaded && variant === "solo" && "opacity-100",
        loaded && variant === "rest" && "opacity-100 group-hover:opacity-0",
        loaded && variant === "flip" && "opacity-0 group-hover:opacity-100"
      )}
    />
  );
}
