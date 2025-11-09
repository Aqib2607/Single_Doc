import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import blog images
import blogWellness from "@/assets/blog-wellness.jpg";
import blogMental from "@/assets/blog-mental.jpg";
import blogNutrition from "@/assets/blog-nutrition.jpg";
import blogAllergies from "@/assets/blog-allergies.jpg";
import blogChronic from "@/assets/blog-chronic.jpg";
import blogPreventive from "@/assets/blog-preventive.jpg";

// Helper function to map image paths to imported images
const getImagePath = (imagePath: string): string => {
  const imageMap: { [key: string]: string } = {
    '/images/blog/blog-wellness.jpg': blogWellness,
    '/images/blog/blog-mental.jpg': blogMental,
    '/images/blog/blog-nutrition.jpg': blogNutrition,
    '/images/blog/blog-allergies.jpg': blogAllergies,
    '/images/blog/blog-chronic.jpg': blogChronic,
    '/images/blog/blog-preventive.jpg': blogPreventive,
  };
  
  return imageMap[imagePath] || imagePath;
};
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  read_time: string;
  created_at: string;
  status: 'published' | 'draft';
  doctor_id: number;
  doctor?: {
    doctor_id: number;
    name: string;
    specialization: string;
  };
}

const BlogPage = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    // Fallback blog data for when API is unavailable
    const fallbackBlogs: BlogPost[] = [
      {
        id: 1,
        title: '10 Essential Health Tips for a Better Life',
        excerpt: 'Discover simple yet effective ways to improve your overall health and wellbeing.',
        category: 'Wellness',
        image: blogWellness,
        read_time: '5 min read',
        created_at: new Date().toISOString(),
        status: 'published',
        doctor_id: 1
      },
      {
        id: 2,
        title: 'Understanding Mental Health in Modern Times',
        excerpt: 'Mental health awareness and practical strategies for maintaining psychological wellbeing.',
        category: 'Mental Health',
        image: blogMental,
        read_time: '7 min read',
        created_at: new Date().toISOString(),
        status: 'published',
        doctor_id: 2
      },
      {
        id: 3,
        title: 'Nutrition Guidelines for Optimal Health',
        excerpt: 'Evidence-based nutrition advice to help you make informed dietary choices.',
        category: 'Nutrition',
        image: blogNutrition,
        read_time: '6 min read',
        created_at: new Date().toISOString(),
        status: 'published',
        doctor_id: 3
      }
    ];

    try {
      setError(null);
      const response = await fetch('/api/blogs');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        console.log('Number of blogs:', Array.isArray(data) ? data.length : 'Not an array');
        setBlogPosts(Array.isArray(data) ? data : []);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        console.warn('Using fallback blog data due to API error');
        setBlogPosts(fallbackBlogs);
        setError(null); // Clear error since we have fallback data
      }
    } catch (error) {
      console.error('Network Error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.warn('Using fallback blog data due to network error');
      setBlogPosts(fallbackBlogs);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Health Blog | Dr. Sarah Mitchell</title>
        <meta name="description" content="Read expert medical advice, health tips, and wellness insights from Dr. Sarah Mitchell." />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <p className="text-primary font-medium tracking-wider uppercase text-sm mb-4 animate-fade-in-up">
                  Our Blog
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  Health & <span className="text-gradient italic">Wellness</span> Insights
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  Expert medical insights, health tips, and wellness advice to help you live your healthiest life.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.length > 0 ? (
                  blogPosts.map((post, index) => (
                    <Card key={post.id} className="group hover-lift border-2 border-border overflow-hidden animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="relative overflow-hidden aspect-video">
                        <img 
                          src={getImagePath(post.image || '/images/blog/blog-wellness.jpg')} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-4 py-2 bg-primary text-primary-foreground font-medium text-sm rounded-full shadow-elegant">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl font-display group-hover:text-primary transition-smooth">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="mt-2 leading-relaxed">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{post.read_time || '5 min read'}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="w-full group-hover:gradient-primary group-hover:text-white transition-smooth"
                          onClick={() => navigate(`/blog/${post.id}`)}
                        >
                          Read More <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    {error ? (
                      <div className="space-y-4">
                        <p className="text-destructive text-lg font-medium">Failed to load blog posts</p>
                        <p className="text-muted-foreground">{error}</p>
                        <Button onClick={fetchBlogs} variant="outline">
                          Try Again
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-lg">No blog posts available at the moment.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPage;
