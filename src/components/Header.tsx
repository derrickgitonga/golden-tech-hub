import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, LogOut, History, Smartphone, Watch, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totalItems, setIsOpen } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const navLinks = [
    { name: "Smartphones", href: "/category/smartphones", icon: Smartphone },
    { name: "Wearables", href: "/category/wearables", icon: Watch },
    { name: "Accessories", href: "/category/accessories", icon: Plug },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-r from-[hsl(43,100%,50%)] to-[hsl(35,100%,40%)] flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">B</span>
            </div>
            <span className="font-display text-xl md:text-2xl font-semibold text-gray-900 tracking-wide">
              Back<span className="text-gradient-gold">Market</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => navigate("/search")}>
              <Search className="w-5 h-5" />
            </Button>

            {user ? (
              <Button variant="ghost" size="icon" className="hidden md:flex" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => navigate("/auth")}>
                <User className="w-5 h-5" />
              </Button>
            )}

            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
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

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center gap-3 text-gray-900 hover:text-gold transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5 text-gold" />
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {user && (
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 text-gray-900 hover:text-gold transition-colors py-2 px-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <History className="w-4 h-4" />
                    Order History
                  </Link>
                )}
                {user ? (
                  <Button variant="gold-outline" className="w-full" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="gold" className="w-full" onClick={() => { navigate("/auth"); setIsMenuOpen(false); }}>
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
