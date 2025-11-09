import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Mail, Shield, Stethoscope, Phone, DollarSign, Trash2, AlertTriangle, Lock } from 'lucide-react';

interface DoctorProfile {
  doctor_id: number;
  name: string;
  email: string;
  specialization: string;
  license_number: string;
  bio: string;
  phone: string;
  gender: string;
  consultation_fee: number;
  availability: Record<string, unknown> | null;
}

interface PatientProfile {
  patient_id: number;
  name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_history: string;
  allergies: string;
}

interface UpdateData {
  name: string;
  email: string;
  // Doctor fields
  specialization?: string;
  license_number?: string;
  bio?: string;
  consultation_fee?: number;
  // Patient fields
  date_of_birth?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_history?: string;
  allergies?: string;
  // Common fields
  phone?: string;
  gender?: string;
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
}

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form states - Common
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  
  // Doctor-specific states
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [bio, setBio] = useState('');
  const [consultationFee, setConsultationFee] = useState(0);
  
  // Patient-specific states
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // Delete account states
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const loadDoctorProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/doctor/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: DoctorProfile = await response.json();
        setName(data.name);
        setEmail(data.email);
        setSpecialization(data.specialization);
        setLicenseNumber(data.license_number);
        setBio(data.bio || '');
        setPhone(data.phone || '');
        setGender(data.gender);
        setConsultationFee(data.consultation_fee);
      } else {
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const loadPatientProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patient/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: PatientProfile = await response.json();
        setName(data.name);
        setEmail(data.email);
        setDateOfBirth(data.date_of_birth || '');
        setGender(data.gender);
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setEmergencyContactName(data.emergency_contact_name || '');
        setEmergencyContactPhone(data.emergency_contact_phone || '');
        setMedicalHistory(data.medical_history || '');
        setAllergies(data.allergies || '');
      } else {
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Load profile data based on user role
  useEffect(() => {
    if (user?.role === 'doctor') {
      loadDoctorProfile();
    } else if (user?.role === 'patient') {
      loadPatientProfile();
    } else {
      // Fallback for basic user data
      setName(user?.name || '');
      setEmail(user?.email || '');
    }
  }, [user, loadDoctorProfile, loadPatientProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const updateData: UpdateData = {
        name,
        email,
      };

      // Add role-specific fields
      if (user?.role === 'doctor') {
        updateData.specialization = specialization;
        updateData.license_number = licenseNumber;
        updateData.bio = bio;
        updateData.phone = phone;
        updateData.gender = gender;
        updateData.consultation_fee = consultationFee;
        
        // Add password fields if provided
        if (newPassword) {
          updateData.current_password = currentPassword;
          updateData.new_password = newPassword;
          updateData.new_password_confirmation = confirmNewPassword;
        }
      } else if (user?.role === 'patient') {
        updateData.date_of_birth = dateOfBirth;
        updateData.gender = gender;
        updateData.phone = phone;
        updateData.address = address;
        updateData.emergency_contact_name = emergencyContactName;
        updateData.emergency_contact_phone = emergencyContactPhone;
        updateData.medical_history = medicalHistory;
        updateData.allergies = allergies;
        
        // Add password fields if provided
        if (newPassword) {
          updateData.current_password = currentPassword;
          updateData.new_password = newPassword;
          updateData.new_password_confirmation = confirmNewPassword;
        }
      }

      const endpoint = user?.role === 'doctor' ? '/api/doctor/profile' : '/api/patient/profile';
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast({
          title: "Profile updated",
          description: "Your profile information has been saved successfully.",
        });
        
        // Clear password fields after successful update
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update profile.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast({
        title: "Error",
        description: "Please type 'DELETE' to confirm account deletion.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = user?.role === 'doctor' ? '/api/doctor/profile' : '/api/patient/profile';
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: deletePassword,
          confirmation: deleteConfirmation,
        }),
      });

      if (response.ok) {
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted.",
        });
        
        // Clear local storage and redirect to home
        localStorage.removeItem('token');
        logout();
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete account.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile - Healthcare Portal</title>
        <meta name="description" content="Manage your profile information" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 px-4 py-8">
          <div className="container mx-auto max-w-2xl">
            <div className="mb-12 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">Profile</h1>
              <p className="text-xl text-muted-foreground">Manage your personal information</p>
            </div>

            {/* Personal Information Card */}
            <Card className="shadow-card border-border bg-card animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-muted-foreground">Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Role
                    </Label>
                    <Input
                      id="role"
                      value={user?.role === 'patient' ? 'Patient' : 'Doctor'}
                      disabled
                      className="capitalize bg-muted/50 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="border-border focus:ring-primary transition-smooth"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="border-border focus:ring-primary transition-smooth"
                      required
                    />
                  </div>

                  {/* Patient-specific fields */}
                  {user?.role === 'patient' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="date_of_birth" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          Date of Birth
                        </Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="border-border focus:ring-primary transition-smooth"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          Gender
                        </Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger className="border-border focus:ring-primary transition-smooth">
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          className="border-border focus:ring-primary transition-smooth"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">
                          Address
                        </Label>
                        <Textarea
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your home address"
                          className="border-border focus:ring-primary transition-smooth min-h-[80px]"
                          maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground">{address.length}/500 characters</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergency_contact_name" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          Emergency Contact Name
                        </Label>
                        <Input
                          id="emergency_contact_name"
                          value={emergencyContactName}
                          onChange={(e) => setEmergencyContactName(e.target.value)}
                          placeholder="Emergency contact person's name"
                          className="border-border focus:ring-primary transition-smooth"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergency_contact_phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          Emergency Contact Phone
                        </Label>
                        <Input
                          id="emergency_contact_phone"
                          value={emergencyContactPhone}
                          onChange={(e) => setEmergencyContactPhone(e.target.value)}
                          placeholder="Emergency contact phone number"
                          className="border-border focus:ring-primary transition-smooth"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="medical_history">
                          Medical History
                        </Label>
                        <Textarea
                          id="medical_history"
                          value={medicalHistory}
                          onChange={(e) => setMedicalHistory(e.target.value)}
                          placeholder="Previous surgeries, chronic conditions, medications, etc."
                          className="border-border focus:ring-primary transition-smooth min-h-[100px]"
                          maxLength={2000}
                        />
                        <p className="text-xs text-muted-foreground">{medicalHistory.length}/2000 characters</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allergies">
                          Allergies
                        </Label>
                        <Textarea
                          id="allergies"
                          value={allergies}
                          onChange={(e) => setAllergies(e.target.value)}
                          placeholder="Food allergies, drug allergies, environmental allergies, etc."
                          className="border-border focus:ring-primary transition-smooth min-h-[80px]"
                          maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground">{allergies.length}/1000 characters</p>
                      </div>
                    </>
                  )}

                  {/* Doctor-specific fields */}
                  {user?.role === 'doctor' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="specialization" className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-primary" />
                          Specialization
                        </Label>
                        <Input
                          id="specialization"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          placeholder="e.g., Cardiology, General Medicine"
                          className="border-border focus:ring-primary transition-smooth"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="license_number" className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          License Number
                        </Label>
                        <Input
                          id="license_number"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="Enter your medical license number"
                          className="border-border focus:ring-primary transition-smooth"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          className="border-border focus:ring-primary transition-smooth"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          Gender
                        </Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger className="border-border focus:ring-primary transition-smooth">
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="consultation_fee" className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          Consultation Fee
                        </Label>
                        <Input
                          id="consultation_fee"
                          type="number"
                          step="0.01"
                          min="0"
                          value={consultationFee}
                          onChange={(e) => setConsultationFee(parseFloat(e.target.value) || 0)}
                          placeholder="Enter consultation fee"
                          className="border-border focus:ring-primary transition-smooth"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">
                          Bio/About
                        </Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell patients about your experience, expertise, and approach to healthcare..."
                          className="border-border focus:ring-primary transition-smooth min-h-[100px]"
                          maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground">{bio.length}/1000 characters</p>
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary shadow-elegant hover:shadow-glow transition-smooth"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Change Card - For doctors and patients */}
            {(user?.role === 'doctor' || user?.role === 'patient') && (
              <Card className="shadow-card border-border bg-card animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Change Password
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="border-border focus:ring-primary transition-smooth"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 8 characters)"
                      className="border-border focus:ring-primary transition-smooth"
                      minLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_new_password">Confirm New Password</Label>
                    <Input
                      id="confirm_new_password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="border-border focus:ring-primary transition-smooth"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Leave password fields empty if you don't want to change your password.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Delete Account Card - For doctors and patients */}
            {(user?.role === 'doctor' || user?.role === 'patient') && (
              <Card className="shadow-card border-red-200 bg-card animate-fade-in-up border-2" style={{animationDelay: '0.6s'}}>
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Permanently delete your {user?.role} account and all associated data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account Permanently
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your {user?.role} account and remove all your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="delete_password">Password</Label>
                          <Input
                            id="delete_password"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter your password to confirm"
                            className="border-border focus:ring-primary transition-smooth"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="delete_confirmation">
                            Type <strong>DELETE</strong> to confirm
                          </Label>
                          <Input
                            id="delete_confirmation"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="DELETE"
                            className="border-border focus:ring-primary transition-smooth"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowDeleteDialog(false)}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleDeleteAccount}
                          disabled={loading || deletePassword === '' || deleteConfirmation !== 'DELETE'}
                        >
                          {loading ? 'Deleting...' : 'Delete Account'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProfilePage;
