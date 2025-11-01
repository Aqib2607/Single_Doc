import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSidebar from '@/components/DoctorSidebar';
import { Calendar, Clock, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorAppointments = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', medical_notes: '' });

  useEffect(() => {
    fetchTodayAppointments();
    fetchAllAppointments();
  }, []);

  const fetchTodayAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching today appointments with token:', token ? 'Present' : 'Missing');
      const response = await fetch('/api/doctor/today-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Today appointments response status:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('Today appointments result:', result);
        setTodayAppointments(result.success ? result.data : []);
      } else {
        const errorText = await response.text();
        console.error('Today appointments error:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching today appointments:', error);
    }
  };

  const fetchAllAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching all appointments with token:', token ? 'Present' : 'Missing');
      const response = await fetch('/api/doctor/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('All appointments response status:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('All appointments result:', result);
        setAllAppointments(result.success ? result.data : []);
      } else {
        const errorText = await response.text();
        console.error('All appointments error:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching all appointments:', error);
    }
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.appointment_id);
    setEditForm({
      status: appointment.status,
      medical_notes: appointment.medical_notes || ''
    });
  };

  const handleUpdate = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/doctor/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        setEditingId(null);
        fetchAllAppointments();
        fetchTodayAppointments();
        alert('Appointment updated successfully!');
      } else {
        alert('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment');
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/doctor/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        fetchAllAppointments();
        fetchTodayAppointments();
        alert('Appointment deleted successfully!');
      } else {
        alert('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Error deleting appointment');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ status: '', medical_notes: '' });
  };

  return (
    <>
      <Helmet>
        <title>Appointments - Doctor Dashboard</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-20">
          <DoctorSidebar />
          <main className="flex-1 px-6 py-8">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-8 animate-fade-in-up">
                <h1 className="text-4xl font-display font-bold text-gradient mb-4">Appointments</h1>
                <p className="text-xl text-muted-foreground">View and manage your appointments</p>
              </div>

              <Card className="shadow-card border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Today's Appointments
                    </CardTitle>
                    <CardDescription>Your appointments for today</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>

                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {appointment.patient_name}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointment.formatted_time}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.purpose}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                            {appointment.consultation_type || 'Consultation'}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">
                            {appointment.status}
                          </p>
                        </div>
                      </div>
                    ))}
                    {todayAppointments.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No appointments scheduled for today.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border bg-card mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    All Appointments
                  </CardTitle>
                  <CardDescription>Complete list of your appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allAppointments.map((appointment) => (
                      <div key={appointment.appointment_id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {appointment.patient_info.name}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointment.date_time.formatted}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.reason || 'No reason provided'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {editingId === appointment.appointment_id ? (
                            <div className="space-y-2">
                              <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex gap-1">
                                <Button size="sm" onClick={() => handleUpdate(appointment.appointment_id)}>
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancel}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {appointment.status}
                              </span>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(appointment)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDelete(appointment.appointment_id)} className="text-red-600">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {allAppointments.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No appointments found.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DoctorAppointments;