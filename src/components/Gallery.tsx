import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getYouTubeEmbedUrl } from "@/lib/mediaUtils";
import YouTubeVideo from "@/components/YouTubeVideo";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  url: string;
  type: 'image' | 'video';
  category: string;
}

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/galleries');
      if (response.ok) {
        const data = await response.json();
        console.log('Gallery API data received:', data);
        if (data.length > 0) {
          setGalleryItems(data);
        } else {
          console.log('No gallery data from API, using fallback');
          // Fallback data when no gallery items exist
          setGalleryItems([
            {
              id: 1,
              title: 'Modern Reception Area',
              description: 'Our welcoming reception area with comfortable seating',
              url: '/images/gallery/clinic-interior.jpg',
              type: 'image',
              category: 'facility'
            },
            {
              id: 2,
              title: 'Advanced Medical Equipment',
              description: 'State-of-the-art diagnostic equipment',
              url: '/images/gallery/medical-equipment.jpg',
              type: 'image',
              category: 'equipment'
            },
            {
              id: 3,
              title: 'Consultation Room',
              description: 'Private and comfortable consultation spaces',
              url: '/images/gallery/consultation-room.jpg',
              type: 'image',
              category: 'facility'
            },
            {
              id: 4,
              title: 'Waiting Area',
              description: 'Spacious and comfortable waiting area for patients',
              url: '/images/gallery/clinic-modern.jpg',
              type: 'image',
              category: 'facility'
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      console.log('Using fallback data due to API error');
      // Use fallback data on error
      setGalleryItems([
        {
          id: 1,
          title: 'Modern Reception Area',
          description: 'Our welcoming reception area with comfortable seating',
          url: '/images/gallery/clinic-interior.jpg',
          type: 'image',
          category: 'facility'
        },
        {
          id: 2,
          title: 'Advanced Medical Equipment',
          description: 'State-of-the-art diagnostic equipment',
          url: '/images/gallery/medical-equipment.jpg',
          type: 'image',
          category: 'equipment'
        }
      ]);
    }
  };

  return (
    <>
      <section id="gallery" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <p className="text-primary font-medium tracking-wider uppercase text-sm mb-4 animate-fade-in-up">
              Our Facility
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              A Modern Space Designed <br />
              For <span className="text-gradient italic">Your Comfort</span>
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Take a look at our state-of-the-art medical facility where cutting-edge technology meets warm, welcoming care.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {galleryItems.filter(item => item.type === 'image').length > 0 ? 
              galleryItems
                .filter(item => item.type === 'image')
                .map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-3xl shadow-card hover-lift cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                    onClick={() => setSelectedImage(galleryItems.findIndex(galleryItem => galleryItem.id === item.id))}
                  >
                    <img
                      src={item.url}
                      alt={item.description}
                      className="w-full h-80 object-cover transition-smooth group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white font-display font-bold text-2xl">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No gallery images available at the moment.</p>
              </div>
            )}
          </div>

          {/* Video Section */}
          {galleryItems.some(item => item.type === 'video') && (
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-display font-bold text-gradient mb-4">
                  Virtual Facility Tour
                </h3>
                <p className="text-lg text-muted-foreground">
                  Experience our facility through an interactive video tour
                </p>
              </div>
              
              <div className="grid gap-6">
                {galleryItems
                  .filter(item => item.type === 'video')
                  .map((video, index) => (
                    <div
                      key={video.id}
                      className="relative aspect-video rounded-3xl overflow-hidden shadow-elegant bg-gradient-to-br from-muted to-muted/50 animate-fade-in-up"
                      style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                    >
                      <YouTubeVideo 
                        url={getYouTubeEmbedUrl(video.url)}
                        title={video.title}
                        className="w-full h-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <h4 className="text-white font-display font-bold text-xl">
                          {video.title}
                        </h4>
                        <p className="text-white/80 mt-1 text-sm">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0">
          {selectedImage !== null && galleryItems[selectedImage] && (
            <div className="relative">
              {galleryItems[selectedImage].type === 'image' ? (
                <img
                  src={galleryItems[selectedImage].url}
                  alt={galleryItems[selectedImage].description}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <YouTubeVideo 
                  url={getYouTubeEmbedUrl(galleryItems[selectedImage].url)}
                  title={galleryItems[selectedImage].title}
                  className="w-full h-96 rounded-lg"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-display font-bold text-2xl">
                  {galleryItems[selectedImage].title}
                </h3>
                <p className="text-white/80 mt-2">
                  {galleryItems[selectedImage].description}
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
