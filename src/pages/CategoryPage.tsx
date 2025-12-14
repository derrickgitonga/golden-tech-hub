import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

import { useProducts } from "@/contexts/ProductContext";

const CategoryPage = () => {
    const { category } = useParams();
    const { products } = useProducts();
    const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Products";

    // Filter products based on category or search query (if we were implementing search here)
    // For now, simple category filter. If category is undefined (e.g. /search), show all or filter by query param
    const filteredProducts = category
        ? products.filter(p => p.category?.toLowerCase() === category.toLowerCase() || p.category === undefined) // Include undefined for now to show something if category missing
        : products;

    // If we are on search page, we might want to show all or filter by query. 
    // For this step, let's just show all products if no category is specified (like in /search route mapped to this page)

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16 container mx-auto px-4">
                <div className="mb-12">
                    <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
                        {categoryName} <span className="text-gradient-gold">Collection</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Explore our premium selection of {categoryName.toLowerCase()}.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CategoryPage;
