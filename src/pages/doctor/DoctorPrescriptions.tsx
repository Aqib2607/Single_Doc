import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSidebar from '@/components/DoctorSidebar';
import { ClipboardList, Plus, Edit, Trash2, Pill, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    patient_id: '',
    medication_name: '',
    dosage: '',
    frequency: '',
    instructions: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/prescriptions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

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
    setError('');
    
    if (!formData.patient_id || !formData.medication_name || !formData.dosage || !formData.frequency || !formData.start_date) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const url = editingPrescription ? `/api/prescriptions/${editingPrescription.id}` : '/api/prescriptions';
      const method = editingPrescription ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await fetchPrescriptions();
        resetForm();
        alert(editingPrescription ? 'Prescription updated successfully!' : 'Prescription added successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        setError(errorData.message || 'Failed to save prescription');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prescription) => {
    setEditingPrescription(prescription);
    setFormData({
      patient_id: prescription.patient_id?.toString() || '',
      medication_name: prescription.medication_name || '',
      dosage: prescription.dosage || '',
      frequency: prescription.frequency || '',
      instructions: prescription.instructions || '',
      start_date: prescription.start_date || '',
      end_date: prescription.end_date || '',
      is_active: prescription.is_active ?? true
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this prescription?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/prescriptions/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          fetchPrescriptions();
          alert('Prescription deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting prescription:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      patient_id: '', 
      medication_name: '', 
      dosage: '', 
      frequency: '', 
      instructions: '', 
      start_date: '', 
      end_date: '', 
      is_active: true 
    });
    setEditingPrescription(null);
    setShowForm(false);
    setError('');
  };

  return (
    <>
      <Helmet>
        <title>Prescriptions - Doctor Dashboard</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-20">
          <DoctorSidebar />
          <main className="flex-1 px-6 py-8">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-8 animate-fade-in-up">
                <h1 className="text-4xl font-display font-bold text-gradient mb-4">Prescriptions</h1>
                <p className="text-xl text-muted-foreground">Manage patient prescriptions and medications</p>
              </div>

              <Card className="shadow-card border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      Active Prescriptions
                    </CardTitle>
                    <CardDescription>View and manage patient medications</CardDescription>
                  </div>
                  <Button onClick={() => setShowForm(true)} className="gradient-primary shadow-elegant">
                    <Plus className="h-4 w-4 mr-2" />
                    New Prescription
                  </Button>
                </CardHeader>
                <CardContent>
                  {showForm && (
                    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingPrescription ? 'Edit Prescription' : 'New Prescription'}</h3>
                        <Button type="button" onClick={resetForm} variant="ghost" size="sm">
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
                          <Label>Patient *</Label>
                          <Select value={formData.patient_id} onValueChange={(value) => setFormData({...formData, patient_id: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient" />
                            </SelectTrigger>
                            <SelectContent>
                              {patients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id.toString()}>{patient.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Medication Name *</Label>
                          <Input value={formData.medication_name} onChange={(e) => setFormData({...formData, medication_name: e.target.value})} required />
                        </div>
                        <div>
                          <Label>Dosage *</Label>
                          <Input value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})} placeholder="e.g., 100mg" required />
                        </div>
                        <div>
                          <Label>Frequency *</Label>
                          <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Once daily">Once daily</SelectItem>
                              <SelectItem value="Twice daily">Twice daily</SelectItem>
                              <SelectItem value="Three times daily">Three times daily</SelectItem>
                              <SelectItem value="Four times daily">Four times daily</SelectItem>
                              <SelectItem value="As needed">As needed</SelectItem>
                              <SelectItem value="Weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Start Date *</Label>
                          <Input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} required />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <Label>Instructions</Label>
                          <Textarea value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} placeholder="Special instructions for the patient" />
                        </div>
                        <div className="col-span-2">
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Saving...' : (editingPrescription ? 'Update Prescription' : 'Add Prescription')}
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => {
                      const patient = patients.find(p => p.id === prescription.patient_id);
                      const startDate = new Date(prescription.start_date).toLocaleDateString();
                      const endDate = prescription.end_date ? new Date(prescription.end_date).toLocaleDateString() : null;
                      
                      return (
                      <div key={prescription.id} className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                        <div className="flex items-center gap-3">
                          <Pill className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {patient ? patient.name : `Patient ID: ${prescription.patient_id}`}
                            </h3>
                            <p className="text-sm text-primary font-medium">{prescription.medication_name}</p>
                            <p className="text-sm text-muted-foreground">Dosage: {prescription.dosage} | Frequency: {prescription.frequency}</p>
                            <p className="text-sm text-muted-foreground">Start: {startDate}{endDate ? ` | End: ${endDate}` : ''}</p>
                            {prescription.instructions && (
                              <p className="text-sm text-muted-foreground mt-1 italic">{prescription.instructions}</p>
                            )}
                            <p className={`text-xs mt-1 ${prescription.is_active ? 'text-green-600' : 'text-red-600'}`}>
                              {prescription.is_active ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleEdit(prescription)} size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDelete(prescription.id)} size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      );
                    })}
                    {prescriptions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No prescriptions found. Click "New Prescription" to create your first prescription.
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

export default DoctorPrescriptions;