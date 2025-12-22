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
        // Define static products first so they are always available
        const newProducts: Product[] = [
            { id: 99901, name: "Burgundy Galaxy S22 Ultra", brand: "Samsung", price: 899, rating: 4.7, reviews: 120, images: ["/Burgundy-galaxy-s22-ultra.jpg"], category: "Smartphones", description: "Stand out with the sophisticated Burgundy finish. Features the embedded S Pen for ultimate productivity and Nightography for stunning low-light photos.", features: ["6.8\" Dynamic AMOLED 2X Display", "Snapdragon 8 Gen 1 Processor", "108MP Wide-Angle Camera", "Embedded S Pen", "5000mAh Battery", "45W Super Fast Charging"] },
            { id: 99902, name: "Burgundy Galaxy S24 Ultra", brand: "Samsung", price: 1199, rating: 4.9, reviews: 85, images: ["/Burgundy-galaxy-s24-ultra.jpg"], category: "Smartphones", description: "Unleash the power of Galaxy AI in a stunning Burgundy titanium frame. The ultimate device for creativity and performance.", features: ["6.8\" QHD+ Dynamic AMOLED 2X", "Snapdragon 8 Gen 3 for Galaxy", "200MP Main Camera", "Titanium Frame", "Galaxy AI Features", "Corning Gorilla Armor"] },
            { id: 99903, name: "Silverblue Galaxy S25 Ultra", brand: "Samsung", price: 1299, rating: 5.0, reviews: 10, images: ["/Silverblue-galaxy-s25-ultra.jpg"], category: "Smartphones", description: "Step into the future with the Galaxy S25 Ultra. Featuring a revolutionary holographic display and next-gen AI processing in a mesmerizing Silverblue finish.", features: ["6.9\" Holographic AMOLED", "Snapdragon 8 Gen 4", "320MP AI Camera System", "5500mAh Graphene Battery", "Next-Gen Neural Processing", "Zero-Bezel Design"] },
            { id: 99904, name: "Black Galaxy S22 Ultra", brand: "Samsung", price: 850, rating: 4.6, reviews: 200, images: ["/black-galaxy-s22-ultra.jpg"], category: "Smartphones", description: "The classic powerhouse. Black Galaxy S22 Ultra combines sleek design with the productivity of the Note series.", features: ["6.8\" 120Hz Adaptive Display", "108MP Quad Camera System", "100x Space Zoom", "IP68 Water Resistance", "Embedded S Pen", "Armor Aluminum Frame"] },
            { id: 99905, name: "Black Galaxy S23 Ultra", brand: "Samsung", price: 999, rating: 4.8, reviews: 150, images: ["/black-galaxy-s23-ultra.jpg"], category: "Smartphones", description: "Epic moments start here. The Black Galaxy S23 Ultra features a 200MP camera to capture your world in incredible detail.", features: ["6.8\" Edge QHD+ Display", "Snapdragon 8 Gen 2 Mobile Platform", "200MP Wide Camera", "Nightography", "Recycled Materials", "Long-lasting Battery"] },
            { id: 99906, name: "Black Galaxy S24 Ultra", brand: "Samsung", price: 1199, rating: 4.9, reviews: 90, images: ["/black-galaxy-s24-ultra.jpg"], category: "Smartphones", description: "Titanium tough. AI smart. The Black Galaxy S24 Ultra sets a new standard for premium smartphones with Galaxy AI.", features: ["Titanium Exterior", "Galaxy AI Integration", "2600 nits Peak Brightness", "Ray Tracing Support", "7 Years of Updates", "Flat Display Design"] },
            { id: 99907, name: "Black Galaxy S25 Ultra", brand: "Samsung", price: 1299, rating: 5.0, reviews: 5, images: ["/black-galaxy-s25-ultra.webp"], category: "Smartphones", description: "Absolute dominance. The Black Galaxy S25 Ultra redefines performance with hyper-realistic graphics and instantaneous AI response.", features: ["Hyper-Real Graphics Engine", "Instant AI Response", "Ceramic Shield Back", "Under-Display Camera", "Satellite Connectivity", "Bio-Authentication"] },
            { id: 99908, name: "Black iPhone 16 Pro", brand: "Apple", price: 1099, rating: 4.8, reviews: 50, images: ["/black-iphone-16pro.jpg"], category: "Smartphones", description: "Built for Apple Intelligence. The Black iPhone 16 Pro features the A18 Pro chip and all-new Camera Control for pro-level photography.", features: ["6.3\" Super Retina XDR", "A18 Pro Chip", "Camera Control Button", "48MP Fusion Camera", "Apple Intelligence", "Grade 5 Titanium"] },
            { id: 99909, name: "Desert iPhone 16 Pro", brand: "Apple", price: 1099, rating: 4.7, reviews: 45, images: ["/desert-iphone-16-pro.jpg"], category: "Smartphones", description: "A stunning new finish. The Desert Titanium iPhone 16 Pro brings warmth and elegance to the most powerful iPhone yet.", features: ["Desert Titanium Finish", "4K 120fps Dolby Vision", "Action Button", "Always-On Display", "USB-C 3.0", "25 Hours Video Playback"] },
            { id: 99910, name: "Gold iPhone 17 Pro", brand: "Apple", price: 1199, rating: 5.0, reviews: 2, images: ["/gold-iphone-17pro(back).jpeg"], category: "Smartphones", description: "Pure luxury. The Gold iPhone 17 Pro features a refined design and the groundbreaking A19 chip for unmatched speed.", features: ["A19 Bionic Chip", "ProMotion 120Hz", "Ultra-Thin Bezels", "Real Gold Finish Accents", "Face ID 2.0", "Wi-Fi 7E Support"] },
            { id: 99911, name: "Gold Silver Black iPhone 17 Pro", brand: "Apple", price: 1199, rating: 4.9, reviews: 8, images: ["/gold-silver-black-iphone-17pro(back).jpeg"], category: "Smartphones", description: "Choose your style. The iPhone 17 Pro series offers a finish for every taste, all powered by the most advanced mobile silicon.", features: ["Multi-Tone Finish Options", "Triple 48MP Camera System", "All-Day Battery Life", "Ceramic Shield 3.0", "Spatial Video Recording", "Action Button 2.0"] },
            { id: 99912, name: "Green Galaxy S23 Ultra", brand: "Samsung", price: 950, rating: 4.7, reviews: 110, images: ["/green-galaxy-s23-ultra.jpg"], category: "Smartphones", description: "Inspired by nature. The Green Galaxy S23 Ultra is crafted with eco-conscious materials without compromising on power.", features: ["Eco-Friendly Materials", "Snapdragon 8 Gen 2", "120Hz Refresh Rate", "Astro Hyperlapse", "Expert RAW App", "Knox Security"] },
            { id: 99913, name: "Grey iPhone 15 Pro", brand: "Apple", price: 999, rating: 4.6, reviews: 300, images: ["/grey-iphone-15-pro.jpg"], category: "Smartphones", description: "Forged in titanium. The Grey iPhone 15 Pro is lighter, stronger, and more pro than ever before.", features: ["Aerospace-Grade Titanium", "A17 Pro Chip", "USB-C Connector", "Action Button", "Photonic Engine", "Emergency SOS via Satellite"] },
            { id: 99914, name: "Grey iPhone 17 Pro", brand: "Apple", price: 1199, rating: 5.0, reviews: 12, images: ["/grey-iphone-17pro(front-and-back).jpeg"], category: "Smartphones", description: "The definitive iPhone experience. Grey iPhone 17 Pro offers a seamless all-screen design and professional-grade camera system.", features: ["Under-Display Face ID", "8K Video Recording", "Spatial Audio", "Super Retina XDR", "Haptic Touch", "MagSafe Enhanced"] },
            { id: 99915, name: "Grey iPhone Air", brand: "Apple", price: 899, rating: 4.5, reviews: 25, images: ["/grey-iphone-air(back-and-front).jpeg"], category: "Smartphones", description: "Impossibly thin. Powerfully capable. The Grey iPhone Air redefines portability with its ultra-slim profile.", features: ["5mm Ultra-Slim Profile", "M4 Mobile Chip", "OLED Retina Display", "Single 48MP Wide Camera", "Air Light Design", "All-Day Battery"] },
            { id: 99916, name: "iPhone 17 Pro", brand: "Apple", price: 1199, rating: 5.0, reviews: 15, images: ["/iphone-17pro(cover photo).jpeg"], category: "Smartphones", description: "Beyond Pro. The iPhone 17 Pro sets a new benchmark for smartphone photography and performance.", features: ["Quad-Pixel Sensor", "Neural Engine 16-core", "ProRes Video", "LiDAR Scanner", "Precision Dual-Frequency GPS", "Thread Networking"] },
            { id: 99917, name: "iPhone 17 Pro Front", brand: "Apple", price: 1199, rating: 5.0, reviews: 10, images: ["/iphone-17pro(front).jpeg"], category: "Smartphones", description: "Immerse yourself. The iPhone 17 Pro display offers incredible brightness and color accuracy for a cinematic experience.", features: ["3000 nits Peak Brightness", "Always-On Display", "ProMotion Technology", "True Tone", "P3 Wide Color", "Oleophobic Coating"] },
            { id: 99918, name: "iPhone Air Camera", brand: "Apple", price: 899, rating: 4.4, reviews: 18, images: ["/iphone-air(camera0.jpeg"], category: "Smartphones", description: "Minimalist master. The iPhone Air camera system delivers stunning photos in a streamlined, single-lens design.", features: ["48MP Fusion Camera", "Next-Gen Portraits", "Smart HDR 6", "Deep Fusion", "Night Mode", "4K Video at 60fps"] },
            { id: 99919, name: "iPhone Air", brand: "Apple", price: 899, rating: 4.6, reviews: 30, images: ["/iphone-air(cover-photo).jpeg"], category: "Smartphones", description: "Air light. Heavy hitter. The iPhone Air packs flagship performance into the thinnest iPhone ever created.", features: ["Featherweight Body", "A18 Chip", "MagSafe Charging", "Face ID", "5G Capable", "Water Resistant"] },
            { id: 99920, name: "Pink iPhone 16", brand: "Apple", price: 799, rating: 4.7, reviews: 60, images: ["/pink-iphone-16.jpg"], category: "Smartphones", description: "Pop of color. The Pink iPhone 16 features a vibrant new look, the Action Button, and a huge leap in battery life.", features: ["Color-Infused Glass Back", "Action Button", "A18 Chip", "2x Optical Zoom", "22 Hours Video Playback", "USB-C"] },
            { id: 99921, name: "Red Galaxy S22 Ultra", brand: "Samsung", price: 850, rating: 4.5, reviews: 95, images: ["/red-galaxy-s22-ultra.jpg"], category: "Smartphones", description: "Make a statement. The exclusive Red Galaxy S22 Ultra turns heads while delivering peak performance.", features: ["Exclusive Online Color", "Vision Booster", "45W Charging", "Ultrasonic Fingerprint", "Stereo Speakers", "Samsung DeX"] },
            { id: 99922, name: "Silver iPhone 17 Pro", brand: "Apple", price: 1199, rating: 4.9, reviews: 22, images: ["/silver-iphone-17pro(back).jpeg"], category: "Smartphones", description: "Timeless elegance. The Silver iPhone 17 Pro shines with a polished finish and pro-grade capabilities.", features: ["Polished Titanium Finish", "Tetraprism Telephoto Lens", "Wi-Fi 7", "Bluetooth 5.4", "Crash Detection", "Roadside Assistance"] },
            { id: 99923, name: "Teal iPhone 16", brand: "Apple", price: 799, rating: 4.8, reviews: 55, images: ["/teal-iphone-16.jpg"], category: "Smartphones", description: "Cool and capable. The Teal iPhone 16 brings a fresh look and powerful new features to the classic iPhone.", features: ["Teal Aluminum Finish", "Camera Control", "Dynamic Island", "Super Retina XDR", "Ceramic Shield", "MagSafe"] },
            { id: 99924, name: "Titanium iPhone 15 Pro", brand: "Apple", price: 999, rating: 4.7, reviews: 280, images: ["/titanium-iphone-15pro.jpg"], category: "Smartphones", description: "The original Titanium iPhone. iPhone 15 Pro changed the game with aerospace-grade materials and the A17 Pro chip.", features: ["Natural Titanium", "Hardware Ray Tracing", "Action Button", "USB-C 3 (10Gb/s)", "Log Video Recording", "ACES Color System"] },
            { id: 99925, name: "Ultramarine iPhone 16", brand: "Apple", price: 799, rating: 4.8, reviews: 40, images: ["/ultramine-iphone-16.jpg"], category: "Smartphones", description: "Deep dive. The Ultramarine iPhone 16 features a stunning deep blue finish and the power of Apple Intelligence.", features: ["Ultramarine Glass", "Visual Intelligence", "Macro Photography", "Spatial Audio", "Fast Charging", "iOS 18"] },
            { id: 99926, name: "White Galaxy S22 Ultra", brand: "Samsung", price: 850, rating: 4.6, reviews: 130, images: ["/white-galaxy-s22-ultra.jpg"], category: "Smartphones", description: "Pure and simple. The White Galaxy S22 Ultra offers a clean, minimal aesthetic with maximum power.", features: ["Phantom White Finish", "Gorilla Glass Victus+", "100x Space Zoom", "8K Video Recording", "Wireless PowerShare", "IP68 Rating"] },
            { id: 99927, name: "White Galaxy S23 Ultra", brand: "Samsung", price: 999, rating: 4.8, reviews: 100, images: ["/white-galaxy-s23-ultra.webp"], category: "Smartphones", description: "Bright brilliance. The White Galaxy S23 Ultra shines with its stunning display and advanced camera system.", features: ["Cream Finish", "Astro Hyperlapse", "Expert RAW", "Adaptive Pixel", "Detail Enhancer", "Auto Framing"] },
            { id: 99928, name: "White iPhone 15 Pro", brand: "Apple", price: 999, rating: 4.7, reviews: 250, images: ["/white-iphone-15pro.jpg"], category: "Smartphones", description: "Classic Pro. The White Titanium iPhone 15 Pro offers a bright, premium look with the durability of titanium.", features: ["White Titanium", "Log Video Recording", "USB 3 Speeds", "Pro Camera System", "Photonic Engine", "Deep Fusion"] },
            { id: 99929, name: "White iPhone 16", brand: "Apple", price: 799, rating: 4.8, reviews: 70, images: ["/white-iphone-16.jpg"], category: "Smartphones", description: "Crisp and clean. The White iPhone 16 is the perfect blend of style and substance, now with Camera Control.", features: ["White Glass Back", "Photographic Styles", "Spatial Audio", "Voice Isolation", "Crash Detection", "MagSafe"] },
            { id: 99930, name: "Yellow Galaxy S24 Ultra", brand: "Samsung", price: 1199, rating: 4.9, reviews: 80, images: ["/yellow-galaxy-s24-ultra.jpg"], category: "Smartphones", description: "Radiant energy. The Yellow Galaxy S24 Ultra brings a vibrant titanium glow to the smartest Galaxy ever.", features: ["Titanium Yellow", "Generative Edit", "Chat Assist", "Note Assist", "Circle to Search", "Live Translate"] },
            { id: 99931, name: "Google Pixel 9 Pro XL", brand: "Google", price: 1099, rating: 4.9, reviews: 45, images: ["/grey-google-pixel-9.jpg"], category: "Smartphones", description: "The most powerful Pixel yet with the largest display and advanced AI.", features: ["6.8\" Super Actua Display", "Google Tensor G4", "Pro Triple Rear Camera System", "Gemini Advanced", "7 Years of Pixel Drops", "48-hour Battery Life"] },
            { id: 99932, name: "Google Pixel 9 Pro", brand: "Google", price: 999, rating: 4.8, reviews: 32, images: ["/white-google-pixel-9.jpg"], category: "Smartphones", description: "Pro-level performance in a perfect size, featuring Gemini AI.", features: ["6.3\" Super Actua Display", "Google Tensor G4", "Pro Triple Rear Camera System", "Gemini Advanced", "Polished Finish", "Fast Charging"] },
            { id: 99933, name: "Google Pixel 9", brand: "Google", price: 799, rating: 4.7, reviews: 28, images: ["/pink-google-pixel-9.jpg"], category: "Smartphones", description: "The advanced AI phone that's engineered for everyone.", features: ["6.3\" Actua Display", "Google Tensor G4", "Advanced Dual Rear Camera", "Gemini Nano", "Satin Finish", "All-day Battery"] },
        ];

        let mappedProducts: Product[] = [];

        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.warn("Supabase fetch failed, falling back to local products only:", error.message);
                // Don't throw, just let it proceed with empty mappedProducts
            } else if (data) {
                mappedProducts = data.map((item: any) => ({
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
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            // We suppress the toast error here to avoid scaring the user if they are just viewing static content
            // toast.error("Failed to load products"); 
        } finally {
            // Always set products, combining static and fetched (if any)
            setProducts([...newProducts, ...mappedProducts]);
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
