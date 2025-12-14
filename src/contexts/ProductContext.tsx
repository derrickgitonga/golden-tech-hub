import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    images: string[];
    badge?: string;
    category?: string;
    description?: string;
    features?: string[];
}

interface ProductContextType {
    products: Product[];
    addProduct: (product: Omit<Product, "id">) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mappedProducts: Product[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    brand: item.brand,
                    price: item.price,
                    originalPrice: item.original_price,
                    rating: item.rating,
                    reviews: item.reviews,
                    images: item.images || [],
                    badge: item.badge,
                    category: item.category,
                    description: item.description,
                    features: item.features || [],
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = async (product: Omit<Product, "id">) => {
        try {
            const dbProduct = {
                name: product.name,
                brand: product.brand,
                price: product.price,
                original_price: product.originalPrice,
                rating: product.rating,
                reviews: product.reviews,
                images: product.images,
                badge: product.badge,
                category: product.category,
                description: product.description,
                features: product.features,
            };

            const { data, error } = await supabase
                .from('products')
                .insert([dbProduct])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                const newProduct: Product = {
                    id: data.id,
                    name: data.name,
                    brand: data.brand,
                    price: data.price,
                    originalPrice: data.original_price,
                    rating: data.rating,
                    reviews: data.reviews,
                    images: data.images || [],
                    badge: data.badge,
                    category: data.category,
                    description: data.description,
                    features: data.features || [],
                };
                setProducts((prev) => [newProduct, ...prev]);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error("Failed to add product");
            throw error;
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setProducts((prev) => prev.filter((product) => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error("Failed to delete product");
            throw error;
        }
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, deleteProduct, loading }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
};
