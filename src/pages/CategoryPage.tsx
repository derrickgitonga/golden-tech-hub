import { useParams, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

import { useProducts } from "@/contexts/ProductContext";

const CategoryPage = () => {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q");
    const { products } = useProducts();

    let categoryName = "Products";
    if (category) {
        categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    } else if (searchQuery) {
        categoryName = `Search Results for "${searchQuery}"`;
    }

    // Filter products based on category or search query
    const filteredProducts = products.filter(p => {
        // If category is present, filter by category
        if (category) {
            return p.category?.toLowerCase() === category.toLowerCase();
        }

        // If search query is present, filter by name, brand, description, or category
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                p.name.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.category?.toLowerCase().includes(query)
            );
        }

        // If neither, show all products
        return true;
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16 container mx-auto px-4">
                <div className="mb-12">
                    <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
                        {categoryName} <span className="text-gradient-gold">Collection</span>
                    </h1>
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? `Found ${filteredProducts.length} results for your search.`
                            : `Explore our premium selection of ${categoryName.toLowerCase()}.`
                        }
                    </p>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} containImage={true} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CategoryPage;
