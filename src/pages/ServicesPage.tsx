import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

const ServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>Medical Services | Dr. Sarah Mitchell</title>
        <meta name="description" content="Comprehensive medical services including general consultations, preventive care, chronic disease management, and specialized treatments." />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-6 text-gradient">
              Our Medical Services
            </h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Providing comprehensive healthcare services tailored to your needs with the highest standards of medical excellence.
            </p>
          </div>
          <Services />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ServicesPage;
