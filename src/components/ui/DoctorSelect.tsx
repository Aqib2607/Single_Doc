import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Loader2, Stethoscope } from 'lucide-react';

interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
  consultation_fee: number;
}

interface DoctorSelectProps {
  value?: number;
  onValueChange: (doctorId: number) => void;
  placeholder?: string;
}

const DoctorSelect: React.FC<DoctorSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select a doctor"
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedDoctor = doctors.find(d => d.doctor_id === value);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/doctors');
      if (!response.ok) throw new Error('Failed to fetch doctors');
      
      const data = await response.json();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleSelect = (doctor: Doctor) => {
    onValueChange(doctor.doctor_id);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-haspopup="listbox"
        aria-label="Select doctor"
      >
        <span className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-muted-foreground" />
          {selectedDoctor ? (
            <span className="truncate">
              {selectedDoctor.name} - {selectedDoctor.specialization}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-0 shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Search doctors"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Loading doctors...</span>
              </div>
            ) : error ? (
              <div className="px-3 py-6 text-center">
                <p className="text-sm text-destructive">{error}</p>
                <button
                  onClick={fetchDoctors}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                {searchTerm ? 'No doctors found matching your search.' : 'No doctors available.'}
              </div>
            ) : (
              <div role="listbox" aria-label="Doctor options">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.doctor_id}
                    type="button"
                    onClick={() => handleSelect(doctor)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none ${
                      value === doctor.doctor_id ? 'bg-accent text-accent-foreground' : ''
                    }`}
                    role="option"
                    aria-selected={value === doctor.doctor_id ? 'true' : 'false'}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{doctor.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {doctor.specialization} • ${doctor.consultation_fee}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSelect;