import { GraduationCap, Award, Users, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import aboutImage from "@/assets/consultation-scene.jpg";

const qualifications = [
  {
    icon: GraduationCap,
    title: "Medical Education",
    items: [
      "MD from Harvard Medical School",
      "Residency at Johns Hopkins Hospital",
      "Board Certified in Internal Medicine"
    ]
  },
  {
    icon: Award,
    title: "Certifications",
    items: [
      "American Board of Internal Medicine",
      "Advanced Cardiac Life Support (ACLS)",
      "Basic Life Support (BLS) Instructor"
    ]
  },
  {
    icon: Users,
    title: "Professional Memberships",
    items: [
      "American Medical Association",
      "Society of General Internal Medicine",
      "American College of Physicians"
    ]
  }
];

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-secondary font-medium tracking-wider uppercase text-sm mb-4 animate-fade-in-up">
            About the Practice
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            What Working With Me Looks <br />
            <span className="text-gradient italic">(and feels!)</span> Like
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Modern, patient-focused, evidence-based care meets compassionate medical expertise.
          </p>
          <p className="text-xl font-display font-semibold mt-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            Let's create a healthcare experience that <span className="text-gradient italic">transforms</span>!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
          {/* Left Content - Image */}
          <div className="animate-slide-in-left">
            <div className="rounded-3xl overflow-hidden shadow-xl hover-lift">
              <img 
                src={aboutImage}
                alt="Medical consultation scene"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right Content - Text */}
          <div className="animate-slide-in-right space-y-6">
            <h3 className="text-3xl md:text-4xl font-display font-bold">
              Meet <span className="text-gradient">Dr. Sarah Mitchell</span>
            </h3>
            
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                With over 15 years of experience in internal medicine, I am dedicated to providing compassionate, 
                patient-centered care that addresses both immediate health concerns and long-term wellness goals.
              </p>
              <p>
                My approach combines evidence-based medicine with a deep understanding of each patient's unique 
                circumstances, ensuring personalized treatment plans that truly work.
              </p>
              <p>
                I believe in building lasting relationships with my patients, taking the time to listen, educate, 
                and empower them to take an active role in their healthcare journey.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-3 px-6 py-4 bg-primary/10 rounded-2xl border-2 border-primary/20">
                <Heart className="text-primary" size={24} />
                <span className="font-display font-semibold text-foreground">Patient-First Approach</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-secondary/10 rounded-2xl border-2 border-secondary/20">
                <Award className="text-secondary" size={24} />
                <span className="font-display font-semibold text-foreground">Excellence in Care</span>
              </div>
            </div>
          </div>
        </div>

        {/* Qualifications Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {qualifications.map((qual, index) => {
            const Icon = qual.icon;
            return (
              <Card 
                key={index} 
                className="p-8 shadow-card hover-lift bg-card border-2 border-border animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-4">{qual.title}</h3>
                  <ul className="space-y-2 text-left">
                    {qual.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
