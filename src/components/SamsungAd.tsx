import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

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
            <div ref={videoRef} className="w-full h-full">
                {isVisible && (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        poster="/Samsung-ad-poster.jpg"
                        className="w-full h-full object-cover"
                    >
                        <source src="/Samsung-ad.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
                {!isVisible && (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-300 animate-pulse" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SamsungAd;
