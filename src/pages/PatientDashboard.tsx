import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, FileText, Pill, Heart, Clock, User, Activity, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
        const response = await fetch('/api/patient-prescriptions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPrescriptions(data);
        } else {
          setPrescriptions([]);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        // amazonq-ignore-next-line
        setLoading(false);
      }
    };

    const fetchMedicalRecords = async () => {
      try {
        const token = localStorage.getItem('token');
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
          setMedicalRecords([]);
        }
      } catch (error) {
        console.error('Error fetching medical records:', error);
      }
    };

    if (user?.email) {
      fetchAppointments();
      fetchPrescriptions();
      fetchMedicalRecords();
    }
  }, [user?.email]);

  const upcomingAppointments = appointments.filter(apt => new Date(apt.appointment_date) >= new Date());
  
  const stats = [
    { icon: Calendar, label: 'Upcoming Appointments', value: upcomingAppointments.length.toString(), color: 'text-primary' },
    { icon: Pill, label: 'Active Prescriptions', value: prescriptions.length.toString(), color: 'text-primary' },
    { icon: FileText, label: 'Medical Records', value: medicalRecords.length.toString(), color: 'text-primary' },
    { icon: Heart, label: 'Health Score', value: '85%', color: 'text-primary' },
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
              <Card className="shadow-card border-border bg-card animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Recent Appointments
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">Your upcoming medical appointments</CardDescription>
                  </div>
                  <Link to="/appointment">
                    <Button size="sm" className="gradient-primary shadow-elegant hover:shadow-glow">
                      <Plus className="h-4 w-4 mr-2" />
                      Book New
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-4 text-muted-foreground">Loading appointments...</div>
                    ) : upcomingAppointments.length > 0 ? (
                      upcomingAppointments.slice(0, 2).map((appointment, index) => (
                        <div key={appointment.id} className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse"></div>
                            <div>
                              <p className="font-semibold text-foreground">{appointment.reason || 'General Consultation'}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {appointment.doctor}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                              </p>
                              <p className="text-xs text-primary mt-1 capitalize">{appointment.status}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No upcoming appointments</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border bg-card animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Pill className="h-5 w-5 text-primary" />
                      Active Prescriptions
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">Your current medications</CardDescription>
                  </div>
                  <Link to="/prescriptions">
                    <Button size="sm" variant="outline" className="border-border">
                      <Activity className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-4 text-muted-foreground">Loading prescriptions...</div>
                    ) : prescriptions.length > 0 ? (
                      prescriptions.slice(0, 2).map((prescription) => (
                        <div key={prescription.id} className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-semibold text-foreground">{prescription.medication_name} {prescription.dosage}</p>
                              <p className="text-sm text-muted-foreground">{prescription.frequency}</p>
                              {prescription.instructions && (
                                <p className="text-sm text-muted-foreground">{prescription.instructions}</p>
                              )}
                              <p className="text-sm text-primary mt-1">Refills: {prescription.refills_remaining} remaining</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No active prescriptions</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <Card className="shadow-card border-border bg-card animate-fade-in-up" style={{animationDelay: '0.7s'}}>
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Health Overview
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Your recent health metrics and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">120/80</div>
                      <div className="text-sm text-muted-foreground">Blood Pressure</div>
                      <div className="text-xs text-green-600 mt-1">Normal</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">72</div>
                      <div className="text-sm text-muted-foreground">Heart Rate</div>
                      <div className="text-xs text-green-600 mt-1">Good</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">98.6°F</div>
                      <div className="text-sm text-muted-foreground">Temperature</div>
                      <div className="text-xs text-green-600 mt-1">Normal</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  {medicalRecords.length > 3 && (
                    <Link to="/medical-records">
                      <Button size="sm" variant="outline" className="border-border">
                        <FileText className="h-4 w-4 mr-2" />
                        View More
                      </Button>
                    </Link>
                  )}
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
