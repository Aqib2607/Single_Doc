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
import { FileText, Plus, Edit, Trash2, Download, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorRecords = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    patient_id: '',
    record_type: '',
    title: '',
    description: '',
    status: 'pending',
    record_date: ''
  });

  useEffect(() => {
    fetchRecords();
    fetchPatients();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/medical-records', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
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
    
    if (!formData.patient_id || !formData.record_type || !formData.title || !formData.record_date) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const url = editingRecord ? `/api/medical-records/${editingRecord.id}` : '/api/medical-records';
      const method = editingRecord ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await fetchRecords();
        resetForm();
        alert(editingRecord ? 'Record updated successfully!' : 'Record added successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        setError(errorData.message || 'Failed to save record');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      patient_id: record.patient_id?.toString() || '',
      record_type: record.record_type || '',
      title: record.title || '',
      description: record.description || '',
      status: record.status || 'pending',
      record_date: record.record_date || ''
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/medical-records/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          fetchRecords();
          alert('Record deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      patient_id: '', 
      record_type: '', 
      title: '', 
      description: '', 
      status: 'pending', 
      record_date: '' 
    });
    setEditingRecord(null);
    setShowForm(false);
    setError('');
  };

  return (
    <>
      <Helmet>
        <title>Medical Records - Doctor Dashboard</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-20">
          <DoctorSidebar />
          <main className="flex-1 px-6 py-8">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-8 animate-fade-in-up">
                <h1 className="text-4xl font-display font-bold text-gradient mb-4">Medical Records</h1>
                <p className="text-xl text-muted-foreground">Manage patient medical records and documents</p>
              </div>

              <Card className="shadow-card border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Patient Records
                    </CardTitle>
                    <CardDescription>View and manage medical documents</CardDescription>
                  </div>
                  <Button onClick={() => setShowForm(true)} className="gradient-primary shadow-elegant">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Record
                  </Button>
                </CardHeader>
                <CardContent>
                  {showForm && (
                    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingRecord ? 'Edit Record' : 'New Medical Record'}</h3>
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
                          <Label>Record Type *</Label>
                          <Select value={formData.record_type} onValueChange={(value) => setFormData({...formData, record_type: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Lab Report">Lab Report</SelectItem>
                              <SelectItem value="X-Ray">X-Ray</SelectItem>
                              <SelectItem value="MRI">MRI</SelectItem>
                              <SelectItem value="CT Scan">CT Scan</SelectItem>
                              <SelectItem value="Blood Test">Blood Test</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Title *</Label>
                          <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                        </div>
                        <div>
                          <Label>Record Date *</Label>
                          <Input type="date" value={formData.record_date} onChange={(e) => setFormData({...formData, record_date: e.target.value})} required />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="complete">Complete</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label>Description</Label>
                          <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Saving...' : (editingRecord ? 'Update Record' : 'Add Record')}
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                  <div className="space-y-4">
                    {records.map((record) => {
                      const patient = patients.find(p => p.id === record.patient_id);
                      const recordDate = new Date(record.record_date).toLocaleDateString();
                      
                      return (
                      <div key={record.id} className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {patient ? patient.name : `Patient ID: ${record.patient_id}`}
                          </h3>
                          <p className="text-sm text-primary font-medium">{record.title}</p>
                          <p className="text-sm text-muted-foreground">Type: {record.record_type} | Date: {recordDate}</p>
                          <p className={`text-sm capitalize ${
                            record.status === 'complete' ? 'text-green-600' : 
                            record.status === 'reviewed' ? 'text-blue-600' : 'text-yellow-600'
                          }`}>
                            Status: {record.status}
                          </p>
                          {record.description && (
                            <p className="text-sm text-muted-foreground mt-1 italic">{record.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleEdit(record)} size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDelete(record.id)} size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      );
                    })}
                    {records.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No medical records found. Click "Add Record" to create your first record.
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

export default DoctorRecords;