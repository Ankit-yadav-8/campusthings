import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import { getProduct, getCollege, relatedProducts, inr } from "@/lib/data";

export async function generateMetadata(
  { params }: PageProps<"/product/[id]">
): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) return { title: "Product not found | Campus Things" };
  return {
    title: `${p.name} — ${inr(p.price)} | Campus Things`,
    description: `${p.name}. ${p.fabric}. Campus-verified print, free shipping over ₹999.`,
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[id]">) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const college = getCollege(product.collegeId)!;
  const related = relatedProducts(product, 4);

  return (
    <div className="container-x py-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
        <Link href="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/college/${college.id}`} className="hover:text-ink">{college.short}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink font-bold line-clamp-1">{product.name}</span>
      </nav>

      <ProductDetail product={product} college={college} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="h-section">
            You may also like
          </h2>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
