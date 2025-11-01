import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Clock, User, Phone, Mail, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
}

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    // Guest fields
    name: '',
    email: '',
    phone: '',
    // Common fields
    date: '',
    time: '',
    doctor_id: '',
    consultationType: '',
    reason: '',
    termsAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    // Prepare data based on user type
    const submitData = isAuthenticated ? {
      date: formData.date,
      time: formData.time,
      doctor_id: parseInt(formData.doctor_id),
      consultationType: formData.consultationType,
      reason: formData.reason,
      termsAccepted: formData.termsAccepted
    } : {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      doctor_id: parseInt(formData.doctor_id),
      reason: formData.reason
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          consultationType: '',
          doctor_id: '',
          reason: '',
          termsAccepted: false
        });

        // Redirect after success
        setTimeout(() => {
          if (isAuthenticated) {
            navigate('/patient-dashboard');
          } else {
            navigate('/');
          }
        }, 2000);
      } else {
        setErrors(data.errors || { general: [data.message] });
      }
    } catch (error) {
      setErrors({ general: ['Network error. Please try again.'] });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-6">
                Book Your Appointment
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {isAuthenticated 
                  ? `Welcome back, ${user?.name}! Schedule your consultation easily.`
                  : 'Schedule your consultation with our healthcare professionals'
                }
              </p>
            </div>

            <Card className="shadow-card border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-5 w-5 text-primary" />
                  {isAuthenticated ? 'Patient Appointment' : 'Guest Appointment'}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {isAuthenticated 
                    ? 'Your information is automatically filled from your profile'
                    : 'Please fill in all required information to book your appointment'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Success Message */}
                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 text-green-600">✓</div>
                        <p className="text-green-800 font-medium">{successMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Error Messages */}
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-800 mb-1">Booking Failed</h4>
                          {errors.general.map((error, index) => (
                            <p key={index} className="text-sm text-red-700">{error}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Guest Information Section */}
                  {!isAuthenticated && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                          />
                          {errors.name && (
                            <p className="text-sm text-red-600">{errors.name[0]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            required
                          />
                          {errors.phone && (
                            <p className="text-sm text-red-600">{errors.phone[0]}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email[0]}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Patient Information Display */}
                  {isAuthenticated && (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Patient Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Name</Label>
                          <p className="font-medium">{user?.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Email</Label>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Appointment Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Appointment Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Appointment Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Appointment Time *</Label>
                        <Select onValueChange={(value) => handleChange('time', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor_id">Select Doctor *</Label>
                        <Select onValueChange={(value) => handleChange('doctor_id', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a doctor" />
                          </SelectTrigger>
                          <SelectContent>
                            {doctors.map((doctor) => (
                              <SelectItem key={doctor.doctor_id} value={doctor.doctor_id.toString()}>
                                {doctor.name} - {doctor.specialization}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.doctor_id && (
                          <p className="text-sm text-red-600">{errors.doctor_id[0]}</p>
                        )}
                      </div>

                      {isAuthenticated && (
                        <div className="space-y-2">
                          <Label htmlFor="consultationType">Consultation Type</Label>
                          <Select onValueChange={(value) => handleChange('consultationType', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in-person">In-Person</SelectItem>
                              <SelectItem value="telemedicine">Telemedicine</SelectItem>
                              <SelectItem value="follow-up">Follow-up</SelectItem>
                              <SelectItem value="consultation">Consultation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Textarea
                        id="reason"
                        value={formData.reason}
                        onChange={(e) => handleChange('reason', e.target.value)}
                        placeholder="Please describe your symptoms or reason for the appointment"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  {isAuthenticated && (
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleChange('termsAccepted', checked as boolean)}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the Terms of Service and Privacy Policy. I understand that appointment confirmation is subject to availability.
                      </Label>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary shadow-elegant hover:shadow-glow"
                    disabled={isSubmitting || (isAuthenticated && !formData.termsAccepted)}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking Appointment...
                      </>
                    ) : (
                      'Book Appointment'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookAppointmentPage;