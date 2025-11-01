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
import { Stethoscope, Plus, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: '',
    consultation_date: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    follow_up_date: '',
    doctor_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchConsultations();
    fetchPatients();
  }, []);

  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching consultations with token:', token ? 'Present' : 'Missing');
      const response = await fetch('/api/consultations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Consultations response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Consultations data:', data);
        setConsultations(data);
      } else {
        const errorText = await response.text();
        console.error('Consultations error:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
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
    
    if (!formData.patient_id || !formData.consultation_date || !formData.diagnosis) {
      setError('Please fill in all required fields (Patient, Date, and Diagnosis)');
      return;
    }
    
    // Validate consultation date is not too far in the future
    const consultationDate = new Date(formData.consultation_date);
    const today = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setDate(today.getDate() + 30); // Allow up to 30 days in future
    
    if (consultationDate > maxFutureDate) {
      setError('Consultation date cannot be more than 30 days in the future');
      return;
    }
    
    // Validate follow-up date if provided
    if (formData.follow_up_date) {
      const followUpDate = new Date(formData.follow_up_date);
      if (followUpDate <= consultationDate) {
        setError('Follow-up date must be after the consultation date');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData
      };
      delete submitData.doctor_id; // Let backend handle doctor_id from auth
      
      console.log('Submitting consultation:', { submitData });
      
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(submitData)
      });
      
      if (response.ok) {
        await fetchConsultations();
        resetForm();
        setError('');
        setSuccess('Consultation added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        console.error('Error response:', errorData);
        setError(errorData.message || 'Failed to save consultation. Please try again.');
      }
    } catch (error) {
      console.error('Network error details:', error);
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (id) => {
    console.log('Delete consultation ID:', id);
    if (!id) {
      alert('Invalid consultation ID');
      return;
    }
    
    if (confirm('Are you sure you want to delete this consultation?')) {
      try {
        const token = localStorage.getItem('token');
        console.log('Deleting consultation with URL:', `/api/consultations/${id}`);
        const response = await fetch(`/api/consultations/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          fetchConsultations();
          alert('Consultation deleted successfully!');
        } else {
          console.error('Delete failed with status:', response.status);
          alert('Failed to delete consultation');
        }
      } catch (error) {
        console.error('Error deleting consultation:', error);
        alert('Error deleting consultation');
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      patient_id: '', 
      consultation_date: '', 
      diagnosis: '', 
      treatment: '', 
      notes: '', 
      follow_up_date: '',
      doctor_id: ''
    });
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  return (
    <>
      <Helmet>
        <title>Consultations - Doctor Dashboard</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-20">
          <DoctorSidebar />
          <main className="flex-1 px-6 py-8">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-8 animate-fade-in-up">
                <h1 className="text-4xl font-display font-bold text-gradient mb-4">Consultations</h1>
                <p className="text-xl text-muted-foreground">Manage patient consultations and diagnoses</p>
              </div>

              <Card className="shadow-card border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Consultation Records
                    </CardTitle>
                    <CardDescription>View and manage consultation history</CardDescription>
                  </div>
                  <Button onClick={() => setShowForm(true)} className="gradient-primary shadow-elegant">
                    <Plus className="h-4 w-4 mr-2" />
                    New Consultation
                  </Button>
                </CardHeader>
                <CardContent>
                  {showForm && (
                    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">New Consultation</h3>
                        <Button type="button" onClick={resetForm} variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                          {success}
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
                                <SelectItem key={patient.patient_id} value={patient.patient_id.toString()}>{patient.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Consultation Date *</Label>
                          <Input 
                            type="date" 
                            value={formData.consultation_date} 
                            onChange={(e) => setFormData({...formData, consultation_date: e.target.value})} 
                            max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                            required 
                          />
                        </div>
                        <div>
                          <Label>Diagnosis *</Label>
                          <Input value={formData.diagnosis} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} required />
                        </div>
                        <div>
                          <Label>Treatment</Label>
                          <Input value={formData.treatment} onChange={(e) => setFormData({...formData, treatment: e.target.value})} />
                        </div>
                        <div>
                          <Label>Follow-up Date</Label>
                          <Input 
                            type="date" 
                            value={formData.follow_up_date} 
                            onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})} 
                            min={formData.consultation_date || new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Notes</Label>
                          <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Saving...' : 'Add Consultation'}
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                  <div className="space-y-4">
                    {consultations.map((consultation) => {
                      const patient = patients.find(p => p.patient_id === consultation.patient_id);
                      const consultationDate = new Date(consultation.consultation_date).toLocaleDateString();
                      const followUpDate = consultation.follow_up_date ? new Date(consultation.follow_up_date).toLocaleDateString() : null;
                      
                      return (
                        <div key={consultation.id} className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {patient ? patient.name : `Patient ID: ${consultation.patient_id}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">Date: {consultationDate}</p>
                            <p className="text-sm text-primary font-medium">Diagnosis: {consultation.diagnosis}</p>
                            {consultation.treatment && (
                              <p className="text-sm text-muted-foreground">Treatment: {consultation.treatment}</p>
                            )}
                            {followUpDate && (
                              <p className="text-sm text-blue-600">Follow-up: {followUpDate}</p>
                            )}
                            {consultation.notes && (
                              <p className="text-sm text-muted-foreground mt-1 italic">{consultation.notes}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleDelete(consultation.id)} size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    {consultations.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No consultations found. Click "New Consultation" to create your first consultation record.
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

export default DoctorConsultations;