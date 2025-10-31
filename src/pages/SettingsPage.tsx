import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Settings, Mail, MessageSquare, Newspaper, Shield } from 'lucide-react';

const SettingsPage = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Settings - Healthcare Portal</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 px-4 py-8">
          <div className="container mx-auto max-w-2xl">
            <div className="mb-12 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">Account Settings</h1>
              <p className="text-xl text-muted-foreground">Customize your preferences and security</p>
            </div>

            <Card className="shadow-card border-border bg-card animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Preferences
                </CardTitle>
                <CardDescription className="text-muted-foreground">Manage your account preferences and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                  <div className="space-y-0.5 flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-foreground font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about appointments
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                  <div className="space-y-0.5 flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-foreground font-medium">SMS Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get text reminders for upcoming appointments
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                  <div className="space-y-0.5 flex items-center gap-3">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-foreground font-medium">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Subscribe to health tips and updates
                      </p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-primary" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                  <div className="space-y-0.5 flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-foreground font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-primary" />
                </div>

                <Button onClick={handleSave} className="w-full gradient-primary shadow-elegant hover:shadow-glow transition-smooth mt-8">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SettingsPage;
