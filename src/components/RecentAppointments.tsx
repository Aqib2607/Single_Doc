import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import ConfirmDialog from './ui/ConfirmDialog';
import AllAppointmentsModal from './AllAppointmentsModal';
import { Calendar, Clock, User, Phone, AlertCircle, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react';

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  doctor: string;
  consultation_type: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

const RecentAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; appointmentId: number | null }>({ isOpen: false, appointmentId: null });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patient-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      await fetchAppointments(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (appointmentId: number) => {
    setDeleteDialog({ isOpen: true, appointmentId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.appointmentId) return;
    
    setDeletingId(deleteDialog.appointmentId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/appointments/${deleteDialog.appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete appointment');
      }

      setSuccessMessage('Appointment deleted successfully');
      await fetchAppointments(); // Refresh the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete appointment');
    } finally {
      setDeletingId(null);
      setDeleteDialog({ isOpen: false, appointmentId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, appointmentId: null });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Appointments
            </CardTitle>
            <AllAppointmentsModal />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading appointments...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Appointments
            </CardTitle>
            <AllAppointmentsModal />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchAppointments} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Appointments
          </CardTitle>
          <AllAppointmentsModal />
        </div>
      </CardHeader>
      <CardContent>
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          </div>
        )}
        
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No appointments found</p>
            <p className="text-sm text-gray-500">Your upcoming appointments will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{appointment.doctor}</span>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    <span className="capitalize">{appointment.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(appointment.appointment_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(appointment.appointment_time)}</span>
                  </div>
                </div>

                {appointment.consultation_type && (
                  <div className="mb-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {appointment.consultation_type.replace('-', ' ')}
                    </span>
                  </div>
                )}

                {appointment.reason && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 line-clamp-2">{appointment.reason}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t">
                  {appointment.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      disabled={updatingId === appointment.id}
                    >
                      {updatingId === appointment.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        'Cancel'
                      )}
                    </Button>
                  )}
                  
                  {appointment.status === 'cancelled' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClick(appointment.id)}
                      disabled={deletingId === appointment.id}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      aria-label={`Delete appointment with ${appointment.doctor}`}
                    >
                      {deletingId === appointment.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </>
                      )}
                    </Button>
                  )}
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                    <Phone className="h-3 w-3" />
                    <span>{appointment.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Appointment"
        message="Are you sure you want to permanently delete this appointment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletingId !== null}
      />
    </Card>
  );
};

export default RecentAppointments;