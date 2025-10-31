import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Jennifer Anderson",
    role: "Patient since 2020",
    rating: 5,
    text: "Dr. Mitchell is absolutely wonderful! She takes the time to listen and explain everything thoroughly. I always feel heard and well-cared for. Her expertise and compassionate approach have made a significant difference in managing my health.",
    image: "👩‍💼"
  },
  {
    name: "Michael Chen",
    role: "Patient since 2019",
    rating: 5,
    text: "I've been seeing Dr. Mitchell for years now, and I couldn't be happier with the care I receive. She's knowledgeable, professional, and genuinely cares about her patients' wellbeing. Highly recommended!",
    image: "👨‍💼"
  },
  {
    name: "Sarah Williams",
    role: "Patient since 2021",
    rating: 5,
    text: "The best doctor I've ever had! Dr. Mitchell's thorough approach to healthcare and her ability to explain complex medical issues in understandable terms is remarkable. The entire experience has been exceptional.",
    image: "👩‍🎓"
  },
  {
    name: "David Thompson",
    role: "Patient since 2018",
    rating: 5,
    text: "Dr. Mitchell helped me manage my chronic condition effectively. Her dedication to patient care and follow-up is outstanding. I feel confident and secure knowing I'm in such capable hands.",
    image: "👨‍🔬"
  },
  {
    name: "Emily Rodriguez",
    role: "Patient since 2022",
    rating: 5,
    text: "Professional, caring, and extremely knowledgeable. Dr. Mitchell takes a holistic approach to health that I really appreciate. She's helped me not just treat symptoms but improve my overall wellness.",
    image: "👩‍⚕️"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handlePrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-secondary font-medium tracking-wider uppercase text-sm mb-4 animate-fade-in-up">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            What Our Patients Say About <br />
            <span className="text-gradient italic">Their Experience</span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden shadow-xl border-2 border-border hover-lift">
            <CardContent className="p-8 md:p-12">
              <Quote className="absolute top-6 right-6 text-primary/10 animate-float" size={100} />
              
              <div className={`transition-smooth ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="fill-accent text-accent" size={28} />
                  ))}
                </div>

                {/* Text */}
                <p className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed font-medium">
                  "{currentTestimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-3xl shadow-elegant">
                    {currentTestimonial.image}
                  </div>
                  <div>
                    <div className="font-display font-bold text-xl">{currentTestimonial.name}</div>
                    <div className="text-muted-foreground font-medium">{currentTestimonial.role}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-bounce w-12 h-12"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                  className={`h-2 rounded-full transition-bounce ${
                    index === currentIndex ? 'bg-primary w-12' : 'bg-border w-2 hover:bg-muted-foreground'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-bounce w-12 h-12"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
