import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

const trendingProducts = [
  {
    id: 1,
    name: "MacBook Pro 16\" M3 Max",
    brand: "Apple",
    price: 3499,
    originalPrice: 3999,
    rating: 4.9,
    reviews: 2847,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b92bc9?w=600&h=600&fit=crop",
    ],
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 Wireless",
    brand: "Sony",
    price: 348,
    originalPrice: 399,
    rating: 4.8,
    reviews: 5621,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
    ],
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max 256GB",
    brand: "Apple",
    price: 1199,
    rating: 4.7,
    reviews: 8932,
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=600&fit=crop",
    ],
    badge: "New",
  },
  {
    id: 4,
    name: "Samsung Galaxy Watch 6 Pro",
    brand: "Samsung",
    price: 449,
    originalPrice: 549,
    rating: 4.6,
    reviews: 1523,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop",
    ],
  },
  {
    id: 5,
    name: "Dell XPS 15 OLED Touch",
    brand: "Dell",
    price: 2199,
    originalPrice: 2499,
    rating: 4.5,
    reviews: 982,
    images: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop",
    ],
  },
  {
    id: 6,
    name: "Bose QuietComfort Ultra",
    brand: "Bose",
    price: 379,
    rating: 4.8,
    reviews: 3421,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
    ],
    badge: "Top Rated",
  },
  {
    id: 7,
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    price: 1649,
    originalPrice: 1899,
    rating: 4.7,
    reviews: 1876,
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop",
    ],
  },
  {
    id: 8,
    name: "iPad Pro 12.9\" M2",
    brand: "Apple",
    price: 1099,
    rating: 4.9,
    reviews: 4231,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&h=600&fit=crop",
    ],
  },
];

const TrendingSection = () => {
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
