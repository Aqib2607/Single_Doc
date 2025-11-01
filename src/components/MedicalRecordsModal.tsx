import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Calendar, AlertTriangle, CheckCircle, Clock, Eye, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MedicalRecord {
  id: number;
  title: string;
  record_type: string;
  description?: string;
  record_date: string;
  status: string;
  critical_flag?: boolean;
  doctor_name?: string;
}

interface Patient {
  patient_id: number;
  name: string;
  email: string;
  role: 'patient';
}

interface Doctor {
  doctor_id: number;
  name: string;
  email: string;
  role: 'doctor';
}

interface MedicalRecordsModalProps {
  triggerButton?: React.ReactNode;
}

const MedicalRecordsModal: React.FC<MedicalRecordsModalProps> = ({ triggerButton }) => {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const fetchAllRecords = useCallback(async () => {
    if (!user || user.role !== 'patient') {
      setError('Invalid patient access');
      return;
    }
    
    const patientId = (user as unknown as Patient).patient_id;
    if (!patientId) {
      setError('Invalid patient ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch('/api/patient-medical-records', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecords(data || []);
      } else if (response.status === 404) {
        setRecords([]);
      } else {
        throw new Error(`Failed to load records (${response.status})`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load medical records';
      setError(errorMessage);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (open) {
      fetchAllRecords();
      setSuccessMessage(''); // Clear success message when modal opens
    }
  }, [open, fetchAllRecords]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'reviewed': return <Eye className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  const handleDelete = async (recordId: number) => {
    setActionLoading(recordId);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`/api/medical-records/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const recordTitle = records.find(r => r.id === recordId)?.title;
        setRecords(prev => prev.filter(record => record.id !== recordId));
        setDeleteConfirm(null);
        setSuccessMessage(`Record "${recordTitle}" has been deleted successfully.`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        let errorMessage = 'Failed to delete record';
        if (response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to delete this record.';
        } else if (response.status === 404) {
          errorMessage = 'Record not found. It may have already been deleted.';
        }
        throw new Error(errorMessage);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while deleting the record.';
      console.error('[Delete] Error:', errorMessage, error);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const defaultTrigger = (
    <Button size="sm" variant="outline" className="border-border">
      <FileText className="h-4 w-4 mr-2" />
      View All Medical Records
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || defaultTrigger}
      </DialogTrigger>
      <DialogContent 
        className="max-w-4xl max-h-[85vh]"
        aria-labelledby="medical-records-title"
        aria-describedby="medical-records-description"
      >
        <DialogHeader>
          <DialogTitle id="medical-records-title" className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            All Medical Records
            {user && user.role === 'patient' && (
              <Badge variant="outline" className="ml-2">
                Patient ID: {(user as unknown as Patient).patient_id}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div id="medical-records-description" className="sr-only">
          Complete list of medical records for the current patient
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        <ScrollArea className="h-[60vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <div>Loading medical records...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={fetchAllRecords} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-4 opacity-50" />
              <div>No medical records found for this patient</div>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div 
                  key={record.id} 
                  className="border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      {record.critical_flag && (
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">
                          {record.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {record.record_type}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(record.status)}`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(record.status)}
                              {record.status}
                            </span>
                          </Badge>
                          {record.critical_flag && (
                            <Badge variant="destructive" className="text-xs">
                              Critical
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(record.record_date)}
                      </div>
                      <div className="flex items-center gap-2">
                        {deleteConfirm === record.id ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(record.id)}
                              disabled={actionLoading === record.id}
                              className="h-8 px-2"
                              aria-label="Confirm delete"
                            >
                              {actionLoading === record.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                'Confirm'
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(null)}
                              className="h-8 px-2"
                              aria-label="Cancel delete"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteConfirm(record.id)}
                            disabled={actionLoading === record.id}
                            className="h-8 px-2"
                            aria-label={`Delete record: ${record.title}`}
                            title="Delete this medical record permanently"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {record.description && (
                    <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                      {record.description}
                    </p>
                  )}
                  
                  {record.doctor_name && (
                    <p className="text-xs text-muted-foreground">
                      Doctor: {record.doctor_name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {records.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t border-border text-sm text-muted-foreground">
            <span>Total Records: {records.length}</span>
            <span>Last Updated: {new Date().toLocaleString()}</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordsModal;