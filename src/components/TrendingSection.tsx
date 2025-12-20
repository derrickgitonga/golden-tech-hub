import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useProducts } from "@/contexts/ProductContext";
import { useNavigate } from "react-router-dom";

const TrendingSection = () => {
  const { products } = useProducts();
  const navigate = useNavigate();

  // Filter for Apple products (latest first)
  const appleProducts = products
    .filter(p => p.brand === "Apple")
    .slice(0, 4);

  // Filter for Samsung products (latest first)
  const samsungProducts = products
    .filter(p => p.brand === "Samsung")
    .slice(0, 4);

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
          <Button
            variant="gold-outline"
            size="lg"
            className="self-start md:self-auto"
            onClick={() => navigate('/search')}
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Apple Row */}
        <div className="mb-16">
          <h3 className="font-display text-2xl font-medium text-foreground mb-6 flex items-center gap-2">
            <span className="text-2xl">🍎</span> Latest iPhone Series
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {appleProducts.map((product, index) => (
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

        {/* Samsung Row */}
        <div>
          <h3 className="font-display text-2xl font-medium text-foreground mb-6 flex items-center gap-2">
            <span className="text-2xl">🌌</span> Latest Samsung Series
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {samsungProducts.map((product, index) => (
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
      </div>
    </section>
  );
};

export default TrendingSection;
