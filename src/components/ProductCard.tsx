import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

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
  containImage?: boolean;
}

const ProductCard = ({ product, containImage = false }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
    });
    navigate("/checkout");
  };

  const isSmartphone = product.brand === "Apple" || product.brand === "Samsung" || product.brand === "Google";

  return (
    <div
      className={`group relative ${isSmartphone ? 'bg-gradient-to-b from-gray-50 to-white shadow-sm hover:shadow-md' : 'bg-gradient-to-b from-[hsl(0,0%,8%)] to-[hsl(0,0%,5%)] shadow-card'} rounded-2xl overflow-hidden border ${isSmartphone ? 'border-gray-200' : 'border-border'} hover:border-gold/30 transition-all duration-300`}
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsFavorite(!isFavorite);
        }}
        className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSmartphone ? 'bg-white/80 hover:bg-white border border-gray-200' : 'bg-[hsl(0,0%,10%)]/50 backdrop-blur-xl border border-[hsl(0,0%,18%)]/50 hover:bg-gold/20'}`}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${isFavorite ? "fill-gold text-gold" : isSmartphone ? "text-gray-600" : "text-muted-foreground"
            }`}
        />
      </button>

      {/* Image Container */}
      <div className={`relative aspect-square overflow-hidden ${isSmartphone ? 'bg-white' : 'bg-secondary/50'}`}>
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${containImage ? "object-contain p-4" : "object-cover"
              }`}
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* Color Variant Dots - Back Market Style */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {product.images.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onMouseEnter={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                  ? "bg-gray-900 w-6"
                  : isSmartphone ? "bg-gray-300 hover:bg-gray-400" : "bg-foreground/30 hover:bg-foreground/50"
                  }`}
              />
            ))}
            {product.images.length > 5 && (
              <span className={`text-xs ${isSmartphone ? 'text-gray-600' : 'text-muted-foreground'}`}>
                +{product.images.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div
          className={`absolute inset-x-4 bottom-4 flex gap-2 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          <Button variant="glass" size="sm" className="flex-1" onClick={handleAddToCart}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button variant="gold" size="sm" className="flex-1" onClick={handleBuyNow}>
            Buy Now
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-5">
        <div className={`text-xs font-medium uppercase tracking-wider mb-2 ${isSmartphone ? 'text-gray-900' : 'text-gold'}`}>
          {product.brand}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className={`font-display text-sm md:text-lg font-medium mb-2 md:mb-3 line-clamp-2 transition-colors ${isSmartphone ? 'text-gray-900 group-hover:text-gray-700' : 'text-foreground group-hover:text-gold'}`}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 md:w-4 md:h-4 ${i < Math.floor(product.rating)
                    ? isSmartphone ? "fill-gray-900 text-gray-900" : "fill-gold text-gold"
                    : isSmartphone ? "text-gray-400" : "text-muted-foreground"
                  }`}
              />
            ))}
          </div>
          <span className={`text-sm ${isSmartphone ? 'text-gray-600' : 'text-muted-foreground'}`}>
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className={`font-display text-lg md:text-2xl font-semibold ${isSmartphone ? 'text-gray-900' : 'text-foreground'}`}>
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <>
              <span className={`text-sm line-through ${isSmartphone ? 'text-gray-500' : 'text-muted-foreground'}`}>
                ${product.originalPrice.toLocaleString()}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${isSmartphone ? 'bg-gray-900 text-white' : 'bg-gold/10 text-gold'}`}>
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
