import { MessageCircle, Facebook, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FloatingButtons = () => {
  const navigate = useNavigate();
  const whatsappNumber = "1234567890"; // Replace with actual WhatsApp number
  const facebookUrl = "https://facebook.com/TheAsmodeus2607"; // Replace with actual Facebook URL

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40 animate-fade-in-up">
      <Button
        size="icon"
        className="h-16 w-16 rounded-full shadow-card hover:shadow-elegant bg-card border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth animate-bounce-subtle backdrop-blur-sm"
        onClick={() => navigate('/appointment')}
        aria-label="Book Appointment"
      >
        <Calendar size={28} />
      </Button>
      <Button
        size="icon"
        className="h-16 w-16 rounded-full shadow-card hover:shadow-elegant gradient-primary hover:scale-110 transition-smooth animate-pulse backdrop-blur-sm"
        onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </Button>
      <Button
        size="icon"
        className="h-16 w-16 rounded-full shadow-card hover:shadow-elegant bg-card border-2 border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-smooth backdrop-blur-sm"
        onClick={() => window.open(facebookUrl, "_blank")}
        aria-label="Visit Facebook page"
      >
        <Facebook size={28} />
      </Button>
    </div>
  );
};

export default FloatingButtons;
