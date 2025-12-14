import { Smartphone, Laptop, Headphones, Watch, Cpu, Camera, Monitor, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Smartphones", icon: Smartphone, count: "45K+" },
  { name: "Laptops", icon: Laptop, count: "32K+" },
  { name: "Audio", icon: Headphones, count: "28K+" },
  { name: "Wearables", icon: Watch, count: "15K+" },
  { name: "Components", icon: Cpu, count: "52K+" },
  { name: "Cameras", icon: Camera, count: "18K+" },
  { name: "Monitors", icon: Monitor, count: "22K+" },
  { name: "Gaming", icon: Gamepad2, count: "35K+" },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, hsl(var(--gold)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
            Browse by <span className="text-gradient-gold">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our extensive collection across all major electronics categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/category/${category.name.toLowerCase()}`}
              className="group relative p-6 md:p-8 rounded-2xl bg-background border border-border hover:border-gold/50 transition-all duration-500 overflow-hidden opacity-0 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                  <category.icon className="w-7 h-7 text-muted-foreground group-hover:text-gold transition-colors" />
                </div>
                <h3 className="font-display text-lg font-medium text-foreground mb-1 group-hover:text-gold transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.count} products
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
