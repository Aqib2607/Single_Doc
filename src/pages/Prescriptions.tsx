import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Pill, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPrescriptions();
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Prescriptions - Healthcare Portal</title>
        <meta name="description" content="View all your active prescriptions and medications" />
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
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">Prescriptions</h1>
              <p className="text-xl text-muted-foreground">Manage your active medications and prescriptions</p>
            </div>

            <Card className="shadow-card border-border bg-card animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Active Prescriptions ({prescriptions.length})
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your current medications with dosage instructions and refill information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading prescriptions...</div>
                  ) : prescriptions.length > 0 ? (
                    prescriptions.map((prescription) => (
                      <div key={prescription.id} className="flex justify-between items-start p-6 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                        <div className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-foreground text-lg">
                                {prescription.medication_name} {prescription.dosage}
                              </h3>
                              <span className="text-sm text-muted-foreground">
                                Started: {new Date(prescription.start_date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-primary font-medium mb-2">{prescription.frequency}</p>
                            {prescription.instructions && (
                              <p className="text-sm text-muted-foreground mb-3">{prescription.instructions}</p>
                            )}
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-primary">
                                Refills: {prescription.refills_remaining} remaining
                              </span>
                              {prescription.end_date && (
                                <span className="text-sm text-muted-foreground">
                                  Until: {new Date(prescription.end_date).toLocaleDateString()}
                                </span>
                              )}
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No active prescriptions</p>
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

export default Prescriptions;