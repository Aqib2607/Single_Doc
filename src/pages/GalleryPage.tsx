import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

const GalleryPage = () => {
  return (
    <>
      <Helmet>
        <title>Gallery | Dr. Sarah Mitchell's Clinic</title>
        <meta name="description" content="Explore our modern medical facility with state-of-the-art equipment and comfortable patient areas." />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-6 text-gradient">
              Our Facility
            </h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-4">
              Take a virtual tour of our modern medical facility designed for your comfort and care.
            </p>
          </div>
          <Gallery />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default GalleryPage;
