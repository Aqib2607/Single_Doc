import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSidebar from '@/components/DoctorSidebar';
import { Users, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);


  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError('');
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
        console.log('Patients data:', data);
        setPatients(data);
      } else {
        setError('Failed to load patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientId, patientName) => {
    console.log('Delete patient ID:', patientId, 'Name:', patientName);
    
    if (!patientId || patientId === undefined || patientId === null) {
      console.error('Invalid patient ID:', patientId);
      setError(`Invalid patient ID: ${patientId}`);
      return;
    }

    if (!confirm(`Are you sure you want to delete patient "${patientName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(patientId);
    setError('');

    try {
      const token = localStorage.getItem('token');
      console.log('Deleting patient with URL:', `/api/patients/${patientId}`);
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);
      if (response.ok) {
        await fetchPatients();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete patient' }));
        console.error('Delete error:', errorData);
        setError(errorData.message || 'Failed to delete patient. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError('Network error occurred while deleting patient');
    } finally {
      setDeletingId(null);
    }
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
                <p className="text-xl text-muted-foreground">View your patient records and information</p>
              </div>

              <Card className="shadow-card border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Patient List
                    </CardTitle>
                    <CardDescription>View all your patients</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      {error}
                    </div>
                  )}
                  {loading && (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading patients...
                    </div>
                  )}
                  <div className="space-y-4">
                    {patients.map((patient) => {
                      console.log('Patient object:', patient);
                      const patientId = patient.id || patient.patient_id || patient.user_id;
                      return (
                        <div key={patientId || Math.random()} className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">Email: {patient.email} | Phone: {patient.phone}</p>
                            <p className="text-sm text-muted-foreground">Age: {patient.age} | Address: {patient.address}</p>
                            {patient.medical_history && (
                              <p className="text-sm text-muted-foreground mt-1 italic">Medical History: {patient.medical_history}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">ID: {patientId || 'No ID found'}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button 
                              onClick={() => handleDelete(patientId, patient.name)} 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                              disabled={deletingId === patientId || !patientId}
                            >
                              {deletingId === patientId ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    {patients.length === 0 && !loading && (
                      <div className="text-center py-8 text-muted-foreground">
                        No patients found.
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