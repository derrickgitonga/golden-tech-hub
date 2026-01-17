import { useState } from "react";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email");

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    try {
      emailSchema.parse(email);
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch {
      toast.error("Please enter a valid email");
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-medium text-gray-900 mb-2">
                Stay in the loop
              </h3>
              <p className="text-gray-600">
                Get exclusive deals and new product alerts
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-5 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
              />
              <Button variant="gold" size="lg" onClick={handleSubscribe}>
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[hsl(43,100%,50%)] to-[hsl(35,100%,40%)] flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">B</span>
              </div>
              <span className="font-display text-2xl font-semibold text-gray-900">
                Back<span className="text-gradient-gold">Market</span>
              </span>
            </a>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-xs">
              The world's premier destination for premium electronics.
              Curated selection, intelligent search, exceptional service.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Youtube, label: "Youtube" },
                { Icon: Linkedin, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gold/10 hover:text-gold hover:border-gold/30 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-3">
              {["Smartphones", "Wearables", "Accessories", "Gaming"].map((item) => (
                <li key={item}>
                  <a href={`/category/${item.toLowerCase()}`} className="text-sm text-gray-600 hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Press", "Blog", "Affiliate Program", "Partners"].map((item) => (
                <li key={item}>
                  <a href="/coming-soon" className="text-sm text-gray-600 hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3">
              {["Help Center", "Track Order", "Shipping Info", "Returns", "Warranty", "Contact Us"].map((item) => (
                <li key={item}>
                  <a href="/coming-soon" className="text-sm text-gray-600 hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5" />
                <span className="text-sm text-gray-600">
                  123 Tech Plaza, San Francisco, CA 94105
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold" />
                <span className="text-sm text-gray-600">+1 (888) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold" />
                <span className="text-sm text-gray-600">support@backmarket.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2024 BackMarket. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="/coming-soon" className="text-sm text-gray-600 hover:text-gold transition-colors">
                Privacy Policy
              </a>
              <a href="/coming-soon" className="text-sm text-gray-600 hover:text-gold transition-colors">
                Terms of Service
              </a>
              <a href="/coming-soon" className="text-sm text-gray-600 hover:text-gold transition-colors">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
