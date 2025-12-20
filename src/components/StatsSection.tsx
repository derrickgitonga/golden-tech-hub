const StatsSection = () => {
    return (
        <section className="py-12 bg-background relative overflow-hidden">
            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)`,
                    backgroundSize: "100px 100px",
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                {/* Scroll indicator - renamed to Explore since it's now at the bottom, maybe just keep the text "Explore" or change it? 
             The user asked to "move this part", implying the visual element. 
             However, a "scroll down" indicator at the bottom doesn't make much sense unless it points to the footer or just sits there as a design element.
             I will keep it as requested but maybe remove the "animate-bounce" if it's static, or keep it if they want the exact same look.
             The user said "put the explore and details below it on the lowest level".
             I will replicate the structure.
         */}

                <div className="flex flex-col items-center gap-2 mb-12 opacity-0 animate-fade-in">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Explore</span>
                    <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
                        <div className="w-1 h-2 bg-gold rounded-full animate-bounce" />
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-8 md:gap-16 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <div className="text-center">
                        <div className="font-display text-3xl md:text-4xl font-semibold text-gradient-gold">2M+</div>
                        <div className="text-sm text-muted-foreground mt-1">Products</div>
                    </div>
                    <div className="w-px h-12 bg-border" />
                    <div className="text-center">
                        <div className="font-display text-3xl md:text-4xl font-semibold text-gradient-gold">99.9%</div>
                        <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
                    </div>
                    <div className="w-px h-12 bg-border" />
                    <div className="text-center">
                        <div className="font-display text-3xl md:text-4xl font-semibold text-gradient-gold">50K+</div>
                        <div className="text-sm text-muted-foreground mt-1">Reviews</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
