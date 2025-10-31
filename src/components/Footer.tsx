import { Heart, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-display font-bold text-gradient mb-4">Healthcare Portal</h3>
            <p className="text-muted-foreground mb-4">
              Connecting patients with quality healthcare providers through modern technology. 
              Your health journey starts here with trusted medical professionals.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/TheAsmodeus2607" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full shadow-card border border-border bg-card hover:shadow-elegant hover:scale-110 text-muted-foreground hover:text-[#1877F2] hover:border-[#1877F2] flex items-center justify-center transition-smooth"
                aria-label="Facebook"
              >
                <Facebook size={22} />
              </a>
              <a 
                href="https://twitter.com/AqibJawwadNahin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full shadow-card border border-border bg-card hover:shadow-elegant hover:scale-110 text-muted-foreground hover:text-[#1DA1F2] hover:border-[#1DA1F2] flex items-center justify-center transition-smooth"
                aria-label="Twitter"
              >
                <Twitter size={22} />
              </a>
              <a 
                href="https://linkedin.com/in/aqib-jawwad-nahin-598288278" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full shadow-card border border-border bg-card hover:shadow-elegant hover:scale-110 text-muted-foreground hover:text-[#0077B5] hover:border-[#0077B5] flex items-center justify-center transition-smooth"
                aria-label="LinkedIn"
              >
                <Linkedin size={22} />
              </a>
              <a 
                href="https://instagram.com/_.the_asmodeus._" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full shadow-card border border-border bg-card hover:shadow-elegant hover:scale-110 text-muted-foreground hover:text-[#E4405F] hover:border-[#E4405F] flex items-center justify-center transition-smooth"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-smooth">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-smooth">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-smooth">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-smooth">
                  Blog
                </Link>
              </li>              
              <li>
                <Link to="/gallery" className="text-muted-foreground hover:text-primary transition-smooth">
                  Gallery
                </Link>
              </li>              
              <li>
                <Link to="/medicine-tests" className="text-muted-foreground hover:text-primary transition-smooth">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-smooth">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>123 Medical Center Drive</li>
              <li>Suite 456, Healthcare Plaza</li>
              <li className="pt-2">
                <a href="tel:+1234567890" className="hover:text-primary transition-smooth">
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <a href="mailto:contact@healthcareportal.com" className="hover:text-primary transition-smooth">
                  contact@healthcareportal.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} <a href="https://aqibjawwad.me" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-smooth">Aqib Jawwad Nahin</a>. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Built with</span>
            <Heart className="text-primary fill-primary animate-pulse" size={16} />
            <span>for modern healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
