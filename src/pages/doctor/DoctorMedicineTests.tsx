import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSidebar from '@/components/DoctorSidebar';
import { Pill, TestTube, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorMedicineTests = () => {
  const [medicines, setMedicines] = useState([]);
  const [tests, setTests] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('medicines');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock_quantity: '',
    manufacturer: '',
    category: '',
    strength: '',
    sample_type: '',
    duration_hours: ''
  });

  useEffect(() => {
    fetchMedicines();
    fetchTests();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch('/api/medicines');
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/tests');
      if (response.ok) {
        const data = await response.json();
        setTests(data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    const currentTab = activeTab || 'medicines';
    const url = editingItem 
      ? `/api/${currentTab}/${editingItem.id}`
      : `/api/${currentTab}`;
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsDialogOpen(false);
        resetForm();
        if (currentTab === 'medicines') {
          fetchMedicines();
        } else {
          fetchTests();
        }
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = getAuthToken();
    const currentTab = activeTab || 'medicines';
    try {
      const response = await fetch(`/api/${currentTab}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        if (currentTab === 'medicines') {
          fetchMedicines();
        } else {
          fetchTests();
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      price: item.price || '',
      stock_quantity: item.stock_quantity || '',
      manufacturer: item.manufacturer || '',
      category: item.category || '',
      strength: item.strength || '',
      sample_type: item.sample_type || '',
      duration_hours: item.duration_hours || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      stock_quantity: '',
      manufacturer: '',
      category: '',
      strength: '',
      sample_type: '',
      duration_hours: ''
    });
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



  return (
    <>
      <Helmet>
        <title>Medicine & Tests - Doctor Dashboard</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-20">
          <DoctorSidebar />
          <main className="flex-1 px-6 py-8">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-8 animate-fade-in-up">
                <h1 className="text-4xl font-display font-bold text-gradient mb-4">Medicine & Tests</h1>
                <p className="text-xl text-muted-foreground">View available medicines and diagnostic tests</p>
              </div>

              <Tabs defaultValue="medicines" className="space-y-6" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="medicines">Medicines</TabsTrigger>
                  <TabsTrigger value="tests">Tests</TabsTrigger>
                </TabsList>

                <TabsContent value="medicines">
                  <Card className="shadow-card border-border bg-card">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Pill className="h-5 w-5 text-primary" />
                            Medicine Inventory
                          </CardTitle>
                          <CardDescription>Manage available medicines</CardDescription>
                        </div>
                        <Dialog open={isDialogOpen && activeTab === 'medicines'} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button onClick={() => { setActiveTab('medicines'); resetForm(); }}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Medicine
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{editingItem ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
                              <DialogDescription>
                                {editingItem ? 'Update the medicine information below.' : 'Fill in the details to add a new medicine to the inventory.'}
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                              </div>
                              <div>
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} required />
                              </div>
                              <div>
                                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                <Input id="stock_quantity" name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleInputChange} required />
                              </div>
                              <div>
                                <Label htmlFor="manufacturer">Manufacturer</Label>
                                <Input id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" name="category" value={formData.category} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="strength">Strength</Label>
                                <Input id="strength" name="strength" value={formData.strength} onChange={handleInputChange} />
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {medicines.map((medicine) => (
                          <div key={medicine.id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                            <div className="flex items-center gap-3">
                              <Pill className="h-5 w-5 text-primary" />
                              <div>
                                <h3 className="font-semibold text-foreground">{medicine.name}</h3>
                                <p className="text-sm text-muted-foreground">Manufacturer: {medicine.manufacturer || 'N/A'}</p>
                                <p className="text-sm text-primary flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  ${medicine.price} | Stock: {medicine.stock_quantity}
                                </p>
                                {medicine.strength && (
                                  <p className="text-sm text-muted-foreground">Strength: {medicine.strength}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => { setActiveTab('medicines'); handleEdit(medicine); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => { setActiveTab('medicines'); handleDelete(medicine.id); }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {medicines.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No medicines available.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tests">
                  <Card className="shadow-card border-border bg-card">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <TestTube className="h-5 w-5 text-primary" />
                            Diagnostic Tests
                          </CardTitle>
                          <CardDescription>Manage available diagnostic tests</CardDescription>
                        </div>
                        <Dialog open={isDialogOpen && activeTab === 'tests'} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button onClick={() => { setActiveTab('tests'); resetForm(); }}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Test
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{editingItem ? 'Edit Test' : 'Add New Test'}</DialogTitle>
                              <DialogDescription>
                                {editingItem ? 'Update the test information below.' : 'Fill in the details to add a new diagnostic test.'}
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                              </div>
                              <div>
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} required />
                              </div>
                              <div>
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" name="category" value={formData.category} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="sample_type">Sample Type</Label>
                                <Input id="sample_type" name="sample_type" value={formData.sample_type} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="duration_hours">Duration (Hours)</Label>
                                <Input id="duration_hours" name="duration_hours" type="number" value={formData.duration_hours} onChange={handleInputChange} />
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tests.map((test) => (
                          <div key={test.id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                            <div className="flex items-center gap-3">
                              <TestTube className="h-5 w-5 text-primary" />
                              <div>
                                <h3 className="font-semibold text-foreground">{test.name}</h3>
                                <p className="text-sm text-muted-foreground">Category: {test.category || 'N/A'}</p>
                                <p className="text-sm text-primary flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  ${test.price} | Duration: {test.duration_hours || 0}h
                                </p>
                                {test.sample_type && (
                                  <p className="text-sm text-muted-foreground">Sample: {test.sample_type}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => { setActiveTab('tests'); handleEdit(test); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => { setActiveTab('tests'); handleDelete(test.id); }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {tests.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No tests available.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DoctorMedicineTests;