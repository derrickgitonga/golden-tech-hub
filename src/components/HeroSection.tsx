import { Search, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };



  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/3 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold/5 rounded-full" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />



      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-muted-foreground">AI-Powered Discovery</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Premium Tech,
            <br />
            <span className="text-gradient-gold font-medium">Reimagined</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Discover the world's finest electronics with our intelligent search.
            Find exactly what you need, powered by machine learning.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-gold rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
              <div className="relative flex items-center bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-3 px-5 border-r border-border">
                  <Zap className="w-5 h-5 text-gold" />
                  <span className="text-sm text-muted-foreground hidden sm:block">ML Search</span>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Describe what you're looking for..."
                  className="flex-1 px-5 py-5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
                />
                <Button variant="gold" size="lg" className="m-2 rounded-lg" onClick={handleSearch}>
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Suggestions removed */}

          {/* Stats removed and moved to bottom */}
        </div>
      </div>

      {/* Left Ad - iPhone 17 */}
      <div className="relative xl:absolute xl:left-8 xl:top-1/2 xl:-translate-y-1/2 w-full max-w-xs mx-auto xl:w-64 h-[400px] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-center group hover:border-gold/30 transition-all duration-500 animate-fade-in z-20 mt-8 xl:mt-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          controls
          className="w-full h-full object-cover"
        >
          <source src="/iphone-ad.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Right Ad - S25 Ultra */}
      <div className="relative xl:absolute xl:right-8 xl:top-1/2 xl:-translate-y-1/2 w-full max-w-xs mx-auto xl:w-64 h-[400px] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-center group hover:border-gold/30 transition-all duration-500 animate-fade-in z-20 mt-8 xl:mt-0 mb-8 xl:mb-0">
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

      {/* Scroll indicator removed and moved to bottom */}
    </section>
  );
};

export default HeroSection;
