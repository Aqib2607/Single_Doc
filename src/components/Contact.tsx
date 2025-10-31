import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+1 (555) 123-4567", "Emergency: +1 (555) 987-6543"],
    link: "tel:+15551234567"
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@drsarahmitchell.com", "appointments@drsarahmitchell.com"],
    link: "mailto:info@drsarahmitchell.com"
  },
  {
    icon: MapPin,
    title: "Location",
    details: ["456 Healthcare Boulevard", "Medical Plaza, Suite 200, New York, NY 10001"],
    link: "https://maps.google.com/?q=456+Healthcare+Boulevard+New+York+NY"
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Mon-Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 3:00 PM", "Sun: Emergency Only"],
    link: null
  }
];

const faqs = [
  {
    question: "How do I book an appointment?",
    answer: "You can book an appointment by calling us at +1 (555) 123-4567 or sending us an email at appointments@drsarahmitchell.com. We'll get back to you within 24 hours to confirm your appointment."
  },
  {
    question: "What should I bring to my first visit?",
    answer: "Please bring a valid ID, your insurance card, a list of current medications, and any relevant medical records or test results from previous doctors."
  },
  {
    question: "Do you accept insurance?",
    answer: "Yes, we accept most major insurance plans including Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealthcare. Please contact us to verify your specific plan coverage."
  },
  {
    question: "What are your cancellation policies?",
    answer: "We require at least 24 hours notice for appointment cancellations. Same-day cancellations may be subject to a fee unless it's an emergency."
  },
  {
    question: "Do you offer telemedicine consultations?",
    answer: "Yes, we offer virtual consultations for follow-up appointments and certain types of consultations. Please ask when booking your appointment."
  },
  {
    question: "How can I access my test results?",
    answer: "Test results are typically available within 2-3 business days. You can access them through our patient portal or we'll call you to discuss the results."
  }
];

const Contact = () => {

  return (
    <section id="contact" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">


        {/* Map Section */}
        <div className="mb-12 max-w-6xl mx-auto">
          <Card className="shadow-elegant border-border overflow-hidden">
            <CardContent className="p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1647887432123!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dr. Sarah Mitchell Clinic Location"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6 animate-slide-in-left">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card 
                  key={index} 
                  className="shadow-card hover:shadow-elegant transition-smooth border-border"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                        <Icon className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-display font-semibold mb-2">{info.title}</h3>
                        {info.link ? (
                          <a 
                            href={info.link}
                            target={info.link.startsWith('http') ? '_blank' : undefined}
                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="space-y-1 hover:text-primary transition-smooth"
                          >
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-muted-foreground">{detail}</p>
                            ))}
                          </a>
                        ) : (
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-muted-foreground">{detail}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <Card className="shadow-elegant border-border animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about our services.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-2 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
