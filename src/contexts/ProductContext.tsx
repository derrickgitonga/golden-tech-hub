import React, { createContext, useContext, useState, useEffect } from "react";

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
    addProduct: (product: Product) => void;
    deleteProduct: (id: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
    // Trending Products
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
            "https://images.unsplash.com/photo-1531297461136-82lw9z1w1w1?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
        ],
        badge: "Bestseller",
        category: "laptops",
        description: "The new MacBook Pro delivers game-changing performance for pro users. With the powerful M3 Max chip, it handles the most demanding workflows with ease. The stunning Liquid Retina XDR display provides extreme dynamic range and incredible contrast.",
        features: [
            "M3 Max chip with 16-core CPU and 40-core GPU",
            "16.2-inch Liquid Retina XDR display",
            "Up to 22 hours of battery life",
            "1080p FaceTime HD camera",
            "Six-speaker sound system with Spatial Audio"
        ]
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
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
        ],
        category: "audio",
        description: "Experience industry-leading noise cancellation with the Sony WH-1000XM5. These headphones feature a lightweight design, crystal-clear hands-free calling, and up to 30 hours of battery life for all-day listening."
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
            "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop",
        ],
        badge: "New",
        category: "smartphones",
        description: "iPhone 15 Pro Max. Forged in titanium. Featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever."
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
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
        ],
        category: "wearables",
        description: "Track your fitness and health with the Samsung Galaxy Watch 6 Pro. Featuring advanced sleep coaching, heart rate monitoring, and a durable design perfect for outdoor adventures."
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
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop",
        ],
        category: "laptops",
        description: "The Dell XPS 15 is the perfect balance of power and portability. With a stunning OLED touch display and high-performance components, it's ideal for creators and professionals."
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
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1524678606372-569688eeee36?w=600&h=600&fit=crop",
        ],
        badge: "Top Rated",
        category: "audio",
        description: "World-class noise cancellation, quieter than ever before. Breakthrough spatial audio for more immersive listening. And an elevated design and luxe materials for unrivaled comfort."
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
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=600&fit=crop",
        ],
        category: "laptops",
        description: "The ROG Zephyrus G14 is the world's most powerful 14-inch gaming laptop. Now with more power, a better display, and a new AniMe Matrix LED display on the lid."
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
            "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop",
        ],
        category: "tablets",
        description: "The ultimate iPad experience with the breakthrough performance of the M2 chip, a breathtaking XDR display, and blazing-fast wireless connectivity."
    },
    // Google Products
    {
        id: 101,
        name: "Google Pixel 9 Pro XL",
        brand: "Google",
        price: 1099,
        rating: 4.8,
        reviews: 1250,
        images: [
            "https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=600&h=600&fit=crop",
        ],
        badge: "New Arrival",
        category: "smartphones",
        description: "The most powerful Pixel yet. Pixel 9 Pro XL features a refined design, the new Tensor G4 chip, and Google's best camera system with pro-level controls."
    },
    {
        id: 102,
        name: "Google Pixel 9 Pro",
        brand: "Google",
        price: 999,
        rating: 4.7,
        reviews: 980,
        images: [
            "https://images.unsplash.com/photo-1610792516820-2f58a294660c?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1598327105717-8f8e6c2d9048?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1655560378427-7f8924178816?w=600&h=600&fit=crop",
        ],
        badge: "Top Rated",
        category: "smartphones",
        description: "Pixel 9 Pro has a telephoto lens, pro-level camera controls, and a high-resolution display. It's the pro phone that fits in your pocket."
    },
    {
        id: 103,
        name: "Google Pixel 9",
        brand: "Google",
        price: 799,
        rating: 4.6,
        reviews: 850,
        images: [
            "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=600&h=600&fit=crop",
        ],
        category: "smartphones",
        description: "Meet Pixel 9. The helpful phone engineered by Google. It has an amazing camera, all-day battery, and helpful AI features."
    },
    {
        id: 104,
        name: "Google Pixel 8a",
        brand: "Google",
        price: 499,
        originalPrice: 549,
        rating: 4.5,
        reviews: 2100,
        images: [
            "https://images.unsplash.com/photo-1655560378427-7f8924178816?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=600&h=600&fit=crop",
        ],
        badge: "Best Value",
        category: "smartphones",
        description: "The AI-amazing Pixel 8a. It has the Google Tensor G3 chip, a great camera, and helpful features like Best Take and Audio Magic Eraser."
    },
];

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>(() => {
        const savedProducts = localStorage.getItem("products");
        return savedProducts ? JSON.parse(savedProducts) : initialProducts;
    });

    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(products));
    }, [products]);

    const addProduct = (product: Product) => {
        setProducts((prev) => [...prev, product]);
    };

    const deleteProduct = (id: number) => {
        setProducts((prev) => prev.filter((product) => product.id !== id));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
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
