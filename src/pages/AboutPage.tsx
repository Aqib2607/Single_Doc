import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Dr. Sarah Mitchell | Medical Professional</title>
        <meta name="description" content="Learn about Dr. Sarah Mitchell's qualifications, experience, and patient-centered approach to healthcare." />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <About />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
