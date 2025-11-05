import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, Award, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Index = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        toast.success('Successfully subscribed to our newsletter!');
        setEmail('');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>Dr. Sarah Mitchell</title>
        <meta name="description" content="Experience exceptional healthcare with Dr. Sarah Mitchell. Specialized in family medicine, preventive care, and chronic disease management." />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          
          <Services />

          {/* Why Choose Us */}
          <section className="py-20 md:py-32">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <p className="text-accent font-medium tracking-wider uppercase text-sm mb-4">
                  Why Choose Us
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
                  Healthcare That <span className="text-gradient italic">Stands Out</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Experience healthcare that puts you first
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center p-8 rounded-3xl border-2 border-border hover-lift bg-card animate-fade-in-up">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-6 shadow-elegant">
                    <Users className="text-white" size={36} />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3">Patient-Centered</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your health and comfort are our top priorities
                  </p>
                </div>
                <div className="text-center p-8 rounded-3xl border-2 border-border hover-lift bg-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-secondary mb-6 shadow-elegant">
                    <Award className="text-white" size={36} />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3">Experienced Care</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    15+ years of medical excellence and expertise
                  </p>
                </div>
                <div className="text-center p-8 rounded-3xl border-2 border-border hover-lift bg-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-accent mb-6 shadow-elegant">
                    <Calendar className="text-accent-foreground" size={36} />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3">Flexible Scheduling</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Convenient appointment times to fit your schedule
                  </p>
                </div>
              </div>
            </div>
          </section>

          <Testimonials />

          {/* Newsletter Subscription */}
          <section className="py-20 md:py-32 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6 shadow-elegant">
                  <Mail className="text-white" size={32} />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                  Stay <span className="text-gradient">Informed</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Subscribe to our newsletter for health tips, medical insights, and updates from Dr. Sarah Mitchell's practice.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gradient-primary shadow-elegant hover:shadow-glow"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
                <p className="text-sm text-muted-foreground mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
