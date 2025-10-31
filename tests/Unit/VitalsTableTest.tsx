import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import VitalsTable from '@/components/VitalsTable';
import { AuthContext } from '@/contexts/AuthContext';

// Mock fetch
global.fetch = vi.fn();

const mockUser = {
  id: 1,
  name: 'Test Patient',
  email: 'test@example.com',
  role: 'patient'
};

const mockVitalsResponse = {
  data: [
    {
      id: 1,
      vital_type: 'heart_rate',
      value: 72,
      unit: 'bpm',
      recorded_at: '2024-01-15T10:00:00Z',
      recorded_by: 'Dr. Smith',
      notes: 'Normal reading',
      is_abnormal: false
    },
    {
      id: 2,
      vital_type: 'blood_pressure_systolic',
      value: 140,
      unit: 'mmHg',
      recorded_at: '2024-01-15T10:05:00Z',
      recorded_by: 'Nurse Johnson',
      notes: null,
      is_abnormal: true
    }
  ],
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 50,
    total: 2
  },
  last_updated: '2024-01-15T10:30:00Z'
};

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthContext.Provider value={{ user: mockUser, login: vi.fn(), logout: vi.fn(), loading: false }}>
      {component}
    </AuthContext.Provider>
  );
};

describe('VitalsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'mock-token');
  });

  it('renders vitals table with data', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVitalsResponse
    });

    renderWithAuth(<VitalsTable />);

    await waitFor(() => {
      expect(screen.getByText('Vital Signs')).toBeInTheDocument();
      expect(screen.getByText('Heart Rate')).toBeInTheDocument();
      expect(screen.getByText('72 bpm')).toBeInTheDocument();
      expect(screen.getByText('Normal')).toBeInTheDocument();
      expect(screen.getByText('Abnormal')).toBeInTheDocument();
    });
  });

  it('handles refresh button click', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockVitalsResponse
    });

    renderWithAuth(<VitalsTable />);

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles sorting functionality', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockVitalsResponse
    });

    renderWithAuth(<VitalsTable />);

    await waitFor(() => {
      expect(screen.getByText('Vital Type')).toBeInTheDocument();
    });

    const vitalTypeHeader = screen.getByText('Vital Type');
    fireEvent.click(vitalTypeHeader);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('sort_by=vital_type&sort_order=desc'),
      expect.any(Object)
    );
  });

  it('displays loading state', () => {
    (fetch as any).mockImplementation(() => new Promise(() => {}));

    renderWithAuth(<VitalsTable />);

    expect(screen.getByText('Loading vitals...')).toBeInTheDocument();
  });

  it('displays empty state when no vitals', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockVitalsResponse, data: [] })
    });

    renderWithAuth(<VitalsTable />);

    await waitFor(() => {
      expect(screen.getByText('No vital signs recorded yet')).toBeInTheDocument();
    });
  });
});