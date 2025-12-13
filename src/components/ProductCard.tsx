import { useState } from "react";
import { Heart, Star, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  badge?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group relative bg-gradient-card rounded-2xl overflow-hidden border border-border hover:border-gold/30 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-gold text-primary-foreground text-xs font-semibold">
          {product.badge}
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-gold/20 transition-colors"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isFavorite ? "fill-gold text-gold" : "text-muted-foreground"
          }`}
        />
      </button>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Image Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {product.images.map((_, index) => (
              <button
                key={index}
                onMouseEnter={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-gold w-6"
                    : "bg-foreground/30 hover:bg-foreground/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div
          className={`absolute inset-x-4 bottom-4 flex gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button variant="glass" size="lg" className="flex-1">
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </Button>
          <Button variant="glass" size="icon" className="h-12 w-12">
            <Eye className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-xs text-gold font-medium uppercase tracking-wider mb-2">
          {product.brand}
        </div>
        <h3 className="font-display text-lg font-medium text-foreground mb-3 line-clamp-2 group-hover:text-gold transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-gold text-gold"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl font-semibold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
              <span className="px-2 py-0.5 rounded bg-gold/10 text-gold text-xs font-medium">
                -{discount}%
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
