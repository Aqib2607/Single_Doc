import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSidebar from '@/components/DoctorSidebar';
import { Users, Calendar, FileText, Activity, Clock, User, Plus, Eye, Stethoscope } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    satisfaction_rate: 0,
    average_rating: 0,
    total_reviews: 0,
    today_appointments: 0,
    total_patients: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/doctor-dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Dashboard API error:', response.status, response.statusText);
        setDashboardData({
          satisfaction_rate: 0,
          average_rating: 0,
          total_reviews: 0,
          today_appointments: 0,
          total_patients: 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setDashboardData({
        satisfaction_rate: 0,
        average_rating: 0,
        total_reviews: 0,
        today_appointments: 0,
        total_patients: 0,
      });
    }
  };

  const fetchTodaySchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/doctor/today-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTodaySchedule(result.data);
        } else {
          console.error('Today appointments API error:', result.message);
          setTodaySchedule([]);
        }
      } else {
        console.error('Today appointments fetch error:', response.status, response.statusText);
        setTodaySchedule([]);
      }
    } catch (error) {
      console.error('Failed to fetch today\'s appointments:', error);
      setTodaySchedule([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'doctor') {
      fetchDashboardData();
      fetchTodaySchedule();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (user?.role === 'doctor') {
        await Promise.all([
          fetchDashboardData(),
          fetchTodaySchedule()
        ]);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const stats = [
    { icon: Users, label: 'Total Patients', value: dashboardData.total_patients.toString(), color: 'text-primary' },
    { icon: Calendar, label: "Today's Appointments", value: dashboardData.today_appointments.toString(), color: 'text-primary' },
    { icon: FileText, label: 'Total Reviews', value: dashboardData.total_reviews.toString(), color: 'text-primary' },
    { icon: Activity, label: 'Average Rating', value: `${dashboardData.average_rating}/5`, color: 'text-primary' },
  ];

  return (
    <>
      <Helmet>
        <title>Doctor Dashboard - Healthcare Portal</title>
        <meta name="description" content="Manage your patients and appointments" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-20">
          <DoctorSidebar />
          <main className="flex-1 px-6 py-8">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-2">Welcome, Dr. {user?.name}!</h1>
                  <p className="text-xl text-muted-foreground">Your practice dashboard overview</p>
                </div>
                <Button 
                  onClick={handleRefresh} 
                  disabled={refreshing}
                  variant="outline" 
                  className="border-border"
                >
                  <Activity className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh Data'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <Card key={index} className="shadow-card border-border bg-card hover:shadow-elegant transition-smooth animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">{stat.label}</CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-card border-border bg-card animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Today's Schedule
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">Your appointments for today</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/doctor/schedules">
                      <Button size="sm" className="gradient-primary shadow-elegant hover:shadow-glow">
                        <Calendar className="h-4 w-4 mr-2" />
                        Manage Schedules
                      </Button>
                    </Link>
                    <Link to="/doctor/appointments">
                      <Button size="sm" variant="outline" className="border-border">
                        <Eye className="h-4 w-4 mr-2" />
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-4 text-muted-foreground">Loading appointments...</div>
                    ) : todaySchedule.length > 0 ? (
                      todaySchedule.map((appointment, index) => (
                        <div key={appointment.id || index} className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              appointment.status === 'confirmed' ? 'bg-green-500' : 
                              appointment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <div>
                              <p className="font-semibold text-foreground flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {appointment.patient_name}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {appointment.formatted_time}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                <Stethoscope className="h-3 w-3" />
                                {appointment.purpose}
                              </p>
                              <p className="text-xs text-primary mt-1 capitalize">
                                {appointment.status} • {appointment.consultation_type}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No appointments scheduled for today
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border bg-card animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Recent Patients
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">Recently seen patients</CardDescription>
                  </div>
                  <Link to="/doctor/patients">
                    <Button size="sm" variant="outline" className="border-border">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-foreground">Sarah Wilson</p>
                          <p className="text-sm text-muted-foreground">Last visit: March 10, 2025</p>
                          <p className="text-sm text-primary mt-1">Diagnosis: Hypertension</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-foreground">David Lee</p>
                          <p className="text-sm text-muted-foreground">Last visit: March 8, 2025</p>
                          <p className="text-sm text-primary mt-1">Diagnosis: Type 2 Diabetes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <Card className="shadow-card border-border bg-card animate-fade-in-up" style={{animationDelay: '0.7s'}}>
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Practice Overview
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Key metrics and performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">{dashboardData.satisfaction_rate}%</div>
                      <div className="text-sm text-muted-foreground">Patient Satisfaction</div>
                      <div className={`text-xs mt-1 ${
                        dashboardData.satisfaction_rate >= 90 ? 'text-green-600' :
                        dashboardData.satisfaction_rate >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {dashboardData.satisfaction_rate >= 90 ? 'Excellent' :
                         dashboardData.satisfaction_rate >= 70 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">{dashboardData.average_rating}</div>
                      <div className="text-sm text-muted-foreground">Average Rating</div>
                      <div className={`text-xs mt-1 ${
                        dashboardData.average_rating >= 4.5 ? 'text-green-600' :
                        dashboardData.average_rating >= 3.5 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {dashboardData.average_rating >= 4.5 ? 'Outstanding' :
                         dashboardData.average_rating >= 3.5 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">{dashboardData.total_reviews}</div>
                      <div className="text-sm text-muted-foreground">Total Reviews</div>
                      <div className="text-xs text-primary mt-1">Patient Feedback</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DoctorDashboard;
