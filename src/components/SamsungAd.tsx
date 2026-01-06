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
            "relative w-full max-w-xs mx-auto xl:w-64 h-[400px] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-center group hover:border-gold/30 transition-all duration-500 animate-fade-in z-20",
            className
        )}>
            <div ref={videoRef} className="w-full h-full">
                {isVisible && (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        className="w-full h-full object-cover"
                    >
                        <source src="/Samsung-ad.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
        </div>
    );
};

export default SamsungAd;
