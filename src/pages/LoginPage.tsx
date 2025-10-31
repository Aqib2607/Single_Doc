import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password, role);
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      // Get the actual user role from localStorage after successful login
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        navigate(userData.role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
      } else {
        // Fallback to form role if user data is not available
        navigate(role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
      }
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Healthcare Portal</title>
        <meta name="description" content="Sign in to your healthcare account" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
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
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    Create account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
      </div>
    </>
  );
};

export default LoginPage;
