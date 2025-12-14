import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

import { useProducts } from "@/contexts/ProductContext";

const TrendingSection = () => {
  const { products } = useProducts();
  // Filter for trending products (e.g., first 8 or specifically marked)
  // For now, let's just take the first 8 products that are NOT Google products (to keep the sections distinct if desired, or just mix them)
  // Actually, let's just show the first 8 products from the context as "Trending"
  const trendingProducts = products.slice(0, 8);
  return (
    <section className="py-24 bg-background relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 mb-4">
              <Flame className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold font-medium">Trending Now</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Most Popular <span className="text-gradient-gold">Products</span>
            </h2>
          </div>
          <Button variant="gold-outline" size="lg" className="self-start md:self-auto">
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingProducts.map((product, index) => (
            <div
              key={product.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
