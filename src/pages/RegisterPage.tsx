import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const RegisterPage = () => {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    // Doctor fields
    specialization: '',
    license_number: '',
    bio: '',
    consultation_fee: '',
    // Patient fields
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: '',
    allergies: ''
  });
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await register(formData, role);
      
      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created!",
        });
        // Small delay to ensure AuthContext state is updated
        setTimeout(() => {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            navigate(userData.role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
          } else {
            navigate(role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
          }
        }, 100);
      } else {
        let errorMessage = "Registration failed. Please try again.";
        if (result.errors) {
          if (typeof result.errors === 'string') {
            errorMessage = result.errors;
          } else if (result.errors.email) {
            errorMessage = result.errors.email[0];
          } else if (result.errors.password) {
            errorMessage = result.errors.password[0];
          } else {
            const firstError = Object.values(result.errors)[0];
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          }
        }
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - Healthcare Portal</title>
        <meta name="description" content="Create your healthcare account" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Register as a patient or doctor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label className="mb-2 block">I am a</Label>
                <Tabs value={role} onValueChange={(v) => setRole(v as 'patient' | 'doctor')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="patient">Patient</TabsTrigger>
                    <TabsTrigger value="doctor">Doctor</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.password_confirmation}
                      onChange={(e) => handleChange('password_confirmation', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {role === 'doctor' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          placeholder="e.g., Cardiology"
                          value={formData.specialization}
                          onChange={(e) => handleChange('specialization', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license_number">License Number</Label>
                        <Input
                          id="license_number"
                          placeholder="Medical license number"
                          value={formData.license_number}
                          onChange={(e) => handleChange('license_number', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultation_fee">Consultation Fee ($)</Label>
                      <Input
                        id="consultation_fee"
                        type="number"
                        placeholder="e.g., 150"
                        value={formData.consultation_fee}
                        onChange={(e) => handleChange('consultation_fee', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Brief professional bio"
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {role === 'patient' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => handleChange('date_of_birth', e.target.value)}
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
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Your full address"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        required
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                        <Input
                          id="emergency_contact_name"
                          placeholder="Contact person name"
                          value={formData.emergency_contact_name}
                          onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                        <Input
                          id="emergency_contact_phone"
                          placeholder="Contact person phone"
                          value={formData.emergency_contact_phone}
                          onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medical_history">Medical History (Optional)</Label>
                      <Textarea
                        id="medical_history"
                        placeholder="Previous medical conditions, surgeries, etc."
                        value={formData.medical_history}
                        onChange={(e) => handleChange('medical_history', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies (Optional)</Label>
                      <Textarea
                        id="allergies"
                        placeholder="Known allergies to medications, foods, etc."
                        value={formData.allergies}
                        onChange={(e) => handleChange('allergies', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </>
                )}
                
                <Button type="submit" className="w-full gradient-primary">
                  Create {role === 'doctor' ? 'Doctor' : 'Patient'} Account
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
      </div>
    </>
  );
};

export default RegisterPage;
