import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: string;
    alt: string;
    sizes?: string;
    priority?: boolean;
    objectFit?: 'contain' | 'cover';
}

const OptimizedImage = ({
    src,
    alt,
    className = '',
    sizes = '100vw',
    priority = false,
    objectFit = 'cover',
    ...props
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Get image name without extension
    const getImageName = (path: string) => {
        const filename = path.split('/').pop() || '';
        return filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    };

    // Generate srcset for responsive images
    const generateSrcSet = (imagePath: string) => {
        const imageName = getImageName(imagePath);
        const isOptimized = imagePath.includes('/optimized/');

        if (isOptimized) {
            return `
        /optimized/${imageName}-thumb.webp 320w,
        /optimized/${imageName}-small.webp 640w,
        /optimized/${imageName}-medium.webp 1024w,
        /optimized/${imageName}-large.webp 1920w
      `.trim();
        }

        // For non-optimized images, try to use optimized versions
        return `
      /optimized/${imageName}-thumb.webp 320w,
      /optimized/${imageName}-small.webp 640w,
      /optimized/${imageName}-medium.webp 1024w,
      /optimized/${imageName}-large.webp 1920w
    `.trim();
    };

    // Get LQIP (Low Quality Image Placeholder) path
    const getLqipPath = (imagePath: string) => {
        const imageName = getImageName(imagePath);
        return `/optimized/${imageName}-lqip.webp`;
    };

    // Get optimized WebP path
    const getOptimizedPath = (imagePath: string) => {
        const imageName = getImageName(imagePath);
        return `/optimized/${imageName}.webp`;
    };

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority || !imgRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before entering viewport
            }
        );

        observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, [priority]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true); // Still mark as loaded to remove blur
    };

    const lqipSrc = getLqipPath(src);
    const optimizedSrc = getOptimizedPath(src);
    const srcSet = generateSrcSet(src);

    return (
        <div className="relative overflow-hidden" ref={imgRef}>
            {/* LQIP Blur Placeholder */}
            {!isLoaded && isInView && (
                <img
                    src={lqipSrc}
                    alt=""
                    aria-hidden="true"
                    className={`absolute inset-0 w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'
                        } blur-xl scale-110 transition-opacity duration-300`}
                    onError={() => { }} // Silently fail if LQIP doesn't exist
                />
            )}

            {/* Loading skeleton */}
            {!isLoaded && !isInView && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            )}

            {/* Main Image */}
            {isInView && (
                <img
                    src={hasError ? src : optimizedSrc}
                    srcSet={hasError ? undefined : srcSet}
                    sizes={sizes}
                    alt={alt}
                    className={`w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'
                        } transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        } ${className}`}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    {...props}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
