import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import DoctorSidebar from '@/components/DoctorSidebar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Image, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface GalleryItem {
  id: number;
  doctor_id: number;
  title: string;
  description: string;
  url: string;
  type: 'image' | 'video';
  category: string;
  created_at: string;
  updated_at: string;
}

const DoctorGallery = () => {
  const { user } = useAuth();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'image' as 'image' | 'video',
    category: ''
  });

  const categories = ['Facilities', 'Equipment', 'Staff', 'Procedures', 'Patient Care'];

  const fetchGalleries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/doctor-galleries', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data);
      } else {
        toast({ title: 'Error', description: 'Failed to fetch galleries', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch galleries', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'doctor') {
      fetchGalleries();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      if (editingItem) {
        const response = await fetch(`/api/galleries/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          toast({ title: 'Success', description: 'Gallery item updated successfully' });
          fetchGalleries();
        } else {
          toast({ title: 'Error', description: 'Failed to update gallery item', variant: 'destructive' });
        }
      } else {
        const response = await fetch('/api/galleries', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...formData, doctor_id: user?.id })
        });
        
        if (response.ok) {
          toast({ title: 'Success', description: 'Gallery item added successfully' });
          fetchGalleries();
        } else {
          toast({ title: 'Error', description: 'Failed to add gallery item', variant: 'destructive' });
        }
      }
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', url: '', type: 'image', category: '' });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      url: item.url,
      type: item.type,
      category: item.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`/api/galleries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast({ title: 'Success', description: 'Gallery item deleted successfully' });
        fetchGalleries();
      } else {
        toast({ title: 'Error', description: 'Failed to delete gallery item', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Gallery Management - Doctor Dashboard</title>
      </Helmet>
      <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-20">
        <DoctorSidebar />
      <main className="flex-1 px-6 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-display font-bold text-gradient mb-4">Gallery Management</h1>
            <p className="text-xl text-muted-foreground">Manage your clinic's images and videos</p>
          </div>
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingItem(null)} className="gradient-primary">
                  <Plus size={20} className="mr-2" />
                  Add Media
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Media' : 'Add New Media'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Media Type</Label>
                    <Select value={formData.type} onValueChange={(value: 'image' | 'video') => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="url">Media URL</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                      placeholder="/src/assets/image.jpg or https://youtube.com/..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="gradient-primary">
                      {editingItem ? 'Update' : 'Add'} Media
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">No gallery items found. Add your first media item!</p>
                </div>
              ) : (
                galleryItems.map((item) => (
              <Card key={item.id} className="border-2 border-border overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  {item.type === 'image' ? (
                    <img 
                      src={item.url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video size={48} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="hidden w-full h-full items-center justify-center">
                    <Image size={48} className="text-muted-foreground" />
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type === 'image' ? <Image size={12} className="inline mr-1" /> : <Video size={12} className="inline mr-1" />}
                      {item.type}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-black/50 text-white rounded-full text-xs">
                      {item.category}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-display">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      </div>
      <Footer />
      </div>
    </>
  );
};

export default DoctorGallery;