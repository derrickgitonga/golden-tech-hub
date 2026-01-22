/**
 * Image Preloader Utility
 * Preloads images before rendering to eliminate latency
 */

interface PreloadOptions {
    onProgress?: (loaded: number, total: number) => void;
    timeout?: number;
}

interface PreloadResult {
    success: boolean;
    loaded: number;
    failed: number;
    errors: string[];
}

// Cache to track preloaded images
const preloadedImages = new Set<string>();

/**
 * Preload a single image
 */
export const preloadImage = (src: string, timeout = 10000): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Check if already preloaded
        if (preloadedImages.has(src)) {
            resolve(src);
            return;
        }

        const img = new Image();
        let timeoutId: number;

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            img.onload = null;
            img.onerror = null;
        };

        // Set timeout
        if (timeout > 0) {
            timeoutId = window.setTimeout(() => {
                cleanup();
                reject(new Error(`Image load timeout: ${src}`));
            }, timeout);
        }

        img.onload = () => {
            cleanup();
            preloadedImages.add(src);
            resolve(src);
        };

        img.onerror = () => {
            cleanup();
            reject(new Error(`Failed to load image: ${src}`));
        };

        // Start loading
        img.src = src;
    });
};

/**
 * Preload multiple images with progress tracking
 */
export const preloadImages = async (
    images: string[],
    options: PreloadOptions = {}
): Promise<PreloadResult> => {
    const { onProgress, timeout = 10000 } = options;
    const total = images.length;
    let loaded = 0;
    let failed = 0;
    const errors: string[] = [];

    // Report initial progress
    onProgress?.(0, total);

    // Load all images in parallel
    await Promise.allSettled(
        images.map(async (src) => {
            try {
                await preloadImage(src, timeout);
                loaded++;
                onProgress?.(loaded + failed, total);
                return { success: true, src };
            } catch (error) {
                failed++;
                const errorMsg = error instanceof Error ? error.message : String(error);
                errors.push(errorMsg);
                onProgress?.(loaded + failed, total);
                return { success: false, src, error: errorMsg };
            }
        })
    );

    return {
        success: failed === 0,
        loaded,
        failed,
        errors,
    };
};

/**
 * Check if an image is already preloaded
 */
export const isImagePreloaded = (src: string): boolean => {
    return preloadedImages.has(src);
};

/**
 * Clear preload cache
 */
export const clearPreloadCache = (): void => {
    preloadedImages.clear();
};

/**
 * Get critical images that should be preloaded
 * These are images that appear above the fold
 */
export const getCriticalImages = (): string[] => {
    const criticalImages: string[] = [];

    // Common optimized image sizes for hero/trending
    const heroProducts = [
        'black-iphone-16pro',
        'desert-iphone-16-pro',
        'grey-iphone-15-pro',
        'black-galaxy-s24-ultra',
        'Burgundy-galaxy-s24-ultra',
        'Black-Google-Pixel-9-Pro-Fold',
        'Pink-Google-Pixel-9-Pro',
        'white-iphone-16',
    ];

    // Add optimized versions
    heroProducts.forEach((productName) => {
        // LQIP for instant display
        criticalImages.push(`/optimized/${productName}-lqip.webp`);
        // Thumbnail for mobile
        criticalImages.push(`/optimized/${productName}-thumb.webp`);
        // Small for tablets
        criticalImages.push(`/optimized/${productName}-small.webp`);
    });

    return criticalImages;
};

/**
 * Preload critical images for instant page display
 */
export const preloadCriticalImages = async (
    onProgress?: (loaded: number, total: number) => void
): Promise<PreloadResult> => {
    const criticalImages = getCriticalImages();
    return preloadImages(criticalImages, { onProgress, timeout: 15000 });
};
