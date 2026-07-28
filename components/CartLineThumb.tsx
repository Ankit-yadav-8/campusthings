"use client";

import Image from "next/image";
import GarmentMockup from "@/components/GarmentMockup";
import type { CartLine } from "@/lib/cart-store";
import type { GarmentKind } from "@/lib/data";

/**
 * The garment for one bag line. Photographed products keep their shot all
 * the way through the bag and checkout — seeing the mockup reappear at the
 * moment of payment is exactly where it would read as a bait-and-switch.
 *
 * Shows the back, which is the face the product was bought off.
 */
export default function CartLineThumb({
  line, sizes,
}: { line: CartLine; sizes: string }) {
  if (line.photo) {
    return (
      <Image
        src={line.photo.back}
        alt={line.name}
        fill
        sizes={sizes}
        className="object-contain p-1"
      />
    );
  }

  return (
    <GarmentMockup
      kind={line.kind as GarmentKind}
      garment={line.garment}
      print={line.print}
      label={line.name.split("·")[0].trim()}
      face="back"
      className="absolute inset-0 w-full h-full p-1"
    />
  );
}
