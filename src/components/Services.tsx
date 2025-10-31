import { Heart, Stethoscope, Activity, Syringe, Pill, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Stethoscope,
    title: "General Consultation",
    description: "Comprehensive medical examinations and health assessments for all ages.",
    features: ["Health Screening", "Diagnosis", "Treatment Plans"]
  },
  {
    icon: Heart,
    title: "Cardiology Care",
    description: "Specialized heart health monitoring and cardiovascular disease management.",
    features: ["ECG Testing", "Blood Pressure", "Heart Health"]
  },
  {
    icon: Activity,
    title: "Preventive Care",
    description: "Proactive healthcare measures to maintain optimal wellness and prevent disease.",
    features: ["Annual Checkups", "Vaccination", "Health Education"]
  },
  {
    icon: Pill,
    title: "Chronic Disease Management",
    description: "Ongoing care and support for managing long-term health conditions.",
    features: ["Diabetes Care", "Hypertension", "Regular Monitoring"]
  },
  {
    icon: Syringe,
    title: "Vaccinations & Immunizations",
    description: "Complete vaccination services for children, adults, and travelers.",
    features: ["Child Vaccines", "Flu Shots", "Travel Medicine"]
  },
  {
    icon: UserCheck,
    title: "Health Counseling",
    description: "Personalized lifestyle and wellness guidance for optimal health outcomes.",
    features: ["Nutrition Advice", "Fitness Plans", "Stress Management"]
  }
];

const Services = () => {
  return (
    <section id="services" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent font-medium tracking-wider uppercase text-sm mb-4 animate-fade-in-up">
            Specializing In
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Healthcare that isn't <span className="italic">only</span> exceptionally beautiful, <br />
            but also <span className="text-gradient">strategically designed</span> to improve your wellbeing!
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className="group hover-lift bg-card border-2 border-border animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-bounce group-hover:scale-110">
                    <Icon className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-2xl font-display">{service.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
