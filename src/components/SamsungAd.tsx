import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import OptimizedVideo from "./OptimizedVideo";

interface SamsungAdProps {
    className?: string;
}

const SamsungAd = ({ className }: SamsungAdProps) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className={cn(
            "relative w-full max-w-xs mx-auto xl:w-64 h-[400px] bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center group hover:border-gold/30 hover:shadow-lg transition-all duration-500 animate-fade-in z-20",
            className
        )}>
            <div className="w-full h-full">
                <OptimizedVideo
                    src="/Samsung-ad.mp4"
                    poster="/Samsung-ad-poster.jpg"
                    className="w-full h-full"
                />
            </div>
        </div>
    );
};

export default SamsungAd;
