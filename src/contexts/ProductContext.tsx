import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface ProductVariant {
    colors: Array<{
        name: string;
        hex: string;
        image: string;
    }>;
    storage: Array<{
        size: string;
        price: number;
    }>;
}

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
    variants?: ProductVariant;
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
            // Consolidated Products with Variants
            {
                id: 200001,
                name: "Galaxy S22 Ultra",
                brand: "Samsung",
                price: 850,
                originalPrice: 1199,
                rating: 4.6,
                reviews: 545,
                images: ["/black-galaxy-s22-ultra.jpg", "/Burgundy-galaxy-s22-ultra.jpg", "/red-galaxy-s22-ultra.jpg", "/white-galaxy-s22-ultra.jpg"],
                category: "Smartphones",
                description: "The classic powerhouse. The Galaxy S22 Ultra combines sleek design with the productivity of the Note series. It features a 6.8-inch Dynamic AMOLED 2X display with a 3088 x 1440 resolution for crystal-clear visuals. Capture every detail with the pro-grade 108MP quad-camera system and 100x Space Zoom. Equipped with the embedded S Pen, it offers ultimate productivity.\n\n5G connectivity enabled for ultra-fast speeds. This device is built to withstand the elements while delivering top-tier performance on Android 12, upgradable to the latest version. IP68 water resistance, Vision Booster technology, and Samsung DeX support make it perfect for power users.",
                features: ["12GB RAM", "Android 12", "6.8\" QHD+ AMOLED", "108MP Quad Camera", "100x Space Zoom", "Embedded S Pen", "5G Capable", "IP68 Water Resistant", "Vision Booster", "Samsung DeX"],
                variants: {
                    colors: [
                        { name: "Phantom Black", hex: "#1F2937", image: "/black-galaxy-s22-ultra.jpg" },
                        { name: "Burgundy", hex: "#991B1B", image: "/Burgundy-galaxy-s22-ultra.jpg" },
                        { name: "Red", hex: "#DC2626", image: "/red-galaxy-s22-ultra.jpg" },
                        { name: "Phantom White", hex: "#F9FAFB", image: "/white-galaxy-s22-ultra.jpg" }
                    ],
                    storage: [
                        { size: "128GB", price: 850 },
                        { size: "256GB", price: 899 },
                        { size: "512GB", price: 999 }
                    ]
                }
            },
            {
                id: 200002,
                name: "Galaxy S23 Ultra",
                brand: "Samsung",
                price: 950,
                originalPrice: 1299,
                rating: 4.8,
                reviews: 360,
                images: ["/black-galaxy-s23-ultra.jpg", "/green-galaxy-s23-ultra.jpg", "/white-galaxy-s23-ultra.webp"],
                category: "Smartphones",
                description: "Epic moments start here. The Galaxy S23 Ultra features a groundbreaking 200MP camera to capture your world in incredible detail. Its 6.8-inch Dynamic AMOLED 2X display offers vibrant colors and deep blacks. Powered by the Snapdragon 8 Gen 2 for Galaxy, it delivers the fastest mobile gaming experience.\n\n5G connectivity enabled for ultra-fast speeds - download movies in seconds, stream in highest quality, and enjoy lag-free gaming. Crafted with eco-conscious materials, it delivers top-tier performance in a sustainable package. Features include Nightography for stunning low-light photos, Astro Hyperlapse, and Samsung Knox security on Android 13.",
                features: ["12GB RAM", "Android 13", "6.8\" Dynamic AMOLED 2X", "200MP Main Camera", "Nightography", "5G Ultra-Fast", "Eco-Friendly Materials", "Knox Security", "Astro Hyperlapse", "Long-lasting Battery"],
                variants: {
                    colors: [
                        { name: "Phantom Black", hex: "#1F2937", image: "/black-galaxy-s23-ultra.jpg" },
                        { name: "Botanic Green", hex: "#059669", image: "/green-galaxy-s23-ultra.jpg" },
                        { name: "Cream", hex: "#F5F5DC", image: "/white-galaxy-s23-ultra.webp" }
                    ],
                    storage: [
                        { size: "256GB", price: 950 },
                        { size: "512GB", price: 1099 }
                    ]
                }
            },
            {
                id: 200003,
                name: "Galaxy S24 Ultra",
                brand: "Samsung",
                price: 1199,
                originalPrice: 1599,
                rating: 4.9,
                reviews: 255,
                images: ["/black-galaxy-s24-ultra.jpg", "/Burgundy-galaxy-s24-ultra.jpg", "/yellow-galaxy-s24-ultra.jpg"],
                category: "Smartphones",
                description: "Titanium tough. AI smart. The Galaxy S24 Ultra sets a new standard for premium smartphones. It features a flat 6.8-inch QHD+ Dynamic AMOLED 2X display with 2600 nits brightness and a 200MP camera system enhanced by Galaxy AI. With a titanium exterior, it offers both durability and cutting-edge technology.\n\n5G connectivity enabled for ultra-fast speeds - enjoy seamless streaming, instant downloads, and responsive cloud gaming. Galaxy AI integration changes how you interact with the world with features like Live Translate, Circle to Search, and AI-powered photo editing. Runs on Android 14 with 7 years of updates guaranteed.",
                features: ["12GB RAM", "Android 14", "6.8\" QHD+ AMOLED", "200MP AI Camera", "Titanium Frame", "Galaxy AI Features", "5G Ultra-Fast", "Corning Gorilla Armor", "Live Translate", "7 Years of Updates"],
                variants: {
                    colors: [
                        { name: "Titanium Black", hex: "#1F2937", image: "/black-galaxy-s24-ultra.jpg" },
                        { name: "Burgundy", hex: "#991B1B", image: "/Burgundy-galaxy-s24-ultra.jpg" },
                        { name: "Titanium Yellow", hex: "#F59E0B", image: "/yellow-galaxy-s24-ultra.jpg" }
                    ],
                    storage: [
                        { size: "512GB", price: 1199 },
                        { size: "1TB", price: 1349 }
                    ]
                }
            },
            {
                id: 200004,
                name: "Galaxy S25 Ultra",
                brand: "Samsung",
                price: 1299,
                originalPrice: 1799,
                rating: 5.0,
                reviews: 15,
                images: ["/black-galaxy-s25-ultra.webp", "/Silverblue-galaxy-s25-ultra.jpg"],
                category: "Smartphones",
                description: "Absolute dominance. The Galaxy S25 Ultra redefines performance with a Hyper-Real Graphics Engine and instantaneous AI response. Its 6.9-inch display features an under-display camera for a truly uninterrupted view. The revolutionary 320MP AI camera system delivers hyper-realistic photos, powered by the Snapdragon 8 Gen 4.\n\n5G connectivity enabled for ultra-fast speeds with advanced satellite connectivity for emergency situations. Features include Zero-Bezel Design, 5500mAh Graphene Battery, Bio-Authentication, and the most advanced Galaxy AI yet. Runs on Android 15 - it's built for the next generation.",
                features: ["16GB RAM", "Android 15", "6.9\" Holographic AMOLED", "320MP AI Camera", "5G + Satellite", "Under-Display Camera", "Zero-Bezel Design", "5500mAh Graphene Battery", "Bio-Authentication", "Hyper-Real Graphics"],
                variants: {
                    colors: [
                        { name: "Ceramic Black", hex: "#1F2937", image: "/black-galaxy-s25-ultra.webp" },
                        { name: "Silverblue", hex: "#60A5FA", image: "/Silverblue-galaxy-s25-ultra.jpg" }
                    ],
                    storage: [
                        { size: "1TB", price: 1299 },
                        { size: "2TB", price: 1499 }
                    ]
                }
            },
            {
                id: 200005,
                name: "iPhone 15 Pro",
                brand: "Apple",
                price: 999,
                originalPrice: 1299,
                rating: 4.7,
                reviews: 830,
                images: ["/grey-iphone-15-pro.jpg", "/titanium-iphone-15pro.jpg", "/white-iphone-15pro.jpg"],
                category: "Smartphones",
                description: "(US Version) Forged in titanium. iPhone 15 Pro changed the game with aerospace-grade materials. It features a 6.1-inch Super Retina XDR display and the A17 Pro chip for next-level gaming performance with hardware ray tracing. The Action Button gives you quick access to your favorite features.\n\nFace ID is fully functional and working perfectly. The 48MP main camera captures incredible detail with the Photonic Engine for improved low-light performance. Log video recording enables professional color grading. With 5G connectivity, USB-C 3 for fast data transfer, and iOS 17, it's lighter, stronger, and more pro than ever before.",
                features: ["8GB RAM", "iOS 17", "6.1\" Super Retina XDR", "48MP Main Camera", "A17 Pro Chip", "Titanium Design", "Face ID Functional", "5G Capable", "Action Button", "Hardware Ray Tracing", "USB-C 3"],
                variants: {
                    colors: [
                        { name: "Natural Titanium", hex: "#6B7280", image: "/grey-iphone-15-pro.jpg" },
                        { name: "Titanium", hex: "#9CA3AF", image: "/titanium-iphone-15pro.jpg" },
                        { name: "White Titanium", hex: "#F3F4F6", image: "/white-iphone-15pro.jpg" }
                    ],
                    storage: [
                        { size: "128GB", price: 999 },
                        { size: "256GB", price: 1099 },
                        { size: "512GB", price: 1249 }
                    ]
                }
            },
            {
                id: 200006,
                name: "iPhone 16",
                brand: "Apple",
                price: 799,
                originalPrice: 999,
                rating: 4.8,
                reviews: 225,
                images: ["/pink-iphone-16.jpg", "/teal-iphone-16.jpg", "/ultramine-iphone-16.jpg", "/white-iphone-16.jpg"],
                category: "Smartphones",
                description: "(US Version) The power of Apple Intelligence. iPhone 16 features a vibrant new look with color-infused glass and the powerful A18 chip. It boasts a 6.1-inch Super Retina XDR display with Dynamic Island and the all-new Camera Control button for instant access to visual intelligence.\n\nFace ID is fully functional and working perfectly. The 48MP Fusion camera with 2x Telephoto captures stunning photos with Photographic Styles for personalized looks. Features include Action Button, Macro Photography, Spatial Audio recording, and 5G connectivity. With iOS 18, it's the perfect blend of style and functionality.",
                features: ["6GB RAM", "iOS 18", "6.1\" Super Retina XDR", "48MP Fusion Camera", "A18 Chip", "Face ID Functional", "5G Capable", "Camera Control", "Dynamic Island", "Action Button", "Macro Photography"],
                variants: {
                    colors: [
                        { name: "Pink", hex: "#EC4899", image: "/pink-iphone-16.jpg" },
                        { name: "Teal", hex: "#14B8A6", image: "/teal-iphone-16.jpg" },
                        { name: "Ultramarine", hex: "#3B82F6", image: "/ultramine-iphone-16.jpg" },
                        { name: "White", hex: "#FFFFFF", image: "/white-iphone-16.jpg" }
                    ],
                    storage: [
                        { size: "128GB", price: 799 },
                        { size: "256GB", price: 899 },
                        { size: "512GB", price: 1049 }
                    ]
                }
            },
            {
                id: 200007,
                name: "iPhone 16 Pro",
                brand: "Apple",
                price: 1099,
                originalPrice: 1399,
                rating: 4.8,
                reviews: 95,
                images: ["/black-iphone-16pro.jpg", "/desert-iphone-16-pro.jpg"],
                category: "Smartphones",
                description: "(US Version) Built for Apple Intelligence. The iPhone 16 Pro features the powerful A18 Pro chip and a stunning 6.3-inch Super Retina XDR display with ProMotion. The all-new Camera Control button gives you instant access to the 48MP Fusion camera with 5x Telephoto for incredible zoom.\n\nFace ID is fully functional and working perfectly. Capture stunning 4K 120fps video with Dolby Vision and take advantage of advanced video features for filmmakers. The titanium design is both elegant and durable. With 5G connectivity, USB-C 3.0 for fast transfers, and iOS 18, it's the ultimate pro tool.",
                features: ["8GB RAM", "iOS 18", "6.3\" Super Retina XDR", "48MP Fusion Camera", "A18 Pro Chip", "Titanium Design", "Face ID Functional", "5G Capable", "Camera Control", "4K 120fps Video", "USB-C 3.0"],
                variants: {
                    colors: [
                        { name: "Black Titanium", hex: "#1F2937", image: "/black-iphone-16pro.jpg" },
                        { name: "Desert Titanium", hex: "#D97706", image: "/desert-iphone-16-pro.jpg" }
                    ],
                    storage: [
                        { size: "256GB", price: 1099 },
                        { size: "512GB", price: 1249 },
                        { size: "1TB", price: 1449 }
                    ]
                }
            },
            {
                id: 200008,
                name: "iPhone 17 Pro",
                brand: "Apple",
                price: 1199,
                originalPrice: 1599,
                rating: 5.0,
                reviews: 69,
                images: ["/gold-iphone-17pro(back).jpeg", "/silver-iphone-17pro(back).jpeg", "/grey-iphone-17pro(front-and-back).jpeg", "/iphone-17pro(cover photo).jpeg", "/iphone-17pro(front).jpeg", "/gold-silver-black-iphone-17pro(back).jpeg"],
                category: "Smartphones",
                description: "(US Version) Beyond Pro. The iPhone 17 Pro sets a new benchmark for smartphone photography with its quad-pixel sensor and 16-core Neural Engine. It features a 6.4-inch ProMotion display with 3000 nits peak brightness and a seamless all-screen design with under-display Face ID for an uninterrupted view.\n\nFace ID is fully functional and working perfectly with the new under-display technology. The triple 48MP camera system with LiDAR scanner enables 8K video recording and professional-grade photography. Features include Tetraprism Telephoto, Wi-Fi 7, Crash Detection, Spatial Audio, and Thread Networking. With the groundbreaking A19 Bionic chip and iOS 19, it's a professional studio in your pocket.",
                features: ["12GB RAM", "iOS 19", "6.4\" ProMotion Display", "Triple 48MP Camera", "A19 Bionic Chip", "Face ID Functional", "5G Capable", "Under-Display Face ID", "8K Video Recording", "LiDAR Scanner", "Wi-Fi 7"],
                variants: {
                    colors: [
                        { name: "Gold", hex: "#F59E0B", image: "/gold-iphone-17pro(back).jpeg" },
                        { name: "Silver", hex: "#E5E7EB", image: "/silver-iphone-17pro(back).jpeg" },
                        { name: "Titanium Grey", hex: "#6B7280", image: "/grey-iphone-17pro(front-and-back).jpeg" },
                        { name: "Deep Purple", hex: "#7C3AED", image: "/iphone-17pro(cover photo).jpeg" },
                        { name: "Graphite", hex: "#374151", image: "/iphone-17pro(front).jpeg" },
                        { name: "Multi-Tone", hex: "#9CA3AF", image: "/gold-silver-black-iphone-17pro(back).jpeg" }
                    ],
                    storage: [
                        { size: "512GB", price: 1199 },
                        { size: "1TB", price: 1399 }
                    ]
                }
            },
            {
                id: 200009,
                name: "iPhone Air",
                brand: "Apple",
                price: 899,
                originalPrice: 1199,
                rating: 4.5,
                reviews: 73,
                images: ["/grey-iphone-air(back-and-front).jpeg", "/iphone-air(camera0.jpeg", "/iphone-air(cover-photo).jpeg"],
                category: "Smartphones",
                description: "(US Version) Impossibly thin. Powerfully capable. The iPhone Air redefines portability with its 5mm ultra-slim profile and featherweight body. It features a 6.1-inch OLED Retina display and the revolutionary M4 mobile chip for flagship performance in an incredibly thin design.\n\nFace ID is fully functional and working perfectly. The 48MP Fusion camera with Smart HDR 6 and Next-Gen Portraits delivers stunning photos in a streamlined, single-lens design. Night Mode and 4K 60fps video prove that less can truly be more. With 5G connectivity and iOS 19, it combines portability with power.",
                features: ["8GB RAM", "iOS 19", "6.1\" OLED Retina", "48MP Fusion Camera", "M4 Mobile Chip", "Face ID Functional", "5G Capable", "5mm Ultra-Slim", "Smart HDR 6", "Night Mode", "4K 60fps Video"],
                variants: {
                    colors: [
                        { name: "Space Grey", hex: "#4B5563", image: "/grey-iphone-air(back-and-front).jpeg" },
                        { name: "Silver", hex: "#E5E7EB", image: "/iphone-air(camera0.jpeg" },
                        { name: "Starlight", hex: "#F5F5DC", image: "/iphone-air(cover-photo).jpeg" }
                    ],
                    storage: [
                        { size: "256GB", price: 899 },
                        { size: "512GB", price: 1049 }
                    ]
                }
            },

            // Google Pixel Phones (keeping as-is)
            { id: 99931, name: "Google Pixel 9 Pro XL", brand: "Google", price: 1099, rating: 4.9, reviews: 45, images: ["/Grey-Google-Pixel-9-Pro-XL.jpg"], category: "Smartphones", description: "The most powerful Pixel yet. The Pixel 9 Pro XL features a massive 6.8-inch Super Actua display and the Google Tensor G4 chip. With 16GB of RAM, 512GB of storage, and Android 14, it delivers stunning photos and videos. Enjoy 7 years of Pixel Drops and Gemini Advanced integration.", features: ["16GB RAM", "Android 14", "512GB Storage", "6.8\" Super Actua Display", "50MP Triple Camera", "Obsidian", "Google Tensor G4", "Gemini Advanced"] },
            { id: 99932, name: "Google Pixel 9 Pro", brand: "Google", price: 999, rating: 4.8, reviews: 32, images: ["/White-Google-Pixel-9-Pro.jpg"], category: "Smartphones", description: "Pro-level performance in a perfect size. The Pixel 9 Pro features a 6.3-inch Super Actua display and the Google Tensor G4 chip. With 16GB of RAM, 256GB of storage, and Android 14, it feels as good as it looks. Capture amazing details with the 50MP triple camera system and edit with AI magic.", features: ["16GB RAM", "Android 14", "256GB Storage", "6.3\" Super Actua Display", "50MP Triple Camera", "Porcelain", "Google Tensor G4", "Fast Charging"] },
            { id: 99933, name: "Google Pixel 9", brand: "Google", price: 799, rating: 4.7, reviews: 28, images: ["/pink-google-pixel-9.jpg"], category: "Smartphones", description: "The advanced AI phone that's engineered for everyone. The Pixel 9 features a 6.3-inch Actua display and the Google Tensor G4 chip. With 12GB of RAM, 128GB of storage, and Android 14, it captures vibrant photos in any light. The satin finish and all-day battery make it a joy to use.", features: ["12GB RAM", "Android 14", "128GB Storage", "6.3\" Actua Display", "50MP Dual Camera", "Peony", "Google Tensor G4", "Gemini Nano"] },
            { id: 99934, name: "Google Pixel 9 Pro Fold (Black)", brand: "Google", price: 1745, rating: 4.9, reviews: 15, images: ["/Black-Google-Pixel-9-Pro-Fold.jpg"], category: "Smartphones", description: "The thinnest foldable from Google. The Pixel 9 Pro Fold features an 8-inch Super Actua Flex display and a 6.3-inch cover display. Powered by the Tensor G4, 16GB of RAM, and Android 14, it offers seamless multitasking. With 512GB of storage, it's the ultimate productivity device.", features: ["16GB RAM", "Android 14", "512GB Storage", "8\" Super Actua Flex", "48MP Triple Camera", "Obsidian", "Split Screen", "Satin Metal Hinge"] },
            { id: 99935, name: "Google Pixel 9 Pro Fold (White)", brand: "Google", price: 1820, rating: 4.8, reviews: 12, images: ["/White-Google-Pixel-9-Pro-Fold.jpg"], category: "Smartphones", description: "Unfold a new world of possibilities. The Pixel 9 Pro Fold in Porcelain features a stunning 8-inch Super Actua Flex display. With 16GB of RAM, 512GB of storage, and Android 14, it handles the most demanding tasks with ease. The satin metal hinge ensures durability and a smooth folding experience.", features: ["16GB RAM", "Android 14", "512GB Storage", "8\" Super Actua Flex", "48MP Triple Camera", "Porcelain", "Google Tensor G4", "24+ Hours Battery"] },
            { id: 99936, name: "Google Pixel 10 (Blue)", brand: "Google", price: 915, rating: 5.0, reviews: 5, images: ["/Blue-Google-Pixel-10.jpg"], category: "Smartphones", description: "Future-ready performance. The Pixel 10 features the next-gen Google Tensor G5 chip and a 6.4-inch Actua display. With 16GB of RAM, 256GB of storage, and Android 15, it captures life like never before. The stunning Blue finish and eco-friendly materials make it a sustainable choice.", features: ["16GB RAM", "Android 15", "256GB Storage", "6.4\" Actua Display", "64MP AI Camera", "Bay Blue", "Google Tensor G5", "Next-Gen Assistant"] },
            { id: 99937, name: "Google Pixel 10 (Grey)", brand: "Google", price: 885, rating: 4.9, reviews: 8, images: ["/Grey-Google-Pixel-10.jpg"], category: "Smartphones", description: "Sleek, powerful, and intelligent. The Pixel 10 in Grey redefines the smartphone experience with the Google Tensor G5 chip. It features a 6.4-inch Actua display, 16GB of RAM, and 256GB of storage. With Android 15 and advanced AI features, it's the smartest Pixel yet.", features: ["16GB RAM", "Android 15", "256GB Storage", "6.4\" Actua Display", "64MP AI Camera", "Charcoal", "Google Tensor G5", "Eco-Friendly"] },
            { id: 99938, name: "Google Pixel 9 Pro (Pink)", brand: "Google", price: 1025, rating: 4.8, reviews: 20, images: ["/Pink-Google-Pixel-9-Pro.jpg"], category: "Smartphones", description: "Pro-level camera and performance in a stunning Rose Quartz finish. The Pixel 9 Pro features a 6.3-inch Super Actua display and the Google Tensor G4 chip. With 16GB of RAM, 256GB of storage, and Android 14, it puts the power of AI in your pocket.", features: ["16GB RAM", "Android 14", "256GB Storage", "6.3\" Super Actua Display", "50MP Triple Camera", "Rose Quartz", "Gemini Advanced", "Google Tensor G4"] },
            { id: 99939, name: "Google Pixel 9 Pro (Grey)", brand: "Google", price: 985, rating: 4.9, reviews: 25, images: ["/grey-Google-Pixel-9-Pro.jpg"], category: "Smartphones", description: "The ultimate Google phone. The Pixel 9 Pro in Hazel features a 6.3-inch Super Actua display and the Google Tensor G4 chip. With 16GB of RAM, 256GB of storage, and Android 14, it delivers exceptional results. Enjoy fast charging and a polished finish.", features: ["16GB RAM", "Android 14", "256GB Storage", "6.3\" Super Actua Display", "50MP Triple Camera", "Hazel", "Google Tensor G4", "Fast Charging"] },

            // Renewed Phones with Variants
            {
                id: 100001,
                name: "iPhone 12 (Renewed)",
                brand: "Apple",
                price: 449,
                originalPrice: 699,
                rating: 4.6,
                reviews: 3542,
                images: ["/Black Iphone 12(Renewed).jpg", "/Green Iphone 12(Renewed).jpg", "/Purple iphone 12(Renewed).jpg", "/Red Iphone 12(Renewed).jpg", "/White Iphone 12(Renewed).jpg", "/Pacific Blue Iphone 12  pro(Renewed).jpg"],
                badge: "Fully Unlocked",
                category: "Smartphones",
                description: "(US Version) Experience the iPhone 12 in pristine renewed condition. This fully unlocked device works with any carrier worldwide. The stunning 6.1-inch Super Retina XDR display brings your content to life with incredible color accuracy and HDR support. Powered by the A14 Bionic chip, it delivers exceptional performance for all your apps and games.\n\nFace ID is fully functional and working perfectly, providing secure and convenient authentication. The dual 12MP camera system captures stunning photos in any light with Night mode, Deep Fusion, and Smart HDR 3. Record beautiful 4K Dolby Vision HDR video with cinematic stabilization.\n\nThis renewed iPhone 12 has been professionally inspected, tested, and certified to work and look like new. It comes with a minimum 85% battery capacity guarantee. Enjoy 5G connectivity for lightning-fast downloads and high-quality streaming. The Ceramic Shield front cover offers 4x better drop performance.",
                features: ["Fully Unlocked - Works with Any Carrier", "Face ID Fully Functional", "6.1\" Super Retina XDR Display", "A14 Bionic Chip", "Dual 12MP Camera System", "5G Capable", "Night Mode", "MagSafe Compatible", "IP68 Water Resistant", "Ceramic Shield"],
                variants: {
                    colors: [
                        { name: "Black", hex: "#000000", image: "/Black Iphone 12(Renewed).jpg" },
                        { name: "Blue", hex: "#1E3A8A", image: "/Pacific Blue Iphone 12  pro(Renewed).jpg" },
                        { name: "Green", hex: "#059669", image: "/Green Iphone 12(Renewed).jpg" },
                        { name: "Purple", hex: "#7C3AED", image: "/Purple iphone 12(Renewed).jpg" },
                        { name: "Red", hex: "#DC2626", image: "/Red Iphone 12(Renewed).jpg" },
                        { name: "White", hex: "#FFFFFF", image: "/White Iphone 12(Renewed).jpg" }
                    ],
                    storage: [
                        { size: "64GB", price: 449 },
                        { size: "128GB", price: 489 },
                        { size: "256GB", price: 549 }
                    ]
                }
            },
            {
                id: 100002,
                name: "iPhone 13 Pro Max (Renewed)",
                brand: "Apple",
                price: 549,
                originalPrice: 799,
                rating: 4.7,
                reviews: 2891,
                images: ["/Graphite Iphone 13 pro max(Renewed).jpg", "/Alpine Green Iphone 13 pro max(Renewed).jpg", "/Sierra Blue  Iphone 13 pro max(Renewed).jpg", "/White Iphone 13 pro max(Renewed).jpg"],
                badge: "Fully Unlocked",
                category: "Smartphones",
                description: "(US Version) The iPhone 13 Pro Max in excellent renewed condition offers incredible value without compromise. Fully unlocked and ready to use with any carrier globally. The massive 6.7-inch Super Retina XDR display with ProMotion technology delivers stunning visuals with adaptive refresh rates up to 120Hz, making everything look more vivid and lifelike.\n\nFace ID is fully functional and working perfectly for secure authentication and Apple Pay. The pro camera system features a larger sensor for 47% more light capture, delivering stunning photos even in low light. The telephoto, wide, and ultra-wide cameras work together with advanced computational photography. Cinematic mode adds shallow depth of field and automatically shifts focus in your videos.\n\nPowered by the A15 Bionic chip with 5-core GPU, this phone handles demanding tasks with ease. This professionally renewed device has been thoroughly tested and certified. Battery health guaranteed at minimum 85%. Enjoy all-day battery life, 5G connectivity, and the durability of Ceramic Shield. Perfect condition, exceptional price.",
                features: ["Fully Unlocked - Works with Any Carrier", "Face ID Fully Functional", "6.7\" Super Retina XDR Display", "A15 Bionic Chip", "Pro Camera System", "ProMotion 120Hz", "5G Capable", "All-Day Battery Life", "Ceramic Shield", "IP68 Water Resistant"],
                variants: {
                    colors: [
                        { name: "Graphite", hex: "#1a1a1a", image: "/Graphite Iphone 13 pro max(Renewed).jpg" },
                        { name: "Silver", hex: "#F5F5DC", image: "/White Iphone 13 pro max(Renewed).jpg" },
                        { name: "Sierra Blue", hex: "#2563EB", image: "/Sierra Blue  Iphone 13 pro max(Renewed).jpg" },
                        { name: "Alpine Green", hex: "#059669", image: "/Alpine Green Iphone 13 pro max(Renewed).jpg" }
                    ],
                    storage: [
                        { size: "128GB", price: 549 },
                        { size: "256GB", price: 619 },
                        { size: "512GB", price: 729 }
                    ]
                }
            },
            {
                id: 100003,
                name: "iPhone 14 (Renewed)",
                brand: "Apple",
                price: 649,
                originalPrice: 899,
                rating: 4.8,
                reviews: 1967,
                images: ["/black-iphone-16pro.jpg"],
                badge: "Fully Unlocked",
                category: "Smartphones",
                description: "(US Version) Discover the iPhone 14 in pristine renewed condition at an unbeatable price. This fully unlocked device is compatible with all major carriers worldwide, giving you the freedom to choose your plan. The gorgeous 6.1-inch Super Retina XDR display features OLED technology for true blacks and brilliant colors.\n\nFace ID is fully functional and working perfectly, providing fast and secure authentication every time. The revolutionary dual-camera system includes a 12MP Main camera with a larger sensor and faster aperture, plus an Ultra Wide camera. Photonic Engine delivers up to 2.5x better low-light performance. Action mode provides incredibly smooth video even when you're on the move.\n\nThe A15 Bionic chip with 5-core GPU powers everything smoothly. This professionally renewed iPhone 14 has passed rigorous quality checks and comes with minimum 85% battery health. Features include Crash Detection for emergency help, 5G connectivity for superfast speeds, and all-day battery life. Ceramic Shield front is tougher than any smartphone glass.",
                features: ["Fully Unlocked - Works with Any Carrier", "Face ID Fully Functional", "6.1\" Super Retina XDR Display", "A15 Bionic 5-Core GPU", "12MP Dual Camera System", "Photonic Engine", "Action Mode Video", "5G Capable", "Crash Detection", "All-Day Battery", "Ceramic Shield"],
                variants: {
                    colors: [
                        { name: "Midnight", hex: "#1a1a1a", image: "/black-iphone-16pro.jpg" },
                        { name: "Purple", hex: "#9333EA", image: "/black-iphone-16pro.jpg" },
                        { name: "Starlight", hex: "#F5F5DC", image: "/white-iphone-16.jpg" },
                        { name: "Blue", hex: "#3B82F6", image: "/teal-iphone-16.jpg" },
                        { name: "Red", hex: "#DC2626", image: "/pink-iphone-16.jpg" }
                    ],
                    storage: [
                        { size: "128GB", price: 649 },
                        { size: "256GB", price: 729 },
                        { size: "512GB", price: 849 }
                    ]
                }
            },
            {
                id: 100004,
                name: "Samsung Galaxy S21 5G (Renewed)",
                brand: "Samsung",
                price: 399,
                originalPrice: 799,
                rating: 4.5,
                reviews: 2156,
                images: ["/Phantom Black S21 Ultra(Renewed).jpg", "/Phantom Pink Samsung  S21(Renewed).jpg", "/Phantom Violet Samsung S21 (Renewed).jpg"],
                badge: "Fully Unlocked",
                category: "Smartphones",
                description: "The Samsung Galaxy S21 5G in excellent renewed condition delivers flagship performance at an incredible value. This fully unlocked device works seamlessly with any carrier worldwide, giving you complete flexibility. The stunning 6.2-inch Dynamic AMOLED 2X display with 120Hz refresh rate makes scrolling buttery smooth and content incredibly vivid.\n\n5G connectivity enabled for ultra-fast speeds - download movies in seconds, stream in highest quality, and enjoy lag-free gaming. The pro-grade triple camera system features a 64MP telephoto lens with 3x hybrid optic zoom and 30x Space Zoom. Capture stunning 8K video and pull high-resolution photos from your footage.\n\nPowered by the Snapdragon 888 processor with 8GB RAM, this phone handles multitasking effortlessly. This professionally renewed Galaxy S21 has been thoroughly inspected and certified to work like new, with minimum 85% battery health guaranteed. Features include all-day intelligent battery, IP68 water resistance, wireless charging, and Samsung Knox security. The contour-cut camera design is both beautiful and functional.",
                features: ["Fully Unlocked - Works with Any Carrier", "5G Ultra-Fast Connectivity", "6.2\" 120Hz AMOLED Display", "Snapdragon 888 Processor", "64MP Triple Camera", "8K Video Recording", "30x Space Zoom", "8GB RAM", "All-Day Battery", "IP68 Water Resistant", "Wireless Charging"],
                variants: {
                    colors: [
                        { name: "Phantom Black", hex: "#1F2937", image: "/Phantom Black S21 Ultra(Renewed).jpg" },
                        { name: "Phantom Violet", hex: "#8B5CF6", image: "/Phantom Violet Samsung S21 (Renewed).jpg" },
                        { name: "Phantom Pink", hex: "#F472B6", image: "/Phantom Pink Samsung  S21(Renewed).jpg" }
                    ],
                    storage: [
                        { size: "128GB", price: 399 },
                        { size: "256GB", price: 449 }
                    ]
                }
            },
            {
                id: 100005,
                name: "Samsung Galaxy S22 5G (Renewed)",
                brand: "Samsung",
                price: 499,
                originalPrice: 899,
                rating: 4.6,
                reviews: 1834,
                images: ["/black-galaxy-s22-ultra.jpg", "/white-galaxy-s22-ultra.jpg", "/red-galaxy-s22-ultra.jpg", "/Burgundy-galaxy-s22-ultra.jpg"],
                badge: "Fully Unlocked",
                category: "Smartphones",
                description: "Experience the Samsung Galaxy S22 5G in pristine renewed condition. This fully unlocked flagship works with all major carriers worldwide, offering you complete freedom. The brilliant 6.1-inch Dynamic AMOLED 2X display with adaptive 120Hz refresh rate delivers incredibly smooth visuals and vibrant colors with Vision Booster technology for perfect outdoor visibility.\n\n5G connectivity enabled for ultra-fast speeds - enjoy seamless streaming, instant downloads, and responsive cloud gaming. The advanced triple camera system features a 50MP main sensor with improved low-light performance. Nightography captures stunning photos and videos even in near darkness. Record smooth, stable 8K video and zoom up to 30x with enhanced clarity.\n\nThe powerful Snapdragon 8 Gen 1 processor with 8GB RAM ensures flagship performance. This professionally renewed Galaxy S22 has passed comprehensive quality testing and comes with minimum 85% battery health. Features include fast wireless charging, IP68 water resistance, Gorilla Glass Victus+ protection, and Samsung Knox security. The sleek, premium design fits perfectly in your hand and pocket.",
                features: ["Fully Unlocked - Works with Any Carrier", "5G Ultra-Fast Connectivity", "6.1\" 120Hz AMOLED Display", "Snapdragon 8 Gen 1", "50MP Triple Camera", "Nightography", "8K Video Recording", "8GB RAM", "Vision Booster", "IP68 Water Resistant", "Gorilla Glass Victus+"],
                variants: {
                    colors: [
                        { name: "Phantom Black", hex: "#1F2937", image: "/black-galaxy-s22-ultra.jpg" },
                        { name: "Phantom White", hex: "#F9FAFB", image: "/white-galaxy-s22-ultra.jpg" },
                        { name: "Burgundy", hex: "#991B1B", image: "/Burgundy-galaxy-s22-ultra.jpg" },
                        { name: "Red", hex: "#DC2626", image: "/red-galaxy-s22-ultra.jpg" }
                    ],
                    storage: [
                        { size: "128GB", price: 499 },
                        { size: "256GB", price: 569 },
                        { size: "512GB", price: 679 }
                    ]
                }
            },
            {
                id: 100006,
                name: "iPhone 11 (Renewed)",
                brand: "Apple",
                price: 299,
                originalPrice: 599,
                rating: 4.4,
                reviews: 4521,
                images: ["/Black iphone 11(Renewed).jpg", "/Green iphone 11(Renewed).jpg", "/Purple Iphone 11(Renewed).jpg", "/Red Iphone 11(Renewed).jpg", "/white Iphone 11(Renewed).jpg", "/Yellow Iphone 11(Renewed).jpg"],
                badge: "Fully Unlocked",
                category: "Smartphones",
                description: "(US Version) The iPhone 11 in excellent renewed condition delivers incredible value and performance. This fully unlocked device works seamlessly with any carrier worldwide, giving you complete freedom to choose your plan. The stunning 6.1-inch Liquid Retina LCD display brings your photos and videos to life with true-to-life colors.\n\nFace ID is fully functional and working perfectly for secure authentication and Apple Pay. The dual-camera system features Ultra Wide and Wide cameras for beautiful photos and 4K video. Night mode captures stunning low-light photos automatically. Take Portrait mode photos with advanced bokeh and Depth Control.\n\nPowered by the A13 Bionic chip, this phone handles everything from gaming to photo editing with ease. This professionally renewed iPhone 11 has been thoroughly tested and certified to work like new, with minimum 85% battery health guaranteed. Features include all-day battery life, wireless charging, IP68 water resistance (up to 2 meters for 30 minutes), and spatial audio. An incredible iPhone at an unbeatable price.",
                features: ["Fully Unlocked - Works with Any Carrier", "Face ID Fully Functional", "6.1\" Liquid Retina Display", "A13 Bionic Chip", "Dual Camera System", "Night Mode", "4K Video Recording", "All-Day Battery Life", "Wireless Charging", "IP68 Water Resistant"],
                variants: {
                    colors: [
                        { name: "Black", hex: "#000000", image: "/Black iphone 11(Renewed).jpg" },
                        { name: "Green", hex: "#059669", image: "/Green iphone 11(Renewed).jpg" },
                        { name: "Purple", hex: "#9333EA", image: "/Purple Iphone 11(Renewed).jpg" },
                        { name: "Red", hex: "#DC2626", image: "/Red Iphone 11(Renewed).jpg" },
                        { name: "White", hex: "#FFFFFF", image: "/white Iphone 11(Renewed).jpg" },
                        { name: "Yellow", hex: "#EAB308", image: "/Yellow Iphone 11(Renewed).jpg" }
                    ],
                    storage: [
                        { size: "64GB", price: 299 },
                        { size: "128GB", price: 339 },
                        { size: "256GB", price: 399 }
                    ]
                }
            },
            {
                id: 100007,
                name: "iPhone 11 Pro Max (Renewed)",
                brand: "Apple",
                price: 449,
                originalPrice: 1099,
                rating: 4.7,
                reviews: 3156,
                images: ["/Space Gray iPhone 11 Pro Max.jpg", "/Gold iPhone 11 Pro Max,.jpg", "/Silver iPhone 11 Pro Max.jpg", "/Midnight Green Iphone 11 pro max(Renewed).jpg"],
                badge: "Fully Unlocked",
                category: "Smartphones",
                description: "(US Version) The iPhone 11 Pro Max in pristine renewed condition represents the pinnacle of iPhone design and performance from its generation. This fully unlocked flagship works with all major carriers worldwide. The massive 6.5-inch Super Retina XDR OLED display is the brightest iPhone display ever, perfect for HDR content and outdoor use.\n\nFace ID is fully functional and working perfectly, providing the most secure facial authentication. The pro camera system features three 12MP cameras (Ultra Wide, Wide, Telephoto) for professional-quality photos and videos. Night mode works on all cameras for stunning low-light photography. Deep Fusion uses advanced machine learning for incredible detail. Record 4K video at 60fps with extended dynamic range.\n\nPowered by the A13 Bionic chip with third-generation Neural Engine, it delivers exceptional performance and efficiency. This professionally renewed iPhone 11 Pro Max has passed rigorous quality checks and comes with minimum 85% battery health. Features include the longest battery life ever in an iPhone, fast charging, wireless charging, IP68 water resistance (up to 4 meters for 30 minutes), and spatial audio. The textured matte glass back and stainless steel band feel premium in hand.",
                features: ["Fully Unlocked - Works with Any Carrier", "Face ID Fully Functional", "6.5\" Super Retina XDR Display", "A13 Bionic Chip", "Pro Camera System (3 Cameras)", "Night Mode on All Cameras", "Deep Fusion", "4K 60fps Video", "All-Day Battery Life", "IP68 Water Resistant"],
                variants: {
                    colors: [
                        { name: "Space Gray", hex: "#4B5563", image: "/Space Gray iPhone 11 Pro Max.jpg" },
                        { name: "Gold", hex: "#F59E0B", image: "/Gold iPhone 11 Pro Max,.jpg" },
                        { name: "Silver", hex: "#E5E7EB", image: "/Silver iPhone 11 Pro Max.jpg" },
                        { name: "Midnight Green", hex: "#065F46", image: "/Midnight Green Iphone 11 pro max(Renewed).jpg" }
                    ],
                    storage: [
                        { size: "64GB", price: 449 },
                        { size: "256GB", price: 519 },
                        { size: "512GB", price: 619 }
                    ]
                }
            },
            {
                id: 100008,
                name: "iPhone XR (Renewed)",
                brand: "Apple",
                price: 249,
                originalPrice: 499,
                rating: 4.3,
                reviews: 5892,
                images: ["/Red Iphone XR(Renewed).jpg", "/Silver Iphone XR(Renewed).jpg"],
                badge: "Fully Unlocked",
                category: "Smartphones",
                description: "(US Version) The iPhone XR in excellent renewed condition offers exceptional value for those seeking a reliable, fully-featured iPhone. This fully unlocked device works with all major carriers worldwide, giving you the freedom to choose your plan. The beautiful 6.1-inch Liquid Retina LCD display is the most advanced LCD in a smartphone, with industry-leading color accuracy.\n\nFace ID is fully functional and working perfectly for secure authentication and Apple Pay. The advanced 12MP camera system features Portrait mode with advanced bokeh and Depth Control, Smart HDR for incredible detail, and 4K video recording at up to 60fps. The camera delivers stunning photos in any lighting condition.\n\nPowered by the A12 Bionic chip with next-generation Neural Engine, it handles demanding apps and games with ease. This professionally renewed iPhone XR has been thoroughly inspected, tested, and certified to work like new, with minimum 85% battery health guaranteed. Features include all-day battery life, wireless charging, IP67 water resistance (up to 1 meter for 30 minutes), and dual SIM with eSIM. An incredible entry point to the iPhone ecosystem.",
                features: ["Fully Unlocked - Works with Any Carrier", "Face ID Fully Functional", "6.1\" Liquid Retina Display", "A12 Bionic Chip", "12MP Camera System", "Portrait Mode", "Smart HDR", "4K Video Recording", "All-Day Battery Life", "IP67 Water Resistant"],
                variants: {
                    colors: [
                        { name: "Red", hex: "#DC2626", image: "/Red Iphone XR(Renewed).jpg" },
                        { name: "Silver", hex: "#E5E7EB", image: "/Silver Iphone XR(Renewed).jpg" }
                    ],
                    storage: [
                        { size: "64GB", price: 249 },
                        { size: "128GB", price: 279 },
                        { size: "256GB", price: 329 }
                    ]
                }
            },
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

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({ products, addProduct, deleteProduct, loading }),
        [products, loading]
    );

    return (
        <ProductContext.Provider value={contextValue}>
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
