import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MedicalRecords = () => {
  const { user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        }
      } catch (error) {
        console.error('Error fetching medical records:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMedicalRecords();
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Medical Records - Healthcare Portal</title>
        <meta name="description" content="View all your medical records and test results" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 px-4 py-8">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8 animate-fade-in-up">
              <Link to="/patient-dashboard">
                <Button variant="outline" size="sm" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">Medical Records</h1>
              <p className="text-xl text-muted-foreground">Complete history of your medical records and test results</p>
            </div>

            <Card className="shadow-card border-border bg-card animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  All Medical Records ({medicalRecords.length})
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your complete medical history including tests, consultations, and procedures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading medical records...</div>
                  ) : medicalRecords.length > 0 ? (
                    medicalRecords.map((record) => (
                      <div key={record.id} className="flex justify-between items-start p-6 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                        <div className="flex items-start gap-4">
                          <div className={`w-3 h-3 rounded-full mt-2 ${
                            record.status === 'complete' ? 'bg-green-500' : 
                            record.status === 'reviewed' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-foreground text-lg">{record.title}</h3>
                              <span className="text-sm text-muted-foreground">
                                {new Date(record.record_date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-primary font-medium mb-2">{record.record_type}</p>
                            {record.description && (
                              <p className="text-sm text-muted-foreground mb-3">{record.description}</p>
                            )}
                            <div className="flex items-center gap-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                record.status === 'complete' ? 'bg-green-100 text-green-800' : 
                                record.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                              {record.file_path && (
                                <Button variant="outline" size="sm">
                                  <FileText className="h-3 w-3 mr-1" />
                                  View File
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No medical records available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MedicalRecords;