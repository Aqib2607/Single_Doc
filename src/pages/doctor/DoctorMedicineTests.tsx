import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSidebar from '@/components/DoctorSidebar';
import { Pill, TestTube, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorMedicineTests = () => {
  const [medicines, setMedicines] = useState([]);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetchMedicines();
    fetchTests();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch('/api/medicines');
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
      const response = await fetch('/api/tests');
      if (response.ok) {
        const data = await response.json();
        setTests(data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
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
                <p className="text-xl text-muted-foreground">View available medicines and diagnostic tests</p>
              </div>

              <Tabs defaultValue="medicines" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="medicines">Medicines</TabsTrigger>
                  <TabsTrigger value="tests">Tests</TabsTrigger>
                </TabsList>

                <TabsContent value="medicines">
                  <Card className="shadow-card border-border bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-primary" />
                        Medicine Inventory
                      </CardTitle>
                      <CardDescription>View available medicines</CardDescription>
                    </CardHeader>
                    <CardContent>
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

                          </div>
                        ))}
                        {medicines.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No medicines available.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tests">
                  <Card className="shadow-card border-border bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TestTube className="h-5 w-5 text-primary" />
                        Diagnostic Tests
                      </CardTitle>
                      <CardDescription>View available diagnostic tests</CardDescription>
                    </CardHeader>
                    <CardContent>
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

                          </div>
                        ))}
                        {tests.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No tests available.
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