interface Prescription {
  id: number;
  doctor_id: number;
  patient_id: number;
  patient_email?: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  refills_remaining?: number;
  patient?: {
    patient_id: number;
    name: string;
    email: string;
  };
  doctor?: {
    doctor_id: number;
    name: string;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface PrescriptionFilters {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  page?: number;
  per_page?: number;
}

class PrescriptionService {
  private baseUrl = '/api/prescriptions';
  
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getPrescriptions(filters: PrescriptionFilters = {}): Promise<PaginatedResponse<Prescription>> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    const response = await fetch(`${this.baseUrl}?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch prescriptions: ${response.statusText}`);
    }

    return response.json();
  }

  async createPrescription(data: Omit<Prescription, 'id' | 'doctor_id' | 'patient' | 'doctor'>): Promise<Prescription> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Failed to create prescription');
    }

    return response.json();
  }

  async updatePrescription(id: number, data: Partial<Prescription>): Promise<Prescription> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Failed to update prescription');
    }

    return response.json();
  }

  async deletePrescription(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete prescription: ${response.statusText}`);
    }
  }

  async bulkUpdate(prescriptionIds: number[], action: 'activate' | 'deactivate' | 'delete'): Promise<void> {
    const response = await fetch(`${this.baseUrl}/bulk-update`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        prescription_ids: prescriptionIds,
        action,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Bulk operation failed');
    }
  }
}

export const prescriptionService = new PrescriptionService();
export type { Prescription, PrescriptionFilters, PaginatedResponse };