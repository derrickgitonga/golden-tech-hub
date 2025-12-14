import { ArrowRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

import { useProducts } from "@/contexts/ProductContext";

const GoogleSection = () => {
    const { products } = useProducts();
    const googleProducts = products.filter(p => p.brand === "Google");
    return (
        <section className="py-24 bg-background relative">
            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 mb-4">
                            <Smartphone className="w-4 h-4 text-gold" />
                            <span className="text-sm text-gold font-medium">Google Collection</span>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
                            Experience <span className="text-gradient-gold">Pixel</span>
                        </h2>
                    </div>
                    <Button variant="gold-outline" size="lg" className="self-start md:self-auto">
                        View All Google Phones
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {googleProducts.map((product, index) => (
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

export default GoogleSection;
