import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ArrowUpDown, Calendar, Activity, AlertCircle } from 'lucide-react';
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
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  last_updated: string;
}

const VitalsTable: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [sortBy, setSortBy] = useState<'vital_type' | 'recorded_at'>('recorded_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [initialized, setInitialized] = useState(false);

  const vitalTypeLabels: Record<string, string> = {
    blood_pressure_systolic: 'Blood Pressure (Systolic)',
    blood_pressure_diastolic: 'Blood Pressure (Diastolic)',
    heart_rate: 'Heart Rate',
    temperature: 'Temperature',
    respiratory_rate: 'Respiratory Rate',
    oxygen_saturation: 'Oxygen Saturation'
  };

  const fetchVitals = useCallback(async () => {
    // Don't fetch if auth is still loading or user is not available
    if (authLoading || !user) {
      console.log('VitalsTable: Waiting for auth or user not available', { authLoading, user: !!user });
      return;
    }

    // Check if user has the required ID field
    const patientId = user.id || user.patient_id;
    if (!patientId) {
      console.error('VitalsTable: No patient ID found in user object', { user });
      setError('Patient ID not found. Please log in again.');
      setLoading(false);
      return;
    }
    
    console.log('VitalsTable: Fetching vitals for patient ID:', patientId);
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const url = `/api/patients/${patientId}/vitals?sort_by=${sortBy}&sort_order=${sortOrder}`;
      console.log('VitalsTable: Making request to:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('VitalsTable: API response status:', response.status, response.statusText);

      if (response.ok) {
        const data: VitalsResponse = await response.json();
        console.log('VitalsTable: Received vitals data:', {
          dataCount: data.data?.length || 0,
          pagination: data.pagination,
          lastUpdated: data.last_updated
        });
        setVitals(data.data || []);
        setLastUpdated(data.last_updated);
        setError('');
      } else {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = await response.text() || errorMessage;
        }
        console.error('VitalsTable: API error response:', response.status, errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('VitalsTable: Error fetching vitals:', error);
      if (error.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else if (error.message?.includes('401')) {
        setError('Authentication expired. Please log in again.');
      } else if (error.message?.includes('403')) {
        setError('Access denied. You can only view your own vitals.');
      } else {
        setError(error.message || 'Failed to load vitals data. Please try again.');
      }
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [user, authLoading, sortBy, sortOrder]);

  useEffect(() => {
    if (!authLoading && user && !initialized) {
      fetchVitals();
    }
  }, [fetchVitals, authLoading, user, initialized]);

  useEffect(() => {
    if (initialized && user) {
      fetchVitals();
    }
  }, [sortBy, sortOrder, initialized, user, fetchVitals]);

  const handleSort = (column: 'vital_type' | 'recorded_at') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatValue = (vital: Vital) => {
    return `${vital.value} ${vital.unit}`;
  };

  return (
    <Card className="shadow-card border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Vital Signs
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your recent vital measurements and health indicators
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Last updated: {formatDateTime(lastUpdated)}
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={fetchVitals}
            disabled={loading}
            className="border-border"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {authLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-pulse">Authenticating...</div>
          </div>
        ) : loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading vitals...
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <Button onClick={fetchVitals} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : vitals.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('vital_type')}
                      className="h-auto p-0 font-semibold"
                    >
                      Vital Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('recorded_at')}
                      className="h-auto p-0 font-semibold"
                    >
                      Recorded At
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Recorded By</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vitals.map((vital) => (
                  <TableRow key={vital.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {vitalTypeLabels[vital.vital_type] || vital.vital_type}
                    </TableCell>
                    <TableCell>{formatValue(vital)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={vital.is_abnormal ? "destructive" : "secondary"}
                        className={vital.is_abnormal ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                      >
                        {vital.is_abnormal ? 'Abnormal' : 'Normal'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDateTime(vital.recorded_at)}
                      </div>
                    </TableCell>
                    <TableCell>{vital.recorded_by || 'System'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {vital.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No vital signs recorded yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalsTable;