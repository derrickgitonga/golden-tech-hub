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
            { id: 99901, name: "Burgundy Galaxy S22 Ultra", brand: "Samsung", price: 899, rating: 4.7, reviews: 120, images: ["/Burgundy-galaxy-s22-ultra.jpg"], category: "Smartphones", description: "Experience the pinnacle of smartphone technology with the Samsung Galaxy S22 Ultra in a sophisticated Burgundy finish. This powerhouse features a massive 6.8-inch Dynamic AMOLED 2X display with a 3088 x 1440 resolution for crystal-clear visuals. Capture every detail with the pro-grade 108MP wide-angle camera and 100x Space Zoom. Equipped with 12GB of RAM, 256GB of storage, and the embedded S Pen, it offers ultimate productivity. Runs on Android 12, upgradable to the latest version.", features: ["12GB RAM", "Android 12", "256GB Storage", "6.8\" QHD+ AMOLED", "108MP Main Camera", "Burgundy Finish", "Embedded S Pen", "5000mAh Battery"] },
            { id: 99902, name: "Burgundy Galaxy S24 Ultra", brand: "Samsung", price: 1199, rating: 4.9, reviews: 85, images: ["/Burgundy-galaxy-s24-ultra.jpg"], category: "Smartphones", description: "Unleash the power of Galaxy AI in a stunning Burgundy titanium frame. The Galaxy S24 Ultra boasts a 6.8-inch QHD+ Dynamic AMOLED 2X display with 2600 nits brightness. Its 200MP main camera captures life in unprecedented detail, while the Snapdragon 8 Gen 3 processor ensures seamless performance. With 12GB of RAM, 512GB of storage, and Android 14, it's the ultimate device for creativity.", features: ["12GB RAM", "Android 14", "512GB Storage", "6.8\" QHD+ AMOLED", "200MP Main Camera", "Titanium Frame", "Galaxy AI Features", "Corning Gorilla Armor"] },
            { id: 99903, name: "Silverblue Galaxy S25 Ultra", brand: "Samsung", price: 1299, rating: 5.0, reviews: 10, images: ["/Silverblue-galaxy-s25-ultra.jpg"], category: "Smartphones", description: "Step into the future with the Galaxy S25 Ultra in a mesmerizing Silverblue finish. Featuring a revolutionary 6.9-inch Holographic AMOLED display with 4K resolution, it redefines visual immersion. The 320MP AI camera system delivers hyper-realistic photos, powered by the Snapdragon 8 Gen 4. With 16GB of RAM, 1TB of storage, and Android 15, it's built for the next generation.", features: ["16GB RAM", "Android 15", "1TB Storage", "6.9\" Holographic AMOLED", "320MP AI Camera", "Silverblue Finish", "5500mAh Graphene Battery", "Zero-Bezel Design"] },
            { id: 99904, name: "Black Galaxy S22 Ultra", brand: "Samsung", price: 850, rating: 4.6, reviews: 200, images: ["/black-galaxy-s22-ultra.jpg"], category: "Smartphones", description: "The classic powerhouse. The Black Galaxy S22 Ultra combines sleek design with the productivity of the Note series. It features a 6.8-inch Edge QHD+ display and a versatile 108MP quad-camera system. With 12GB of RAM, 128GB of storage, and IP68 water resistance, this device is built to withstand the elements while delivering top-tier performance on Android 12.", features: ["12GB RAM", "Android 12", "128GB Storage", "6.8\" Edge QHD+", "108MP Quad Camera", "Phantom Black", "100x Space Zoom", "Armor Aluminum Frame"] },
            { id: 99905, name: "Black Galaxy S23 Ultra", brand: "Samsung", price: 999, rating: 4.8, reviews: 150, images: ["/black-galaxy-s23-ultra.jpg"], category: "Smartphones", description: "Epic moments start here. The Black Galaxy S23 Ultra features a groundbreaking 200MP camera to capture your world in incredible detail. Its 6.8-inch Dynamic AMOLED 2X display offers vibrant colors and deep blacks. Powered by the Snapdragon 8 Gen 2 for Galaxy, 12GB of RAM, and packing 256GB of storage, it delivers the fastest mobile gaming experience on Android 13.", features: ["12GB RAM", "Android 13", "256GB Storage", "6.8\" Dynamic AMOLED 2X", "200MP Wide Camera", "Phantom Black", "Nightography", "Long-lasting Battery"] },
            { id: 99906, name: "Black Galaxy S24 Ultra", brand: "Samsung", price: 1199, rating: 4.9, reviews: 90, images: ["/black-galaxy-s24-ultra.jpg"], category: "Smartphones", description: "Titanium tough. AI smart. The Black Galaxy S24 Ultra sets a new standard for premium smartphones. It features a flat 6.8-inch QHD+ display and a 200MP camera system enhanced by Galaxy AI. With 12GB of RAM, 512GB of storage, and a titanium exterior, it offers both durability and cutting-edge technology with Android 14.", features: ["12GB RAM", "Android 14", "512GB Storage", "6.8\" Flat QHD+", "200MP AI Camera", "Titanium Black", "Galaxy AI", "7 Years of Updates"] },
            { id: 99907, name: "Black Galaxy S25 Ultra", brand: "Samsung", price: 1299, rating: 5.0, reviews: 5, images: ["/black-galaxy-s25-ultra.webp"], category: "Smartphones", description: "Absolute dominance. The Black Galaxy S25 Ultra redefines performance with a Hyper-Real Graphics Engine and instantaneous AI response. Its 6.9-inch display features an under-display camera for a truly uninterrupted view. With 16GB of RAM, 1TB of storage, and Android 15, it's the most advanced Galaxy yet.", features: ["16GB RAM", "Android 15", "1TB Storage", "6.9\" Infinite Display", "Under-Display Camera", "Ceramic Black", "Satellite Connectivity", "Bio-Authentication"] },
            { id: 99908, name: "Black iPhone 16 Pro", brand: "Apple", price: 1099, rating: 4.8, reviews: 50, images: ["/black-iphone-16pro.jpg"], category: "Smartphones", description: "Built for Apple Intelligence. The Black iPhone 16 Pro features the powerful A18 Pro chip and a stunning 6.3-inch Super Retina XDR display. The all-new Camera Control button gives you instant access to the 48MP Fusion camera. With 8GB of RAM, 256GB of storage, and iOS 18, it's the ultimate pro tool.", features: ["8GB RAM", "iOS 18", "256GB Storage", "6.3\" Super Retina XDR", "48MP Fusion Camera", "Black Titanium", "Camera Control", "A18 Pro Chip"] },
            { id: 99909, name: "Desert iPhone 16 Pro", brand: "Apple", price: 1099, rating: 4.7, reviews: 45, images: ["/desert-iphone-16-pro.jpg"], category: "Smartphones", description: "A stunning new finish. The Desert Titanium iPhone 16 Pro brings warmth and elegance to the most powerful iPhone yet. It features a 6.3-inch Super Retina XDR display and the A18 Pro chip for blazing-fast performance. With 8GB of RAM, 256GB of storage, and iOS 18, it's a filmmaker's dream.", features: ["8GB RAM", "iOS 18", "256GB Storage", "6.3\" Super Retina XDR", "48MP Fusion Camera", "Desert Titanium", "4K 120fps Video", "USB-C 3.0"] },
            { id: 99910, name: "Gold iPhone 17 Pro", brand: "Apple", price: 1199, rating: 5.0, reviews: 2, images: ["/gold-iphone-17pro(back).jpeg"], category: "Smartphones", description: "Pure luxury. The Gold iPhone 17 Pro features a refined design with real gold finish accents and the groundbreaking A19 chip. Its 6.4-inch ProMotion display offers ultra-smooth visuals. With 12GB of RAM, 512GB of storage, and iOS 19, it delivers unmatched speed and security.", features: ["12GB RAM", "iOS 19", "512GB Storage", "6.4\" ProMotion Display", "Triple 48MP Camera", "Real Gold Finish", "A19 Bionic Chip", "Wi-Fi 7E"] },
            { id: 99911, name: "Gold Silver Black iPhone 17 Pro", brand: "Apple", price: 1199, rating: 4.9, reviews: 8, images: ["/gold-silver-black-iphone-17pro(back).jpeg"], category: "Smartphones", description: "Choose your style. The iPhone 17 Pro series offers a finish for every taste, all powered by the most advanced mobile silicon. This model features a unique multi-tone finish, a 6.4-inch Super Retina XDR display, and a triple 48MP camera system. With 12GB of RAM, 512GB of storage, and iOS 19, it's ready for anything.", features: ["12GB RAM", "iOS 19", "512GB Storage", "6.4\" Super Retina XDR", "Triple 48MP Camera", "Multi-Tone Finish", "Ceramic Shield 3.0", "Action Button 2.0"] },
            { id: 99912, name: "Green Galaxy S23 Ultra", brand: "Samsung", price: 950, rating: 4.7, reviews: 110, images: ["/green-galaxy-s23-ultra.jpg"], category: "Smartphones", description: "Inspired by nature. The Green Galaxy S23 Ultra is crafted with eco-conscious materials without compromising on power. It features a 6.8-inch Dynamic AMOLED 2X display and a 200MP main camera. With 12GB of RAM, 256GB of storage, and running Android 13, it delivers top-tier performance in a sustainable package.", features: ["12GB RAM", "Android 13", "256GB Storage", "6.8\" Dynamic AMOLED 2X", "200MP Main Camera", "Botanic Green", "Eco-Friendly Materials", "Knox Security"] },
            { id: 99913, name: "Grey iPhone 15 Pro", brand: "Apple", price: 999, rating: 4.6, reviews: 300, images: ["/grey-iphone-15-pro.jpg"], category: "Smartphones", description: "Forged in titanium. The Grey iPhone 15 Pro is lighter, stronger, and more pro than ever before. It features a 6.1-inch Super Retina XDR display and the A17 Pro chip. With 8GB of RAM, 128GB of storage, and iOS 17, it captures incredible detail and offers next-level gaming performance.", features: ["8GB RAM", "iOS 17", "128GB Storage", "6.1\" Super Retina XDR", "48MP Main Camera", "Natural Titanium", "A17 Pro Chip", "Action Button"] },
            { id: 99914, name: "Grey iPhone 17 Pro", brand: "Apple", price: 1199, rating: 5.0, reviews: 12, images: ["/grey-iphone-17pro(front-and-back).jpeg"], category: "Smartphones", description: "The definitive iPhone experience. The Grey iPhone 17 Pro offers a seamless all-screen design with under-display Face ID. Its 6.4-inch Super Retina XDR display is brighter and more colorful than ever. With 12GB of RAM, 512GB of storage, and iOS 19, it's the ultimate tool for content creators.", features: ["12GB RAM", "iOS 19", "512GB Storage", "6.4\" All-Screen Display", "8K Video Recording", "Titanium Grey", "Under-Display Face ID", "Spatial Audio"] },
            { id: 99915, name: "Grey iPhone Air", brand: "Apple", price: 899, rating: 4.5, reviews: 25, images: ["/grey-iphone-air(back-and-front).jpeg"], category: "Smartphones", description: "Impossibly thin. Powerfully capable. The Grey iPhone Air redefines portability with its 5mm ultra-slim profile. It features a 6.1-inch OLED Retina display and the M4 mobile chip. With 8GB of RAM, 256GB of storage, and iOS 19, it delivers flagship performance in a featherweight design.", features: ["8GB RAM", "iOS 19", "256GB Storage", "6.1\" OLED Retina", "48MP Wide Camera", "Space Grey", "5mm Ultra-Slim", "M4 Mobile Chip"] },
            { id: 99916, name: "iPhone 17 Pro", brand: "Apple", price: 1199, rating: 5.0, reviews: 15, images: ["/iphone-17pro(cover photo).jpeg"], category: "Smartphones", description: "Beyond Pro. The iPhone 17 Pro sets a new benchmark for smartphone photography with its quad-pixel sensor and 16-core Neural Engine. It features a 6.4-inch ProMotion display and 512GB of storage. With 12GB of RAM, iOS 19, and a LiDAR scanner, it's a professional studio in your pocket.", features: ["12GB RAM", "iOS 19", "512GB Storage", "6.4\" ProMotion Display", "Quad-Pixel Sensor", "Deep Purple", "LiDAR Scanner", "Thread Networking"] },
            { id: 99917, name: "iPhone 17 Pro Front", brand: "Apple", price: 1199, rating: 5.0, reviews: 10, images: ["/iphone-17pro(front).jpeg"], category: "Smartphones", description: "Immerse yourself. The iPhone 17 Pro display offers incredible brightness and color accuracy for a cinematic experience. Its 6.4-inch Super Retina XDR display peaks at 3000 nits brightness. With 12GB of RAM, 512GB of storage, and iOS 19, your information is always just a glance away.", features: ["12GB RAM", "iOS 19", "512GB Storage", "6.4\" Super Retina XDR", "3000 nits Brightness", "Graphite", "Always-On Display", "True Tone"] },
            { id: 99918, name: "iPhone Air Camera", brand: "Apple", price: 899, rating: 4.4, reviews: 18, images: ["/iphone-air(camera0.jpeg"], category: "Smartphones", description: "Minimalist master. The iPhone Air camera system delivers stunning photos in a streamlined, single-lens design. It features a 48MP Fusion camera with Next-Gen Portraits and Smart HDR 6. With 8GB of RAM, 256GB of storage, and iOS 19, it proves that less can truly be more.", features: ["8GB RAM", "iOS 19", "256GB Storage", "48MP Fusion Camera", "Smart HDR 6", "Silver", "Night Mode", "4K 60fps Video"] },
            { id: 99919, name: "iPhone Air", brand: "Apple", price: 899, rating: 4.6, reviews: 30, images: ["/iphone-air(cover-photo).jpeg"], category: "Smartphones", description: "Air light. Heavy hitter. The iPhone Air packs flagship performance into the thinnest iPhone ever created. It features a 6.1-inch Super Retina XDR display and the A18 chip. With 8GB of RAM, 256GB of storage, and iOS 19, it combines portability with power.", features: ["8GB RAM", "iOS 19", "256GB Storage", "6.1\" Super Retina XDR", "A18 Chip", "Starlight", "Featherweight Body", "5G Capable"] },
            { id: 99920, name: "Pink iPhone 16", brand: "Apple", price: 799, rating: 4.7, reviews: 60, images: ["/pink-iphone-16.jpg"], category: "Smartphones", description: "Pop of color. The Pink iPhone 16 features a vibrant new look with color-infused glass. It boasts a 6.1-inch Super Retina XDR display and the A18 chip. With 6GB of RAM, 128GB of storage, and iOS 18, it's the perfect blend of style and functionality.", features: ["6GB RAM", "iOS 18", "128GB Storage", "6.1\" Super Retina XDR", "48MP Main Camera", "Pink", "Action Button", "USB-C"] },
            { id: 99921, name: "Red Galaxy S22 Ultra", brand: "Samsung", price: 850, rating: 4.5, reviews: 95, images: ["/red-galaxy-s22-ultra.jpg"], category: "Smartphones", description: "Make a statement. The exclusive Red Galaxy S22 Ultra turns heads while delivering peak performance. It features a 6.8-inch Dynamic AMOLED 2X display and a 108MP quad-camera system. With 12GB of RAM, 256GB of storage, and Android 12, it's a bold choice for power users.", features: ["12GB RAM", "Android 12", "256GB Storage", "6.8\" Dynamic AMOLED 2X", "108MP Quad Camera", "Exclusive Red", "Vision Booster", "Samsung DeX"] },
            { id: 99922, name: "Silver iPhone 17 Pro", brand: "Apple", price: 1199, rating: 4.9, reviews: 22, images: ["/silver-iphone-17pro(back).jpeg"], category: "Smartphones", description: "Timeless elegance. The Silver iPhone 17 Pro shines with a polished titanium finish and pro-grade capabilities. It features a 6.4-inch ProMotion display and a tetraprism telephoto lens. With 12GB of RAM, 512GB of storage, and iOS 19, it's built for the future.", features: ["12GB RAM", "iOS 19", "512GB Storage", "6.4\" ProMotion Display", "Tetraprism Telephoto", "Silver Titanium", "Wi-Fi 7", "Crash Detection"] },
            { id: 99923, name: "Teal iPhone 16", brand: "Apple", price: 799, rating: 4.8, reviews: 55, images: ["/teal-iphone-16.jpg"], category: "Smartphones", description: "Cool and capable. The Teal iPhone 16 brings a fresh look to the classic iPhone design. It features a 6.1-inch Super Retina XDR display and the dynamic island. With 6GB of RAM, 128GB of storage, and iOS 18, capturing memories has never been easier.", features: ["6GB RAM", "iOS 18", "128GB Storage", "6.1\" Super Retina XDR", "48MP Main Camera", "Teal", "Dynamic Island", "Camera Control"] },
            { id: 99924, name: "Titanium iPhone 15 Pro", brand: "Apple", price: 999, rating: 4.7, reviews: 280, images: ["/titanium-iphone-15pro.jpg"], category: "Smartphones", description: "The original Titanium iPhone. iPhone 15 Pro changed the game with aerospace-grade materials. It features a 6.1-inch Super Retina XDR display and the A17 Pro chip. With 8GB of RAM, 256GB of storage, and iOS 17, it's a mobile gaming powerhouse.", features: ["8GB RAM", "iOS 17", "256GB Storage", "6.1\" Super Retina XDR", "48MP Main Camera", "Natural Titanium", "Hardware Ray Tracing", "USB-C 3"] },
            { id: 99925, name: "Ultramarine iPhone 16", brand: "Apple", price: 799, rating: 4.8, reviews: 40, images: ["/ultramine-iphone-16.jpg"], category: "Smartphones", description: "Deep dive. The Ultramarine iPhone 16 features a stunning deep blue finish and the power of Apple Intelligence. It boasts a 6.1-inch Super Retina XDR display and a 48MP Fusion camera. With 6GB of RAM, 128GB of storage, and iOS 18, it reveals a new world of detail.", features: ["6GB RAM", "iOS 18", "128GB Storage", "6.1\" Super Retina XDR", "48MP Fusion Camera", "Ultramarine", "Visual Intelligence", "Macro Photography"] },
            { id: 99926, name: "White Galaxy S22 Ultra", brand: "Samsung", price: 850, rating: 4.6, reviews: 130, images: ["/white-galaxy-s22-ultra.jpg"], category: "Smartphones", description: "Pure and simple. The White Galaxy S22 Ultra offers a clean, minimal aesthetic with maximum power. It features a 6.8-inch Dynamic AMOLED 2X display and a 108MP camera system. With 12GB of RAM, 256GB of storage, and Android 12, it's perfect for capturing life's moments in high definition.", features: ["12GB RAM", "Android 12", "256GB Storage", "6.8\" Dynamic AMOLED 2X", "108MP Main Camera", "Phantom White", "8K Video Recording", "Gorilla Glass Victus+"] },
            { id: 99927, name: "White Galaxy S23 Ultra", brand: "Samsung", price: 999, rating: 4.8, reviews: 100, images: ["/white-galaxy-s23-ultra.webp"], category: "Smartphones", description: "Bright brilliance. The White Galaxy S23 Ultra shines with its stunning 6.8-inch display and advanced camera system. It features a 200MP main sensor for incredible detail. With 12GB of RAM, 256GB of storage, and Android 13, it's designed for those who look up at the stars.", features: ["12GB RAM", "Android 13", "256GB Storage", "6.8\" Dynamic AMOLED 2X", "200MP Main Camera", "Cream", "Astro Hyperlapse", "Adaptive Pixel"] },
            { id: 99928, name: "White iPhone 15 Pro", brand: "Apple", price: 999, rating: 4.7, reviews: 250, images: ["/white-iphone-15pro.jpg"], category: "Smartphones", description: "Classic Pro. The White Titanium iPhone 15 Pro offers a bright, premium look with the durability of titanium. It features a 6.1-inch Super Retina XDR display and the A17 Pro chip. With 8GB of RAM, 256GB of storage, and iOS 17, it's a versatile tool for any creative.", features: ["8GB RAM", "iOS 17", "256GB Storage", "6.1\" Super Retina XDR", "48MP Main Camera", "White Titanium", "Log Video Recording", "Photonic Engine"] },
            { id: 99929, name: "White iPhone 16", brand: "Apple", price: 799, rating: 4.8, reviews: 70, images: ["/white-iphone-16.jpg"], category: "Smartphones", description: "Crisp and clean. The White iPhone 16 is the perfect blend of style and substance. It features a 6.1-inch Super Retina XDR display and the new Camera Control. With 6GB of RAM, 128GB of storage, and iOS 18, you can personalize every shot.", features: ["6GB RAM", "iOS 18", "128GB Storage", "6.1\" Super Retina XDR", "48MP Fusion Camera", "White", "Photographic Styles", "Spatial Audio"] },
            { id: 99930, name: "Yellow Galaxy S24 Ultra", brand: "Samsung", price: 1199, rating: 4.9, reviews: 80, images: ["/yellow-galaxy-s24-ultra.jpg"], category: "Smartphones", description: "Radiant energy. The Yellow Galaxy S24 Ultra brings a vibrant titanium glow to the smartest Galaxy ever. It features a 6.8-inch QHD+ display and Galaxy AI integration. With 12GB of RAM, 512GB of storage, and Android 14, it changes how you interact with the world.", features: ["12GB RAM", "Android 14", "512GB Storage", "6.8\" QHD+ AMOLED", "200MP AI Camera", "Titanium Yellow", "Galaxy AI", "Live Translate"] },
            { id: 99931, name: "Google Pixel 9 Pro XL", brand: "Google", price: 1099, rating: 4.9, reviews: 45, images: ["/Grey-Google-Pixel-9-Pro-XL.jpg"], category: "Smartphones", description: "The most powerful Pixel yet. The Pixel 9 Pro XL features a massive 6.8-inch Super Actua display and the Google Tensor G4 chip. With 16GB of RAM, 512GB of storage, and Android 14, it delivers stunning photos and videos. Enjoy 7 years of Pixel Drops and Gemini Advanced integration.", features: ["16GB RAM", "Android 14", "512GB Storage", "6.8\" Super Actua Display", "50MP Triple Camera", "Obsidian", "Google Tensor G4", "Gemini Advanced"] },
            { id: 99932, name: "Google Pixel 9 Pro", brand: "Google", price: 999, rating: 4.8, reviews: 32, images: ["/White-Google-Pixel-9-Pro.jpg"], category: "Smartphones", description: "Pro-level performance in a perfect size. The Pixel 9 Pro features a 6.3-inch Super Actua display and the Google Tensor G4 chip. With 16GB of RAM, 256GB of storage, and Android 14, it feels as good as it looks. Capture amazing details with the 50MP triple camera system and edit with AI magic.", features: ["16GB RAM", "Android 14", "256GB Storage", "6.3\" Super Actua Display", "50MP Triple Camera", "Porcelain", "Google Tensor G4", "Fast Charging"] },
            { id: 99933, name: "Google Pixel 9", brand: "Google", price: 799, rating: 4.7, reviews: 28, images: ["/pink-google-pixel-9.jpg"], category: "Smartphones", description: "The advanced AI phone that's engineered for everyone. The Pixel 9 features a 6.3-inch Actua display and the Google Tensor G4 chip. With 12GB of RAM, 128GB of storage, and Android 14, it captures vibrant photos in any light. The satin finish and all-day battery make it a joy to use.", features: ["12GB RAM", "Android 14", "128GB Storage", "6.3\" Actua Display", "50MP Dual Camera", "Peony", "Google Tensor G4", "Gemini Nano"] },
            { id: 99934, name: "Google Pixel 9 Pro Fold (Black)", brand: "Google", price: 1745, rating: 4.9, reviews: 15, images: ["/Black-Google-Pixel-9-Pro-Fold.jpg"], category: "Smartphones", description: "The thinnest foldable from Google. The Pixel 9 Pro Fold features an 8-inch Super Actua Flex display and a 6.3-inch cover display. Powered by the Tensor G4, 16GB of RAM, and Android 14, it offers seamless multitasking. With 512GB of storage, it's the ultimate productivity device.", features: ["16GB RAM", "Android 14", "512GB Storage", "8\" Super Actua Flex", "48MP Triple Camera", "Obsidian", "Split Screen", "Satin Metal Hinge"] },
            { id: 99935, name: "Google Pixel 9 Pro Fold (White)", brand: "Google", price: 1820, rating: 4.8, reviews: 12, images: ["/White-Google-Pixel-9-Pro-Fold.jpg"], category: "Smartphones", description: "Unfold a new world of possibilities. The Pixel 9 Pro Fold in Porcelain features a stunning 8-inch Super Actua Flex display. With 16GB of RAM, 512GB of storage, and Android 14, it handles the most demanding tasks with ease. The satin metal hinge ensures durability and a smooth folding experience.", features: ["16GB RAM", "Android 14", "512GB Storage", "8\" Super Actua Flex", "48MP Triple Camera", "Porcelain", "Google Tensor G4", "24+ Hours Battery"] },
            { id: 99936, name: "Google Pixel 10 (Blue)", brand: "Google", price: 915, rating: 5.0, reviews: 5, images: ["/Blue-Google-Pixel-10.jpg"], category: "Smartphones", description: "Future-ready performance. The Pixel 10 features the next-gen Google Tensor G5 chip and a 6.4-inch Actua display. With 16GB of RAM, 256GB of storage, and Android 15, it captures life like never before. The stunning Blue finish and eco-friendly materials make it a sustainable choice.", features: ["16GB RAM", "Android 15", "256GB Storage", "6.4\" Actua Display", "64MP AI Camera", "Bay Blue", "Google Tensor G5", "Next-Gen Assistant"] },
            { id: 99937, name: "Google Pixel 10 (Grey)", brand: "Google", price: 885, rating: 4.9, reviews: 8, images: ["/Grey-Google-Pixel-10.jpg"], category: "Smartphones", description: "Sleek, powerful, and intelligent. The Pixel 10 in Grey redefines the smartphone experience with the Google Tensor G5 chip. It features a 6.4-inch Actua display, 16GB of RAM, and 256GB of storage. With Android 15 and advanced AI features, it's the smartest Pixel yet.", features: ["16GB RAM", "Android 15", "256GB Storage", "6.4\" Actua Display", "64MP AI Camera", "Charcoal", "Google Tensor G5", "Eco-Friendly"] },
            { id: 99938, name: "Google Pixel 9 Pro (Pink)", brand: "Google", price: 1025, rating: 4.8, reviews: 20, images: ["/Pink-Google-Pixel-9-Pro.jpg"], category: "Smartphones", description: "Pro-level camera and performance in a stunning Rose Quartz finish. The Pixel 9 Pro features a 6.3-inch Super Actua display and the Google Tensor G4 chip. With 16GB of RAM, 256GB of storage, and Android 14, it puts the power of AI in your pocket.", features: ["16GB RAM", "Android 14", "256GB Storage", "6.3\" Super Actua Display", "50MP Triple Camera", "Rose Quartz", "Gemini Advanced", "Google Tensor G4"] },
            { id: 99939, name: "Google Pixel 9 Pro (Grey)", brand: "Google", price: 985, rating: 4.9, reviews: 25, images: ["/grey-Google-Pixel-9-Pro.jpg"], category: "Smartphones", description: "The ultimate Google phone. The Pixel 9 Pro in Hazel features a 6.3-inch Super Actua display and the Google Tensor G4 chip. With 16GB of RAM, 256GB of storage, and Android 14, it delivers exceptional results. Enjoy fast charging and a polished finish.", features: ["16GB RAM", "Android 14", "256GB Storage", "6.3\" Super Actua Display", "50MP Triple Camera", "Hazel", "Google Tensor G4", "Fast Charging"] },
            // Smart Watches
            { id: 99940, name: "Apple Watch Series 9", brand: "Apple", price: 399, rating: 4.8, reviews: 150, images: ["/Black_smart  watch.jpg"], category: "Wearables", description: "Smarter. Brighter. Mightier. The Apple Watch Series 9 in Midnight Aluminum features a 45mm Always-On Retina display with up to 2000 nits brightness. Powered by the S9 SiP, it enables the magical Double Tap gesture. With 1GB of RAM, 64GB of storage, and watchOS 10, it's the ultimate companion for a healthy life.", features: ["1GB RAM", "watchOS 10", "64GB Storage", "45mm Retina Display", "S9 SiP Chip", "Midnight Aluminum", "Double Tap Gesture", "Blood Oxygen App"] },
            { id: 99941, name: "Samsung Galaxy Watch 6 Classic", brand: "Samsung", price: 299, rating: 4.7, reviews: 120, images: ["/White-smart  watch.jpg"], category: "Wearables", description: "The rotating bezel is back. The Galaxy Watch 6 Classic features a timeless design with a 47mm Super AMOLED display. It offers advanced sleep coaching and heart health monitoring. With 2GB of RAM, 16GB of storage, and Wear OS 4, it's a stylish and functional addition to your wrist.", features: ["2GB RAM", "Wear OS 4", "16GB Storage", "47mm Super AMOLED", "Rotating Bezel", "Silver Stainless Steel", "Sleep Coaching", "Samsung Wallet"] },
            { id: 99942, name: "Google Pixel Watch 2", brand: "Google", price: 349, rating: 4.6, reviews: 85, images: ["/Blue_smart watch.jpg"], category: "Wearables", description: "Help by Google. Health by Fitbit. The Pixel Watch 2 features a 41mm AMOLED display and a lightweight aluminum housing. It offers the most accurate heart rate tracking yet and stress management tools. With 2GB of RAM, 32GB of storage, and Wear OS 4, it keeps up with your day.", features: ["2GB RAM", "Wear OS 4", "32GB Storage", "41mm AMOLED", "Fitbit Health Tracking", "Matte Black", "Heart Rate Tracking", "Google Assistant"] },
            { id: 99943, name: "Apple Watch Ultra 2", brand: "Apple", price: 799, rating: 4.9, reviews: 60, images: ["/Maroon-smart watch.jpg"], category: "Wearables", description: "The most rugged and capable Apple Watch. The Ultra 2 features a 49mm titanium case and the brightest Always-On Retina display at 3000 nits. Designed for outdoor adventure, it includes a depth gauge and dual-frequency GPS. With 1GB of RAM, 64GB of storage, and watchOS 10, it's ready for anything.", features: ["1GB RAM", "watchOS 10", "64GB Storage", "49mm Retina Display", "Titanium Case", "Natural Titanium", "3000 nits Brightness", "72-Hour Battery"] },
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
