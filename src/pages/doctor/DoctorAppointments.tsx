import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSidebar from '@/components/DoctorSidebar';
import { Calendar, Clock, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorAppointments = () => {
  const [schedules, setSchedules] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: '',
    start_time: '',
    end_time: '',
    is_available: true
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/doctor-schedules', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.day_of_week || !formData.start_time || !formData.end_time) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/doctor-schedules', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchSchedules();
        setShowAddForm(false);
        setFormData({ day_of_week: '', start_time: '', end_time: '', is_available: true });
        alert('Schedule added successfully!');
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.message || 'Failed to add schedule'));
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
      alert('Network error. Please try again.');
    }
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
                <h1 className="text-4xl font-display font-bold text-gradient mb-4">Schedule Management</h1>
                <p className="text-xl text-muted-foreground">Manage your weekly schedule and availability</p>
              </div>

              <Card className="shadow-card border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Today's Schedule
                    </CardTitle>
                    <CardDescription>Your appointments for today</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddForm(!showAddForm)} className="gradient-primary shadow-elegant">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Slot
                  </Button>
                </CardHeader>
                <CardContent>
                  {showAddForm && (
                    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Day of Week *</Label>
                          <Select value={formData.day_of_week} onValueChange={(value) => setFormData({...formData, day_of_week: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monday">Monday</SelectItem>
                              <SelectItem value="tuesday">Tuesday</SelectItem>
                              <SelectItem value="wednesday">Wednesday</SelectItem>
                              <SelectItem value="thursday">Thursday</SelectItem>
                              <SelectItem value="friday">Friday</SelectItem>
                              <SelectItem value="saturday">Saturday</SelectItem>
                              <SelectItem value="sunday">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Start Time *</Label>
                          <Input 
                            type="time" 
                            value={formData.start_time}
                            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label>End Time *</Label>
                          <Input 
                            type="time" 
                            value={formData.end_time}
                            onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                            required
                          />
                        </div>
                        <div className="flex items-end">
                          <Button type="submit" className="w-full">Add Schedule</Button>
                        </div>
                      </div>
                    </form>
                  )}
                  <div className="space-y-4">
                    {schedules.map((schedule) => (
                      <div key={schedule.id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            schedule.is_available ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {schedule.day_of_week.charAt(0).toUpperCase() + schedule.day_of_week.slice(1)}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {schedule.start_time} - {schedule.end_time}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          schedule.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {schedule.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    ))}
                    {schedules.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No schedules added yet. Click "Add Slot" to create your first schedule.
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