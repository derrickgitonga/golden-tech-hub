import { createRoot } from "react-dom/client";
import { StrictMode, useState, useEffect } from "react";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { preloadCriticalImages } from "./utils/imagePreloader";

// Loading Screen Component
const LoadingScreen = ({ progress }: { progress: number }) => (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading premium experience...</p>
        <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-gold to-gold/70 transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
    </div>
);

// Main App Wrapper with Preloading
const AppWrapper = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const loadImages = async () => {
            try {
                await preloadCriticalImages((loaded, total) => {
                    const percentage = (loaded / total) * 100;
                    setProgress(percentage);
                });

                // Small delay for smooth transition
                setTimeout(() => {
                    setIsLoading(false);
                }, 300);
            } catch (error) {
                console.warn('Image preloading encountered issues:', error);
                // Still render app even if preloading fails
                setIsLoading(false);
            }
        };

        loadImages();
    }, []);

    if (isLoading) {
        return <LoadingScreen progress={progress} />;
    }

    return (
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppWrapper />
    </StrictMode>
);
