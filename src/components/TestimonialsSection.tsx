import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Marques Brownlee",
    role: "Tech Reviewer",
    content: "Bought a refurbished iPhone 15 Pro for camera tests. Honestly, I was skeptical about the 'Excellent' grade, but it arrived with 100% battery capacity and literally zero marks. A solid choice for anyone looking to save cash.",
    rating: 5,
    product: "iPhone 15 Pro",
  },
  {
    id: 2,
    name: "Cassidy Williams",
    role: "Software Engineer",
    content: "Needed a secondary monitor and a mechanical keyboard for my home setup. Found a refurbished Keychron and a portable monitor here. The keys feel clicky and perfect, and the box came with all the original spare keycaps.",
    rating: 5,
    product: "Keychron K2 Keyboard",
  },
  {
    id: 3,
    name: "Lee Robinson",
    role: "Developer Relations",
    content: "Grabbed a refurbished ThinkPad for checking linux distros. The chassis had a tiny scuff near the charging port, but the performance and battery health (94%) are great. Delivery was delayed by a day, but support kept me in the loop.",
    rating: 4,
    product: "Lenovo ThinkPad X1 Carbon",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
            Trusted by <span className="text-gradient-gold">Thousands</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Don't just take our word for it — hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative p-8 rounded-2xl bg-background border border-border hover:border-gold/30 transition-all duration-500 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="absolute -top-4 -left-2 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <Quote className="w-5 h-5 text-gold" />
              </div>

              <div className="flex gap-1 mb-6 pt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gray-900 text-gray-900" />
                ))}
              </div>

              <p className="text-foreground/90 leading-relaxed mb-8">
                "{testimonial.content}"
              </p>

              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground mb-6">
                Purchased: {testimonial.product}
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div>
                  <div className="font-medium text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-2xl glass">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-3xl md:text-4xl font-semibold text-gradient-gold">98%</div>
              <div className="text-sm text-muted-foreground mt-1">Customer Satisfaction</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-semibold text-gradient-gold">4.9/5</div>
              <div className="text-sm text-muted-foreground mt-1">Average Rating</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-semibold text-gradient-gold">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">Verified Reviews</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-semibold text-gradient-gold">180+</div>
              <div className="text-sm text-muted-foreground mt-1">Countries Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
