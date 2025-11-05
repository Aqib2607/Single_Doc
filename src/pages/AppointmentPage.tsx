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
import $ from 'jquery';

interface TimeSlot {
  value: string;
  label: string;
}

interface DoctorSchedule {
  day_of_week: string;
  start_time: string;
  end_time: string;
  time_slots: TimeSlot[];
}


const AppointmentPage = () => {
  const navigate = useNavigate();
  const [patientProfile, setPatientProfile] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: ''
  });
  
  const [formData, setFormData] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    date_of_birth?: string;
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
    date_of_birth: '',
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
  const [doctorSchedules, setDoctorSchedules] = useState<DoctorSchedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');
    
    const token = localStorage.getItem('token');
    const endpoint = patientProfile.name ? '/api/appointments' : '/api/book-appointment';
    
    $.ajax({
      url: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      data: JSON.stringify(formData),
      success: (data) => {
        if (data.success) {
          setSuccessMessage(data.message);
          setFormData({
            name: '',
            email: '',
            phone: '',
            gender: '',
            date_of_birth: '',
            date: '',
            time: '',
            doctor_id: undefined,
            consultationType: '',
            reason: '',
            termsAccepted: false
          });
          
          if (patientProfile.name) {
            setTimeout(() => {
              navigate('/patient-dashboard');
            }, 2000);
          }
        } else {
          setErrors(data.errors || { general: [data.message] });
        }
      },
      error: (xhr) => {
        const data = xhr.responseJSON;
        setErrors(data?.errors || { general: [data?.message || 'Network error. Please try again.'] });
      },
      complete: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDoctorChange = (doctorId: number) => {
    setFormData(prev => ({ ...prev, doctor_id: doctorId, time: '' }));
    fetchDoctorSchedules(doctorId);
  };

  const fetchDoctorSchedules = async (doctorId: number) => {
    setLoadingSchedules(true);
    setDoctorSchedules([]);
    setAvailableTimeSlots([]);
    
    try {
      const response = await fetch(`/api/doctors/${doctorId}/schedules`);
      if (response.ok) {
        const schedules = await response.json();
        setDoctorSchedules(schedules);
        if (selectedDate) {
          updateAvailableTimeSlots(schedules, selectedDate);
        }
      } else {
        console.error('Failed to fetch doctor schedules');
      }
    } catch (error) {
      console.error('Error fetching doctor schedules:', error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const updateAvailableTimeSlots = (schedules: DoctorSchedule[], date: string) => {
    const selectedDay = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySchedule = schedules.find(schedule => schedule.day_of_week === selectedDay);
    
    if (daySchedule) {
      setAvailableTimeSlots(daySchedule.time_slots || []);
    } else {
      setAvailableTimeSlots([]);
    }
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, date, time: '' }));
    setSelectedDate(date);
    if (doctorSchedules.length > 0) {
      updateAvailableTimeSlots(doctorSchedules, date);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setProfileLoading(false);
      return;
    }

    $.ajax({
      url: '/api/patient/profile',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      success: (profile) => {
        setPatientProfile(profile);
        console.log('Patient profile loaded:', profile);
        console.log('Gender value:', profile.gender);
        console.log('Gender type:', typeof profile.gender);
      },
      error: (xhr) => {
        console.error('Failed to fetch profile:', xhr.status, xhr.statusText);
      },
      complete: () => {
        setProfileLoading(false);
      }
    });
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

                      <div className="space-y-2">
                        <Label htmlFor="date_of_birth">Date of Birth *</Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={formData.date_of_birth || ''}
                          onChange={(e) => handleChange('date_of_birth', e.target.value)}
                          required
                        />
                        {errors.date_of_birth && (
                          <p className="text-sm text-red-600">{errors.date_of_birth[0]}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Patient Information (Read-only) */}
                  {patientProfile.name && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Patient Information (Auto-filled for verification)
                      </h3>
                      {profileLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading patient details...
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-blue-700">Full Name</Label>
                            <Input
                              value={patientProfile.name}
                              readOnly
                              className="bg-blue-100 cursor-not-allowed border-blue-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-blue-700">Email</Label>
                            <Input
                              value={patientProfile.email}
                              readOnly
                              className="bg-blue-100 cursor-not-allowed border-blue-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-blue-700">Phone</Label>
                            <Input
                              value={patientProfile.phone}
                              readOnly
                              className="bg-blue-100 cursor-not-allowed border-blue-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-blue-700">Gender</Label>
                            <Input
                              value={patientProfile.gender ? 
                                patientProfile.gender.charAt(0).toUpperCase() + patientProfile.gender.slice(1).replace('-', ' ') : 
                                'Prefer not to say'
                              }
                              readOnly
                              className="bg-blue-100 cursor-not-allowed border-blue-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-blue-700">Date of Birth</Label>
                            <Input
                              value={patientProfile.date_of_birth ? 
                                new Date(patientProfile.date_of_birth).toLocaleDateString() : 
                                'Not specified'
                              }
                              readOnly
                              className="bg-blue-100 cursor-not-allowed border-blue-200"
                            />
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-blue-600 mt-2">
                        ✓ This information is automatically populated from your patient profile and cannot be edited during booking.
                      </p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                      {errors.date && (
                        <p className="text-sm text-red-600">{errors.date[0]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Preferred Time *
                      </Label>
                      {!formData.doctor_id ? (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500">
                          Please select a doctor first to view available time slots
                        </div>
                      ) : loadingSchedules ? (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-blue-600">Loading available time slots...</span>
                        </div>
                      ) : !formData.date ? (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500">
                          Please select a date to view available time slots
                        </div>
                      ) : availableTimeSlots.length === 0 ? (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700">
                          No available time slots for the selected date. Please choose a different date.
                        </div>
                      ) : (
                        <Select onValueChange={(value) => handleChange('time', value)} value={formData.time}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select available time" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimeSlots.map((slot) => (
                              <SelectItem key={slot.value} value={slot.value}>
                                {slot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {errors.time && (
                        <p className="text-sm text-red-600">{errors.time[0]}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor">Select Doctor *</Label>
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
                      <Select onValueChange={(value) => handleChange('consultationType', value)} value={formData.consultationType}>
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