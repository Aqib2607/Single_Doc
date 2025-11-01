import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Clock, User, Phone, Mail, FileText, Stethoscope, Heart, AlertTriangle, Loader2 } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import DoctorSelect from '../components/ui/DoctorSelect';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [patientProfile, setPatientProfile] = useState({
    name: '',
    email: '',
    phone: '',
    gender: ''
  });
  
  const [formData, setFormData] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    date: string;
    time: string;
    doctor_id: number | undefined;
    consultationType: string;
    reason: string;
    termsAccepted: boolean;
  }>({
    name: '',
    email: '',
    phone: '',
    gender: '',
    date: '',
    time: '',
    doctor_id: undefined,
    consultationType: '',
    reason: '',
    termsAccepted: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          gender: '',
          date: '',
          time: '',
          doctor_id: undefined,
          consultationType: '',
          reason: '',
          termsAccepted: false
        });
        
        // Only redirect authenticated patients to dashboard
        if (patientProfile.name) {
          setTimeout(() => {
            navigate('/patient-dashboard');
          }, 2000);
        }
      } else {
        setErrors(data.errors || { general: [data.message] });
      }
    } catch (error) {
      setErrors({ general: ['Network error. Please try again.'] });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDoctorChange = (doctorId: number) => {
    setFormData(prev => ({ ...prev, doctor_id: doctorId }));
  };

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setProfileLoading(false);
          return;
        }

        const response = await fetch('/api/patient/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const profile = await response.json();
          setPatientProfile(profile);
        }
      } catch (error) {
        console.error('Failed to load patient profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchPatientProfile();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-6">Book Your Appointment</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Schedule your consultation with Dr. Sarah Mitchell and take the first step towards better health</p>
            </div>

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-card border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-5 w-5 text-primary" />
                  Appointment Details
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Fill in your information to schedule an appointment
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
                  
                  {/* General Error Message */}
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-800 mb-1">Booking Error</h4>
                          {errors.general.map((error, index) => (
                            <p key={index} className="text-sm text-red-700">{error}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Guest Information Fields */}
                  {!patientProfile.name && (
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
                            value={formData.name || ''}
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
                            value={formData.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            required
                          />
                          {errors.phone && (
                            <p className="text-sm text-red-600">{errors.phone[0]}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email (Optional)</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                          />
                          {errors.email && (
                            <p className="text-sm text-red-600">{errors.email[0]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender *</Label>
                          <Select onValueChange={(value) => handleChange('gender', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.gender && (
                            <p className="text-sm text-red-600">{errors.gender[0]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Patient Information (Read-only) */}
                  {patientProfile.name && (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Patient Information
                      </h3>
                      {profileLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading patient details...
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-600">Full Name</Label>
                            <Input
                              value={patientProfile.name}
                              readOnly
                              className="bg-gray-100 cursor-not-allowed"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-600">Email</Label>
                            <Input
                              value={patientProfile.email}
                              readOnly
                              className="bg-gray-100 cursor-not-allowed"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-600">Phone</Label>
                            <Input
                              value={patientProfile.phone}
                              readOnly
                              className="bg-gray-100 cursor-not-allowed"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-600">Gender</Label>
                            <Input
                              value={patientProfile.gender ? patientProfile.gender.charAt(0).toUpperCase() + patientProfile.gender.slice(1) : ''}
                              readOnly
                              className="bg-gray-100 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Preferred Time
                      </Label>
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
                      <Label htmlFor="doctor">Select Doctor</Label>
                      <DoctorSelect
                        value={formData.doctor_id}
                        onValueChange={handleDoctorChange}
                        placeholder="Choose a doctor"
                      />
                      {errors.doctor_id && (
                        <p className="text-sm text-red-600 mt-1">{errors.doctor_id[0]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultationType">Consultation Type</Label>
                      <Select onValueChange={(value) => handleChange('consultationType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select consultation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-person">In-Person Visit</SelectItem>
                          <SelectItem value="telemedicine">Telemedicine</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="consultation">General Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Reason for Visit
                    </Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => handleChange('reason', e.target.value)}
                      placeholder="Please describe your symptoms or reason for the appointment"
                      rows={4}
                    />
                  </div>

                  {/* Emergency Notice */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 mb-1">Emergency Notice</h4>
                        <p className="text-sm text-red-700">
                          If you are experiencing a medical emergency, please call 911 immediately or visit your nearest emergency room. This appointment booking system is not for urgent medical situations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Policy */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleChange('termsAccepted', checked as boolean)}
                      required
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the Terms of Service and Privacy Policy. I understand that appointment confirmation is subject to availability and will be confirmed via email or phone.
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary shadow-elegant hover:shadow-glow"
                    disabled={isSubmitting || !formData.termsAccepted}
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
                  
                  {errors.termsAccepted && (
                    <p className="text-sm text-red-600 text-center">{errors.termsAccepted[0]}</p>
                  )}
                </form>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentPage;