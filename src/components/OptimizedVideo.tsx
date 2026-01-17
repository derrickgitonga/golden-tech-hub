import { useState, useEffect, useRef } from 'react';

interface OptimizedVideoProps {
    src: string;
    className?: string;
    poster?: string;
}

const OptimizedVideo = ({ src, className = '', poster }: OptimizedVideoProps) => {
    const [isInView, setIsInView] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px', threshold: 0.01 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isInView && videoRef.current) {
            videoRef.current.play().catch(() => {
                // Autoplay blocked, will play on user interaction
            });
        }
    }, [isInView]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
            {/* Loading placeholder */}
            <div
                className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                </div>
            </div>

            {isInView && (
                <video
                    ref={videoRef}
                    src={src}
                    poster={poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    onLoadedData={() => setIsLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
            )}
        </div>
    );
};

export default OptimizedVideo;
