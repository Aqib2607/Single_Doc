import { ArrowRight, Calendar, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-healthcare.jpg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Small headline */}
            <p className="text-primary font-medium tracking-wider uppercase text-sm">
              Elevate Your Health With
            </p>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              Compassionate Healthcare{" "}
              <span className="text-gradient italic">That Puts You First</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              I help with <strong className="text-foreground">EXPERT CARE + MODERN TREATMENT + WELLNESS</strong> Services
              to make your health journey a transformative experience (no kidding!)
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={scrollToContact}
                className="gradient-primary text-lg px-8 py-6 shadow-elegant hover:shadow-glow hover:scale-105 transition-bounce"
              >
                Book Your Appointment
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>

            {/* Badge with icon */}
            <div className="relative inline-flex">
              <div className="absolute -right-4 -top-4 animate-float">
                <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center shadow-xl">
                  <div className="text-center">
                    <Sparkles className="mx-auto text-accent-foreground" size={24} />
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border-2 border-primary/20 rounded-full">
                <Award className="text-primary" size={24} />
                <span className="font-display font-semibold text-foreground">Board-Certified Physician</span>
              </div>
            </div>
          </div>

          {/* Right Content - Image Mockups */}
          <div className="relative animate-slide-in-right">
            <div className="relative">
              {/* Main Image */}
              <div className="rounded-3xl overflow-hidden shadow-xl hover-lift">
                <img 
                  src={heroImage}
                  alt="Dr. Sarah Mitchell - Professional Healthcare Provider"
                  className="w-full h-auto"
                />
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-xl border-2 border-border animate-bounce-in" style={{ animationDelay: "0.3s" }}>
                <div className="text-3xl font-display font-bold text-gradient">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>

              <div className="absolute -top-6 -right-6 bg-card rounded-2xl p-4 shadow-xl border-2 border-border animate-bounce-in" style={{ animationDelay: "0.5s" }}>
                <div className="text-3xl font-display font-bold text-gradient">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-display font-bold mb-2">
              <span className="text-gradient">5000+</span>
            </div>
            <div className="text-sm md:text-base text-muted-foreground">Happy Patients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-display font-bold mb-2">
              <span className="text-gradient">24/7</span>
            </div>
            <div className="text-sm md:text-base text-muted-foreground">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-display font-bold mb-2">
              <span className="text-gradient">15+</span>
            </div>
            <div className="text-sm md:text-base text-muted-foreground">Years of Service</div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
    </section>
  );
};

export default Hero;
