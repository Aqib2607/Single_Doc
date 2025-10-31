import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSidebar from '@/components/DoctorSidebar';
import { Users, Plus, Eye, Edit, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    medical_history: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patients', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingPatient ? `/api/patients/${editingPatient.id}` : '/api/patients';
      const method = editingPatient ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchPatients();
        resetForm();
        alert(editingPatient ? 'Patient updated successfully!' : 'Patient added successfully!');
      }
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      age: patient.age || '',
      address: patient.address || '',
      medical_history: patient.medical_history || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/patients/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          fetchPatients();
          alert('Patient deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', age: '', address: '', medical_history: '' });
    setEditingPatient(null);
    setShowForm(false);
  };

  return (
    <>
      <Helmet>
        <title>Patients - Doctor Dashboard</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-20">
          <DoctorSidebar />
          <main className="flex-1 px-6 py-8">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-8 animate-fade-in-up">
                <h1 className="text-4xl font-display font-bold text-gradient mb-4">My Patients</h1>
                <p className="text-xl text-muted-foreground">Manage your patient records and information</p>
              </div>

              <Card className="shadow-card border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Patient List
                    </CardTitle>
                    <CardDescription>View and manage all your patients</CardDescription>
                  </div>
                  <Button onClick={() => setShowForm(true)} className="gradient-primary shadow-elegant">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </CardHeader>
                <CardContent>
                  {showForm && (
                    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h3>
                        <Button type="button" onClick={resetForm} variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Name *</Label>
                          <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <div>
                          <Label>Age</Label>
                          <Input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <Label>Address</Label>
                          <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <Label>Medical History</Label>
                          <Textarea value={formData.medical_history} onChange={(e) => setFormData({...formData, medical_history: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <Button type="submit" className="w-full">{editingPatient ? 'Update Patient' : 'Add Patient'}</Button>
                        </div>
                      </div>
                    </form>
                  )}
                  <div className="space-y-4">
                    {patients.map((patient) => (
                      <div key={patient.id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                        <div>
                          <h3 className="font-semibold text-foreground">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">Email: {patient.email} | Phone: {patient.phone}</p>
                          <p className="text-sm text-muted-foreground">Age: {patient.age} | Address: {patient.address}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleEdit(patient)} size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDelete(patient.id)} size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {patients.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No patients found. Click "Add Patient" to create your first patient record.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DoctorPatients;