import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Activity, Eye, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Vital {
  id: number;
  vital_type: string;
  value: number;
  unit: string;
  recorded_at: string;
  recorded_by: string | null;
  notes: string | null;
  is_abnormal: boolean;
}

interface VitalsResponse {
  data: Vital[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
  last_updated: string;
}

const VitalsOverview: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);

  const vitalTypeLabels: Record<string, string> = {
    blood_pressure_systolic: 'Blood Pressure (Systolic)',
    blood_pressure_diastolic: 'Blood Pressure (Diastolic)',
    heart_rate: 'Heart Rate',
    temperature: 'Temperature',
    respiratory_rate: 'Respiratory Rate',
    oxygen_saturation: 'Oxygen Saturation'
  };

  const priorityVitals = ['heart_rate', 'blood_pressure_systolic', 'temperature', 'respiratory_rate', 'oxygen_saturation'];

  const fetchVitals = useCallback(async () => {
    if (authLoading || !user) return;

    const patientId = user.id || user.patient_id;
    if (!patientId) {
      setError('Patient ID not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`/api/patients/${patientId}/vitals?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data: VitalsResponse = await response.json();
        setVitals(data.data || []);
        setLastUpdated(data.last_updated);
      } else {
        throw new Error(`API returned ${response.status}`);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load vitals');
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchVitals();
    }
  }, [fetchVitals, authLoading, user]);

  const getLatestVitalByType = (type: string) => {
    return vitals
      .filter(v => v.vital_type === type)
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0];
  };

  const getDisplayVitals = () => {
    return priorityVitals.map(type => getLatestVitalByType(type)).filter(Boolean);
  };

  const getAllVitalsByType = () => {
    const grouped: Record<string, Vital[]> = {};
    vitals.forEach(vital => {
      if (!grouped[vital.vital_type]) grouped[vital.vital_type] = [];
      grouped[vital.vital_type].push(vital);
    });
    
    Object.keys(grouped).forEach(type => {
      grouped[type].sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
    });

    return Object.keys(grouped)
      .sort((a, b) => (vitalTypeLabels[a] || a).localeCompare(vitalTypeLabels[b] || b))
      .map(type => ({ type, vitals: grouped[type] }));
  };

  const formatValue = (vital: Vital) => `${vital.value} ${vital.unit}`;
  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString();

  if (authLoading) {
    return (
      <Card className="shadow-card border-border bg-card">
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">Authenticating...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Vital Signs
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your most recent vital measurements
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Updated: {formatDateTime(lastUpdated)}
            </span>
          )}
          <Button size="sm" variant="outline" onClick={fetchVitals} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
            Loading vitals...
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-5 w-5 text-red-600 mx-auto mb-2" />
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={fetchVitals} variant="outline" size="sm">Try Again</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
              {getDisplayVitals().map((vital, index) => (
                <div key={vital.id} className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">{formatValue(vital)}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {vitalTypeLabels[vital.vital_type] || vital.vital_type}
                  </div>
                  <Badge
                    variant={vital.is_abnormal ? "destructive" : "secondary"}
                    className={`text-xs ${vital.is_abnormal ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                  >
                    {vital.is_abnormal ? 'Abnormal' : 'Normal'}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(vital.recorded_at)}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-border"
                    onKeyDown={(e) => e.key === 'Enter' && setModalOpen(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All Vitals
                  </Button>
                </DialogTrigger>
                <DialogContent 
                  className="max-w-4xl max-h-[80vh]"
                  onKeyDown={(e) => e.key === 'Escape' && setModalOpen(false)}
                >
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Complete Vital Signs History
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-6">
                      {getAllVitalsByType().map(({ type, vitals: typeVitals }) => (
                        <div key={type} className="border-b border-border pb-4 last:border-b-0">
                          <h3 className="font-semibold text-lg mb-3 text-foreground">
                            {vitalTypeLabels[type] || type}
                          </h3>
                          <div className="grid gap-2">
                            {typeVitals.slice(0, 10).map((vital) => (
                              <div key={vital.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="font-medium text-primary">{formatValue(vital)}</div>
                                  <Badge
                                    variant={vital.is_abnormal ? "destructive" : "secondary"}
                                    className={`text-xs ${vital.is_abnormal ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                                  >
                                    {vital.is_abnormal ? 'Abnormal' : 'Normal'}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {formatDateTime(vital.recorded_at)}
                                </div>
                              </div>
                            ))}
                            {typeVitals.length > 10 && (
                              <div className="text-center text-sm text-muted-foreground py-2">
                                ... and {typeVitals.length - 10} more records
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>

            {vitals.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No vital signs recorded yet
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalsOverview;