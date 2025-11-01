import React, { useState, useEffect, useMemo } from 'react';
import './AllAppointmentsModal.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Calendar,
  Clock,
  User,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  doctor: string;
  consultation_type: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

type SortField = 'appointment_date' | 'appointment_time' | 'doctor' | 'status' | 'created_at';
type SortDirection = 'asc' | 'desc';

const AllAppointmentsModal: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('appointment_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const fetchAllAppointments = async () => {
    if (!isOpen) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patient-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredAndSortedAppointments = useMemo(() => {
    const filtered = appointments.filter(appointment => {
      const matchesSearch = 
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.consultation_type?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'appointment_date':
          aValue = new Date(a.appointment_date).getTime();
          bValue = new Date(b.appointment_date).getTime();
          break;
        case 'appointment_time':
          aValue = a.appointment_time;
          bValue = b.appointment_time;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a[sortField]?.toLowerCase() || '';
          bValue = b[sortField]?.toLowerCase() || '';
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [appointments, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="view-all-button hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="View all appointments"
        >
          <Eye className="h-4 w-4 mr-2" />
          View All
        </Button>
      </DialogTrigger>
      <DialogContent className="modal-content max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            All Appointments - {user?.name} (ID: {user?.id})
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search and Filter Controls */}
          <div className="flex-shrink-0 space-y-4 mb-4">
            <div className="search-filter-container flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by doctor, reason, or consultation type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Filter appointments by status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {filteredAndSortedAppointments.length} of {appointments.length} appointments
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="loading-spinner h-6 w-6 animate-spin mr-2" />
                <span>Loading appointments...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchAllAppointments} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : filteredAndSortedAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {appointments.length === 0 ? 'No appointments found' : 'No appointments match your search'}
                </p>
                <p className="text-sm text-gray-500">
                  {appointments.length === 0 ? 'Your appointments will appear here' : 'Try adjusting your search or filter'}
                </p>
              </div>
            ) : (
              <Table className="appointments-table">
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="sortable-header cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('appointment_date')}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {getSortIcon('appointment_date')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="sortable-header cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('appointment_time')}
                    >
                      <div className="flex items-center gap-2">
                        Time
                        {getSortIcon('appointment_time')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="sortable-header cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('doctor')}
                    >
                      <div className="flex items-center gap-2">
                        Doctor
                        {getSortIcon('doctor')}
                      </div>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead 
                      className="sortable-header cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="sortable-header cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center gap-2">
                        Booked
                        {getSortIcon('created_at')}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedAppointments.map((appointment) => (
                    <TableRow key={appointment.id} className="table-row hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatDate(appointment.appointment_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatTime(appointment.appointment_time)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{appointment.doctor}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {appointment.consultation_type && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {appointment.consultation_type.replace('-', ' ')}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-muted-foreground truncate" title={appointment.reason}>
                            {appointment.reason || 'No reason provided'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`status-badge flex items-center gap-1 px-2 py-1 rounded-full text-xs border w-fit ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">{appointment.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(appointment.created_at)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllAppointmentsModal;