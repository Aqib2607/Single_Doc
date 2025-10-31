import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Mail, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
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
                    />
                  </div>

                  <Button type="submit" className="w-full gradient-primary shadow-elegant hover:shadow-glow transition-smooth">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProfilePage;
