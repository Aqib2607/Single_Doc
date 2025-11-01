import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, FileText, Pill, Heart, Clock, User, Activity, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecentAppointments from '@/components/RecentAppointments';
import PatientPrescriptions from '@/components/PatientPrescriptions';

import MedicalRecordsModal from '@/components/MedicalRecordsModal';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/patient-appointments', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          setPrescriptions([]);
          return;
        }
        
        const response = await fetch('/api/patient/prescriptions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setPrescriptions(data);
        } else {
          console.error('Failed to fetch prescriptions:', response.status, response.statusText);
          setPrescriptions([]);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchMedicalRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          setMedicalRecords([]);
          return;
        }
        
        const response = await fetch('/api/patient-medical-records', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setMedicalRecords(data);
        } else {
          console.error('Failed to fetch medical records:', response.status, response.statusText);
          setMedicalRecords([]);
        }
      } catch (error) {
        console.error('Error fetching medical records:', error);
        setMedicalRecords([]);
      }
    };

    if (user?.email) {
      fetchAppointments();
      fetchPrescriptions();
      fetchMedicalRecords();
    }
  }, [user?.email]);

  const upcomingAppointments = appointments.filter(apt => new Date(apt.appointment_date) >= new Date());
  
  // Filter active prescriptions (not expired and marked as active)
  const activePrescriptions = prescriptions.filter(prescription => {
    const isNotExpired = !prescription.end_date || new Date(prescription.end_date) >= new Date();
    return prescription.is_active && isNotExpired;
  });
  
  const stats = [
    { icon: Calendar, label: 'Upcoming Appointments', value: upcomingAppointments.length.toString(), color: 'text-primary' },
    { icon: Pill, label: 'Active Prescriptions', value: activePrescriptions.length.toString(), color: 'text-primary' },
    { icon: FileText, label: 'Medical Records', value: medicalRecords.length.toString(), color: 'text-primary' },

  ];

  return (
    <>
      <Helmet>
        <title>Patient Dashboard - Healthcare Portal</title>
        <meta name="description" content="Manage your healthcare appointments and records" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 px-4 py-8">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">Welcome, {user?.name}!</h1>
              <p className="text-xl text-muted-foreground">Here's your health dashboard overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <Card key={index} className="shadow-card border-border bg-card hover:shadow-elegant transition-smooth animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">{stat.label}</CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <RecentAppointments />
              </div>
              
              <div className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <PatientPrescriptions />
              </div>
            </div>
            


            <div className="mt-12">
              <Card className="shadow-card border-border bg-card animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Medical Records
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">Your recent medical records and test results</CardDescription>
                  </div>
                  <MedicalRecordsModal />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-4 text-muted-foreground">Loading medical records...</div>
                    ) : medicalRecords.length > 0 ? (
                      medicalRecords.slice(0, 3).map((record) => (
                        <div key={record.id} className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              record.status === 'complete' ? 'bg-green-500' : 
                              record.status === 'reviewed' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}></div>
                            <div>
                              <p className="font-semibold text-foreground">{record.title}</p>
                              <p className="text-sm text-muted-foreground">{record.record_type}</p>
                              {record.description && (
                                <p className="text-sm text-muted-foreground mt-1">{record.description}</p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(record.record_date).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-primary mt-1 capitalize">{record.status}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No medical records available</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PatientDashboard;
