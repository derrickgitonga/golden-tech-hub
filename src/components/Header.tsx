import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">B</span>
            </div>
            <span className="font-display text-2xl font-semibold text-foreground tracking-wide">
              Back<span className="text-gradient-gold">Market</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Smartphones
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Laptops
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Audio
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Wearables
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Accessories
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                3
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-foreground hover:text-gold transition-colors py-2">
                Smartphones
              </a>
              <a href="#" className="text-foreground hover:text-gold transition-colors py-2">
                Laptops
              </a>
              <a href="#" className="text-foreground hover:text-gold transition-colors py-2">
                Audio
              </a>
              <a href="#" className="text-foreground hover:text-gold transition-colors py-2">
                Wearables
              </a>
              <a href="#" className="text-foreground hover:text-gold transition-colors py-2">
                Accessories
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
