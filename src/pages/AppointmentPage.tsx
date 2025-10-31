import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Clock, User, Phone, Mail, FileText, Stethoscope, Heart, AlertTriangle } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AppointmentPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    date: '',
    time: '',
    doctor: '',
    consultationType: '',
    reason: '',
    termsAccepted: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Appointment booked successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          gender: '',
          date: '',
          time: '',
          doctor: '',
          consultationType: '',
          reason: '',
          termsAccepted: false
        });
      } else {
        alert('Failed to book appointment. Please try again.');
      }
    } catch (error) {
      alert('Error booking appointment. Please try again.');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
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
                    </div>
                  </div>

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
                      <Select onValueChange={(value) => handleChange('doctor', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr-smith">Dr. Sarah Smith - General Medicine</SelectItem>
                          <SelectItem value="dr-johnson">Dr. Michael Johnson - Cardiology</SelectItem>
                          <SelectItem value="dr-williams">Dr. Emily Williams - Dermatology</SelectItem>
                          <SelectItem value="dr-brown">Dr. David Brown - Orthopedics</SelectItem>
                        </SelectContent>
                      </Select>
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
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                      . I understand that appointment confirmation is subject to availability and will be confirmed via email or phone.
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary shadow-elegant hover:shadow-glow"
                    disabled={!formData.termsAccepted}
                  >
                    Book Appointment
                  </Button>
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