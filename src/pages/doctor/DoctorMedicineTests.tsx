import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSidebar from '@/components/DoctorSidebar';
import { Pill, TestTube, Plus, Edit, Trash2, DollarSign, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorMedicineTests = () => {
  const [medicines, setMedicines] = useState([]);
  const [tests, setTests] = useState([]);
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [editingTest, setEditingTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [medicineFormData, setMedicineFormData] = useState({
    name: '',
    manufacturer: '',
    price: '',
    stock_quantity: '',
    description: '',
    dosage_form: '',
    strength: '',
    is_active: true
  });
  const [testFormData, setTestFormData] = useState({
    name: '',
    category: '',
    price: '',
    duration_hours: '',
    description: '',
    sample_type: '',
    preparation_instructions: '',
    is_active: true
  });

  useEffect(() => {
    fetchMedicines();
    fetchTests();
  }, []);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/medicines', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
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
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTests(data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleMedicineSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const url = editingMedicine ? `/api/medicines/${editingMedicine.id}` : '/api/medicines';
      const method = editingMedicine ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicineFormData)
      });
      
      if (response.ok) {
        await fetchMedicines();
        resetMedicineForm();
        alert(editingMedicine ? 'Medicine updated successfully!' : 'Medicine added successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        setError(errorData.message || 'Failed to save medicine');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const url = editingTest ? `/api/tests/${editingTest.id}` : '/api/tests';
      const method = editingTest ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testFormData)
      });
      
      if (response.ok) {
        await fetchTests();
        resetTestForm();
        alert(editingTest ? 'Test updated successfully!' : 'Test added successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        setError(errorData.message || 'Failed to save test');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setMedicineFormData({
      name: medicine.name || '',
      manufacturer: medicine.manufacturer || '',
      price: medicine.price?.toString() || '',
      stock_quantity: medicine.stock_quantity?.toString() || '',
      description: medicine.description || '',
      dosage_form: medicine.dosage_form || '',
      strength: medicine.strength || '',
      is_active: medicine.is_active ?? true
    });
    setShowMedicineForm(true);
    setError('');
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    setTestFormData({
      name: test.name || '',
      category: test.category || '',
      price: test.price?.toString() || '',
      duration_hours: test.duration_hours?.toString() || '',
      description: test.description || '',
      sample_type: test.sample_type || '',
      preparation_instructions: test.preparation_instructions || '',
      is_active: test.is_active ?? true
    });
    setShowTestForm(true);
    setError('');
  };

  const handleDeleteMedicine = async (id) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/medicines/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          fetchMedicines();
          alert('Medicine deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  const handleDeleteTest = async (id) => {
    if (confirm('Are you sure you want to delete this test?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/tests/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          fetchTests();
          alert('Test deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting test:', error);
      }
    }
  };

  const resetMedicineForm = () => {
    setMedicineFormData({ 
      name: '', 
      manufacturer: '', 
      price: '', 
      stock_quantity: '', 
      description: '', 
      dosage_form: '', 
      strength: '', 
      is_active: true 
    });
    setEditingMedicine(null);
    setShowMedicineForm(false);
    setError('');
  };

  const resetTestForm = () => {
    setTestFormData({ 
      name: '', 
      category: '', 
      price: '', 
      duration_hours: '', 
      description: '', 
      sample_type: '', 
      preparation_instructions: '', 
      is_active: true 
    });
    setEditingTest(null);
    setShowTestForm(false);
    setError('');
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
                <p className="text-xl text-muted-foreground">Manage medicines and diagnostic tests</p>
              </div>

              <Tabs defaultValue="medicines" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="medicines">Medicines</TabsTrigger>
                  <TabsTrigger value="tests">Tests</TabsTrigger>
                </TabsList>

                <TabsContent value="medicines">
                  <Card className="shadow-card border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Pill className="h-5 w-5 text-primary" />
                          Medicine Inventory
                        </CardTitle>
                        <CardDescription>Manage medicine stock and information</CardDescription>
                      </div>
                      <Button onClick={() => setShowMedicineForm(true)} className="gradient-primary shadow-elegant">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medicine
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {showMedicineForm && (
                        <form onSubmit={handleMedicineSubmit} className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{editingMedicine ? 'Edit Medicine' : 'New Medicine'}</h3>
                            <Button type="button" onClick={resetMedicineForm} variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                              {error}
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Name *</Label>
                              <Input value={medicineFormData.name} onChange={(e) => setMedicineFormData({...medicineFormData, name: e.target.value})} required />
                            </div>
                            <div>
                              <Label>Manufacturer</Label>
                              <Input value={medicineFormData.manufacturer} onChange={(e) => setMedicineFormData({...medicineFormData, manufacturer: e.target.value})} />
                            </div>
                            <div>
                              <Label>Price *</Label>
                              <Input type="number" step="0.01" value={medicineFormData.price} onChange={(e) => setMedicineFormData({...medicineFormData, price: e.target.value})} required />
                            </div>
                            <div>
                              <Label>Stock Quantity *</Label>
                              <Input type="number" value={medicineFormData.stock_quantity} onChange={(e) => setMedicineFormData({...medicineFormData, stock_quantity: e.target.value})} required />
                            </div>
                            <div>
                              <Label>Dosage Form</Label>
                              <Input value={medicineFormData.dosage_form} onChange={(e) => setMedicineFormData({...medicineFormData, dosage_form: e.target.value})} placeholder="e.g., Tablet, Capsule" />
                            </div>
                            <div>
                              <Label>Strength</Label>
                              <Input value={medicineFormData.strength} onChange={(e) => setMedicineFormData({...medicineFormData, strength: e.target.value})} placeholder="e.g., 100mg" />
                            </div>
                            <div className="col-span-2">
                              <Label>Description</Label>
                              <Textarea value={medicineFormData.description} onChange={(e) => setMedicineFormData({...medicineFormData, description: e.target.value})} />
                            </div>
                            <div className="col-span-2">
                              <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Saving...' : (editingMedicine ? 'Update Medicine' : 'Add Medicine')}
                              </Button>
                            </div>
                          </div>
                        </form>
                      )}
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
                              <Button onClick={() => handleEditMedicine(medicine)} size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => handleDeleteMedicine(medicine.id)} size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {medicines.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No medicines found. Click "Add Medicine" to create your first medicine entry.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tests">
                  <Card className="shadow-card border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TestTube className="h-5 w-5 text-primary" />
                          Diagnostic Tests
                        </CardTitle>
                        <CardDescription>Manage available diagnostic tests</CardDescription>
                      </div>
                      <Button onClick={() => setShowTestForm(true)} className="gradient-primary shadow-elegant">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Test
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {showTestForm && (
                        <form onSubmit={handleTestSubmit} className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{editingTest ? 'Edit Test' : 'New Test'}</h3>
                            <Button type="button" onClick={resetTestForm} variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                              {error}
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Name *</Label>
                              <Input value={testFormData.name} onChange={(e) => setTestFormData({...testFormData, name: e.target.value})} required />
                            </div>
                            <div>
                              <Label>Category</Label>
                              <Select value={testFormData.category} onValueChange={(value) => setTestFormData({...testFormData, category: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Blood Test">Blood Test</SelectItem>
                                  <SelectItem value="Imaging">Imaging</SelectItem>
                                  <SelectItem value="Urine Test">Urine Test</SelectItem>
                                  <SelectItem value="Cardiac">Cardiac</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Price *</Label>
                              <Input type="number" step="0.01" value={testFormData.price} onChange={(e) => setTestFormData({...testFormData, price: e.target.value})} required />
                            </div>
                            <div>
                              <Label>Duration (hours)</Label>
                              <Input type="number" value={testFormData.duration_hours} onChange={(e) => setTestFormData({...testFormData, duration_hours: e.target.value})} />
                            </div>
                            <div>
                              <Label>Sample Type</Label>
                              <Input value={testFormData.sample_type} onChange={(e) => setTestFormData({...testFormData, sample_type: e.target.value})} placeholder="e.g., Blood, Urine" />
                            </div>
                            <div className="col-span-2">
                              <Label>Description</Label>
                              <Textarea value={testFormData.description} onChange={(e) => setTestFormData({...testFormData, description: e.target.value})} />
                            </div>
                            <div className="col-span-2">
                              <Label>Preparation Instructions</Label>
                              <Textarea value={testFormData.preparation_instructions} onChange={(e) => setTestFormData({...testFormData, preparation_instructions: e.target.value})} placeholder="Instructions for patient preparation" />
                            </div>
                            <div className="col-span-2">
                              <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Saving...' : (editingTest ? 'Update Test' : 'Add Test')}
                              </Button>
                            </div>
                          </div>
                        </form>
                      )}
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
                              <Button onClick={() => handleEditTest(test)} size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => handleDeleteTest(test.id)} size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {tests.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No tests found. Click "Add Test" to create your first test entry.
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