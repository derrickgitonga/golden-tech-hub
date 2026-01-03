import { cn } from "@/lib/utils";

interface SamsungAdProps {
    className?: string;
}

const SamsungAd = ({ className }: SamsungAdProps) => {
    return (
        <div className={cn(
            "relative w-full max-w-xs mx-auto xl:w-64 h-[400px] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-center group hover:border-gold/30 transition-all duration-500 animate-fade-in z-20",
            className
        )}>
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
        </div>
    );
};

export default SamsungAd;
