import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Construction } from "lucide-react";

const ComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6">
                    <Construction className="w-10 h-10 text-gold" />
                </div>
                <h1 className="text-4xl font-display text-foreground mb-4">Coming Soon</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    We're working hard to bring you this page. Stay tuned for updates!
                </p>
                <Button onClick={() => navigate("/")} variant="gold" size="lg">
                    Return Home
                </Button>
            </main>
            <Footer />
        </div>
    );
};

export default ComingSoon;
