import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Pill, Calendar, User, Clock, AlertCircle, Loader2, FileText, Eye } from 'lucide-react';

interface Prescription {
  id: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  refills_remaining: number;
  created_at: string;
  is_expired?: boolean;
  is_currently_active?: boolean;
}

const PatientPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/patient/prescriptions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }

      const data = await response.json();
      setPrescriptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (prescription: Prescription) => {
    // Use computed fields from API if available, fallback to client-side calculation
    const isExpired = prescription.is_expired ?? 
                     (prescription.end_date && new Date(prescription.end_date) < new Date());
    const isCurrentlyActive = prescription.is_currently_active ?? 
                             (prescription.is_active && !isExpired);
    
    if (isExpired) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
          Expired
        </span>
      );
    }
    
    if (isCurrentlyActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            My Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading prescriptions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            My Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestPrescription = prescriptions[0];
  const hasMorePrescriptions = prescriptions.length > 1;

  const PrescriptionCard = ({ prescription, isLatest = false }: { prescription: Prescription; isLatest?: boolean }) => (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white ${
      isLatest ? 'ring-2 ring-blue-100' : ''
    }`}>
      {isLatest && hasMorePrescriptions && (
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
            Most Recent
          </span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {prescription.medication_name}
          </h3>
          <p className="text-sm text-gray-600">
            {prescription.dosage} • {prescription.frequency}
          </p>
        </div>
        {getStatusBadge(prescription)}
      </div>

      {prescription.instructions && (
        <div className="mb-3">
          <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded border-l-4 border-blue-200">
            <strong>Instructions:</strong> {prescription.instructions}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div>
            <span className="text-gray-600">Start Date:</span>
            <p className="font-medium">{formatDate(prescription.start_date)}</p>
          </div>
        </div>

        {prescription.end_date && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <span className="text-gray-600">End Date:</span>
              <p className="font-medium">{formatDate(prescription.end_date)}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Pill className="h-4 w-4 text-gray-500" />
          <div>
            <span className="text-gray-600">Refills:</span>
            <p className="font-medium">
              {prescription.refills_remaining} remaining
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <User className="h-3 w-3" />
          <span>Prescribed on {formatDate(prescription.created_at)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          My Prescriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {prescriptions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No prescriptions found</p>
            <p className="text-sm text-gray-500">Your prescription history will appear here</p>
          </div>
        ) : (
          <>
            <PrescriptionCard prescription={latestPrescription} isLatest={true} />
            
            {hasMorePrescriptions && (
              <div className="mt-4 text-center">
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="hover:bg-blue-50 hover:border-blue-300 transition-colors duration-300"
                      aria-label={`View all ${prescriptions.length} prescriptions`}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View All ({prescriptions.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent 
                    className="max-w-[90vw] md:max-w-[60vw] max-h-[90vh] transition-all duration-300 ease-in-out"
                    aria-labelledby="prescriptions-modal-title"
                    aria-describedby="prescriptions-modal-description"
                  >
                    <DialogHeader>
                      <DialogTitle id="prescriptions-modal-title" className="flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        All Prescriptions ({prescriptions.length})
                      </DialogTitle>
                    </DialogHeader>
                    <div id="prescriptions-modal-description" className="sr-only">
                      Complete list of all your prescriptions with details
                    </div>
                    <ScrollArea className="h-[70vh] pr-4">
                      <div className="space-y-4">
                        {prescriptions.map((prescription) => (
                          <PrescriptionCard key={prescription.id} prescription={prescription} />
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientPrescriptions;