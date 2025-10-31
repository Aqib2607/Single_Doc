import { useState } from 'react';
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

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  url: string;
  type: 'image' | 'video';
  category: string;
  date: string;
}

const DoctorGallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: 1,
      title: "Modern Consultation Room",
      description: "State-of-the-art consultation room with latest medical equipment",
      url: "/src/assets/consultation-room.jpg",
      type: 'image',
      category: "Facilities",
      date: "2024-03-15"
    },
    {
      id: 2,
      title: "Medical Equipment Demo",
      description: "Advanced diagnostic equipment in action",
      url: "/src/assets/medical-equipment.jpg",
      type: 'image',
      category: "Equipment",
      date: "2024-03-10"
    }
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setGalleryItems(galleryItems.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, date: new Date().toISOString().split('T')[0] }
          : item
      ));
    } else {
      const newItem: GalleryItem = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0]
      };
      setGalleryItems([...galleryItems, newItem]);
    }
    resetForm();
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

  const handleDelete = (id: number) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
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
                  <div className="hidden w-full h-full flex items-center justify-center">
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
                    <span className="text-sm text-muted-foreground">{item.date}</span>
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
            ))}
          </div>
        </div>
      </main>
      </div>
      <Footer />
      </div>
    </>
  );
};

export default DoctorGallery;