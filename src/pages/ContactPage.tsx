import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Dr. Sarah Mitchell</title>
        <meta name="description" content="Get in touch with Dr. Sarah Mitchell's clinic. Book an appointment or contact us for any inquiries." />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-6 text-gradient">
              Contact Us
            </h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Ready to take the next step in your healthcare journey? Get in touch with us today.
            </p>
          </div>
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
