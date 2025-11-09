import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image: string;
  read_time: string;
  created_at: string;
  doctor_id: number;
  status: 'published' | 'draft';
  doctor?: {
    doctor_id: number;
    name: string;
    specialization: string;
  };
}

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [doctor, setDoctor] = useState<BlogPost['doctor'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBlogDetail(id);
    }
  }, [id]);

  const fetchBlogDetail = async (blogId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${blogId}`);
      
      if (response.ok) {
        const blogData = await response.json();
        console.log('Blog data:', blogData);
        setBlog(blogData);
        
        // Set doctor from blog data
        if (blogData.doctor) {
          setDoctor(blogData.doctor);
        }
      } else {
        console.error('API Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setError(`Blog post not found (${response.status})`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      setError('Failed to load blog post - network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => navigate('/blog')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | Health Blog</title>
        <meta name="description" content={blog.excerpt} />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <article className="py-12">
            <div className="container mx-auto px-4 max-w-4xl">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/blog')}
                className="mb-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>

              <Card className="overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={blog.image || '/images/blog/blog-wellness.jpg'} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-primary text-primary-foreground font-medium text-sm rounded-full shadow-elegant">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-8">
                  <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                      {blog.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{new Date(blog.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{blog.read_time || '5 min read'}</span>
                      </div>
                      {doctor && (
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>By {doctor.name}</span>
                          {doctor.specialization && (
                            <span className="text-primary">• {doctor.specialization}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </header>

                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  </div>
                </CardContent>
              </Card>

              {doctor && (
                <Card className="mt-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">About the Author</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogDetailPage;