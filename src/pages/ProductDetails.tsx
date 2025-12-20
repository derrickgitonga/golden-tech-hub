import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, ShoppingBag, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products } = useProducts();
    const { addToCart } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const product = products.find((p) => p.id === Number(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-display text-foreground mb-4">Product not found</h1>
                    <Button onClick={() => navigate("/")} variant="gold-outline">
                        Go Home
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.images[0],
        });
    };

    const handleBuyNow = () => {
        addToCart({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.images[0],
        });
        navigate("/checkout");
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16 container mx-auto px-4">
                <Button
                    variant="ghost"
                    className="mb-8 pl-0 hover:pl-2 transition-all"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/50 border border-border">
                            <img
                                src={product.images[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === index
                                            ? "border-gold"
                                            : "border-transparent hover:border-gold/50"
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} view ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <div className="text-gold font-medium uppercase tracking-wider mb-2">
                                {product.brand}
                            </div>
                            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                ? "fill-gold text-gold"
                                                : "text-muted-foreground"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-muted-foreground">
                                    {product.reviews} reviews
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-3xl font-semibold text-foreground">
                                ${product.price.toLocaleString()}
                                {product.originalPrice && (
                                    <>
                                        <span className="text-xl text-muted-foreground line-through">
                                            ${product.originalPrice.toLocaleString()}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium">
                                            Save {discount}%
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                {product.description || "No description available for this product."}
                            </p>
                        </div>

                        {product.features && product.features.length > 0 && (
                            <div className="space-y-4 pt-6 border-t border-border">
                                <h3 className="text-xl font-semibold">Key Features</h3>
                                <ul className="space-y-3">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3 text-muted-foreground">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="pt-8 border-t border-border flex gap-4">
                            <Button size="lg" className="flex-1" onClick={handleAddToCart} variant="gold-outline">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Add to Cart
                            </Button>
                            <Button size="lg" className="flex-1" onClick={handleBuyNow} variant="gold">
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetails;
