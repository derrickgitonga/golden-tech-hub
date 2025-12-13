import { Shield, Truck, RotateCcw, Award, Clock, CreditCard } from "lucide-react";

const trustFeatures = [
  {
    icon: Shield,
    title: "Secure Checkout",
    description: "256-bit SSL encryption for all transactions",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $99 worldwide",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Hassle-free money-back guarantee",
  },
  {
    icon: Award,
    title: "Certified Products",
    description: "100% authentic & verified items",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Expert assistance anytime",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Multiple payment options available",
  },
];

const TrustSection = () => {
  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
          {trustFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-4 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
