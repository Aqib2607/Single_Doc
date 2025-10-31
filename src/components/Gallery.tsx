import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import clinicInterior from "@/assets/clinic-modern.jpg";
import consultationRoom from "@/assets/consultation-scene.jpg";
import medicalEquipment from "@/assets/medical-tech.jpg";
import heroDoctor from "@/assets/hero-healthcare.jpg";

const galleryImages = [
  {
    src: clinicInterior,
    alt: "Modern clinic interior with comfortable waiting area",
    title: "Reception & Waiting Area"
  },
  {
    src: consultationRoom,
    alt: "Consultation room with medical professional",
    title: "Consultation Room"
  },
  {
    src: medicalEquipment,
    alt: "State-of-the-art medical equipment",
    title: "Medical Equipment"
  },
  {
    src: heroDoctor,
    alt: "Dr. Sarah Mitchell in modern healthcare facility",
    title: "Professional Care"
  },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <section id="gallery" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary font-medium tracking-wider uppercase text-sm mb-4 animate-fade-in-up">
              Our Facility
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              A Modern Space Designed <br />
              For <span className="text-gradient italic">Your Comfort</span>
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Take a look at our state-of-the-art medical facility where cutting-edge technology meets warm, welcoming care.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-card hover-lift cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-80 object-cover transition-smooth group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-display font-bold text-2xl">
                      {image.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-elegant bg-gradient-to-br from-muted to-muted/50 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow hover:scale-110 transition-bounce cursor-pointer">
                    <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <p className="text-foreground font-display font-semibold text-xl mb-2">Virtual Facility Tour</p>
                  <p className="text-sm text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0">
          {selectedImage !== null && (
            <div className="relative">
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-display font-bold text-2xl">
                  {galleryImages[selectedImage].title}
                </h3>
                <p className="text-white/80 mt-2">
                  {galleryImages[selectedImage].alt}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Gallery;
