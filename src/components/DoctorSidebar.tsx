import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock,
  FileText, 
  Stethoscope, 
  ClipboardList, 
  MessageSquare, 
  Settings,
  User,
  Pill,
  BookOpen,
  Images
} from 'lucide-react';

const DoctorSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor-dashboard' },
    { icon: Users, label: 'Patients', path: '/doctor/patients' },
    { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
    { icon: Clock, label: 'Schedules', path: '/doctor/schedules' },
    { icon: Stethoscope, label: 'Consultations', path: '/doctor/consultations' },
    { icon: FileText, label: 'Medical Records', path: '/doctor/records' },
    { icon: ClipboardList, label: 'Prescriptions', path: '/doctor/prescriptions' },
    { icon: MessageSquare, label: 'Messages', path: '/doctor/messages' },
    { icon: Pill, label: 'Medicine & Tests', path: '/doctor/medicine-tests' },
    { icon: BookOpen, label: 'Blog Management', path: '/doctor/blogs' },
    { icon: Images, label: 'Gallery Management', path: '/doctor/gallery' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-display font-bold text-gradient mb-6">Doctor Portal</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground shadow-elegant'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default DoctorSidebar;