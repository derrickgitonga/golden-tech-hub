import { useParams, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/contexts/ProductContext";
import { searchProducts, filterByCategory } from "@/utils/searchUtils";

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
    let exactMatches = [];
    let similarProducts = [];
    let filteredProducts = [];

    if (category) {
        // Category filtering
        filteredProducts = filterByCategory(products, category);
    } else if (searchQuery) {
        // Smart search with fuzzy matching
        const searchResult = searchProducts(products, searchQuery);
        exactMatches = searchResult.exactMatches;
        similarProducts = searchResult.similarProducts;
        filteredProducts = [...exactMatches, ...similarProducts];
    } else {
        // Show all products
        filteredProducts = products;
    }

    const hasExactMatches = exactMatches.length > 0;
    const hasSimilarProducts = similarProducts.length > 0;
    const isSearching = !!searchQuery;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16 container mx-auto px-4">
                <div className="mb-12">
                    <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
                        {categoryName} <span className="text-gradient-gold">Collection</span>
                    </h1>

                    {isSearching ? (
                        <div className="space-y-2">
                            {hasExactMatches && (
                                <p className="text-muted-foreground">
                                    Found {exactMatches.length} exact {exactMatches.length === 1 ? 'match' : 'matches'} for your search.
                                </p>
                            )}
                            {!hasExactMatches && hasSimilarProducts && (
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">
                                        No exact matches found for "{searchQuery}".
                                    </p>
                                    <p className="text-gold font-medium">
                                        Showing {similarProducts.length} similar {similarProducts.length === 1 ? 'product' : 'products'} you might like:
                                    </p>
                                </div>
                            )}
                            {!hasExactMatches && !hasSimilarProducts && (
                                <p className="text-muted-foreground">
                                    No products found matching your search.
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            Explore our premium selection of {categoryName.toLowerCase()}.
                        </p>
                    )}
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="space-y-12">
                        {/* Exact Matches Section */}
                        {isSearching && hasExactMatches && (
                            <div>
                                <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                    <span className="text-gold">✓</span> Exact Matches
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {exactMatches.map((product) => (
                                        <ProductCard key={product.id} product={product} containImage={true} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Similar Products Section */}
                        {isSearching && hasSimilarProducts && (
                            <div>
                                {hasExactMatches && (
                                    <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                        <span className="text-gold">→</span> Similar Products
                                    </h2>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {similarProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} containImage={true} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Category/All Products View */}
                        {!isSearching && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} containImage={true} />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 space-y-4">
                        <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
                        {isSearching && (
                            <div className="space-y-2">
                                <p className="text-muted-foreground">Try searching with different keywords or browse our categories:</p>
                                <div className="flex flex-wrap gap-3 justify-center mt-4">
                                    <a href="/category/smartphones" className="px-4 py-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors">
                                        Smartphones
                                    </a>
                                    <a href="/category/wearables" className="px-4 py-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors">
                                        Wearables
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CategoryPage;
