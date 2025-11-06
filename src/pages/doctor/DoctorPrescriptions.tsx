import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSidebar from '@/components/DoctorSidebar';
import { ClipboardList, Pill, Plus, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    instructions: '',
    is_active: true,
    medicines: [{ medicine_name: '', dosage: '', frequency: '', start_date: '', end_date: '', refills_remaining: '', instructions: '' }],
    tests: [{ test_name: '', description: '', instructions: '' }]
  });


  const fetchPrescriptions = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      
      const response = await fetch(`/api/prescriptions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data.data || data);
        setCurrentPage(data.current_page || 1);
        setTotalPages(data.last_page || 1);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setError('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    fetchPrescriptions(1);
  }, [fetchPrescriptions]);

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, [fetchPrescriptions]);
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearch();
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter, handleSearch]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patients-and-guests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched patients and guests:', data);
        setPatients(data);
      } else {
        console.error('Failed to fetch patients and guests:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching patients and guests:', error);
    }
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { medicine_name: '', dosage: '', frequency: '', start_date: '', end_date: '', refills_remaining: '', instructions: '' }]
    });
  };

  const removeMedicine = (index) => {
    if (formData.medicines.length > 1) {
      setFormData({
        ...formData,
        medicines: formData.medicines.filter((_, i) => i !== index)
      });
    }
  };

  const updateMedicine = (index, field, value) => {
    const updatedMedicines = [...formData.medicines];
    updatedMedicines[index][field] = value;
    setFormData({ ...formData, medicines: updatedMedicines });
  };

  const addTest = () => {
    setFormData({
      ...formData,
      tests: [...formData.tests, { test_name: '', description: '', instructions: '' }]
    });
  };

  const removeTest = (index) => {
    if (formData.tests.length > 1) {
      setFormData({
        ...formData,
        tests: formData.tests.filter((_, i) => i !== index)
      });
    }
  };

  const updateTest = (index, field, value) => {
    const updatedTests = [...formData.tests];
    updatedTests[index][field] = value;
    setFormData({ ...formData, tests: updatedTests });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.patient_id) {
      setError('Please select a patient');
      return;
    }
    
    // Validate medicines
    const validMedicines = formData.medicines.filter(m => m.medicine_name && m.dosage && m.frequency && m.start_date);
    const validTests = formData.tests.filter(t => t.test_name);
    
    if (validMedicines.length === 0 && validTests.length === 0) {
      setError('Please add at least one medicine or test');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const url = editingId ? `/api/prescriptions/${editingId}` : '/api/prescriptions';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          medicines: validMedicines.length > 0 ? validMedicines : undefined,
          tests: validTests.length > 0 ? validTests : undefined
        })
      });
      
      if (response.ok) {
        await fetchPrescriptions(currentPage);
        resetForm();
        setSuccess(editingId ? 'Prescription updated successfully!' : 'Prescription added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        setError(errorData.message || 'Failed to save prescription');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      patient_id: '', 
      instructions: '', 
      is_active: true,
      medicines: [{ medicine_name: '', dosage: '', frequency: '', start_date: '', end_date: '', refills_remaining: '', instructions: '' }],
      tests: [{ test_name: '', description: '', instructions: '' }]
    });
    setShowForm(false);
    setEditingId(null);
    setError('');
    setSuccess('');
  };
  
  const handleEdit = (prescription) => {
    const patientId = prescription.patient_id ? prescription.patient_id.toString() : `guest_${prescription.guest_id}`;
    setFormData({
      patient_id: patientId,
      instructions: prescription.instructions || '',
      is_active: prescription.is_active,
      medicines: prescription.medicines?.length > 0 ? prescription.medicines : [{ medicine_name: '', dosage: '', frequency: '', start_date: '', end_date: '', refills_remaining: '', instructions: '' }],
      tests: prescription.tests?.length > 0 ? prescription.tests : [{ test_name: '', description: '', instructions: '' }]
    });
    setEditingId(prescription.id);
    setShowForm(true);
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/prescriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        await fetchPrescriptions(currentPage);
        setSuccess('Prescription deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete prescription');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    }
  };
  
  const handleBulkAction = async (action) => {
    if (selectedPrescriptions.length === 0) {
      setError('Please select prescriptions first');
      return;
    }
    
    if (!confirm(`Are you sure you want to ${action} selected prescriptions?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/prescriptions/bulk-update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prescription_ids: selectedPrescriptions,
          action
        })
      });
      
      if (response.ok) {
        await fetchPrescriptions(currentPage);
        setSelectedPrescriptions([]);
        setSuccess(`Prescriptions ${action}d successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(`Failed to ${action} prescriptions`);
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    }
  };
  

  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPrescriptions(page);
  };



  return (
    <>
      <Helmet>
        <title>Prescriptions - Doctor Dashboard</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-20">
          <DoctorSidebar />
          <main className="flex-1 px-6 py-8">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-8 animate-fade-in-up">
                <h1 className="text-4xl font-display font-bold text-gradient mb-4">Prescriptions</h1>
                <p className="text-xl text-muted-foreground">Manage patient prescriptions and medications</p>
              </div>

              <Card className="shadow-card border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      Prescriptions Management
                    </CardTitle>
                    <CardDescription>View and manage patient medications</CardDescription>
                  </div>
                  <Button onClick={() => setShowForm(true)} className="gradient-primary shadow-elegant">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prescription
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* Search and Filter Controls */}
                  <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by medication or patient name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                        <SelectItem value="inactive">Inactive Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Bulk Actions */}
                  {selectedPrescriptions.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-blue-700">
                        {selectedPrescriptions.length} prescription(s) selected
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                          Activate
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction('deactivate')}>
                          Deactivate
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                  {showForm && (
                    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingId ? 'Edit Prescription' : 'New Prescription'}</h3>
                        <Button type="button" onClick={resetForm} variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                          {success}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Patient *</Label>
                          <Select value={formData.patient_id} onValueChange={(value) => setFormData({...formData, patient_id: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient" />
                            </SelectTrigger>
                            <SelectContent>
                              {patients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id.toString()}>{patient.display_name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Status</Label>
                          <Select value={formData.is_active.toString()} onValueChange={(value) => setFormData({...formData, is_active: value === 'true'})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Active</SelectItem>
                              <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label>General Instructions</Label>
                          <Textarea value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} placeholder="General instructions for the patient" />
                        </div>
                        
                        {/* Medicines Section */}
                        <div className="col-span-2">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-lg font-semibold">Medicines</Label>
                            <Button type="button" onClick={addMedicine} variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-1" />
                              Add Medicine
                            </Button>
                          </div>
                          {formData.medicines.map((medicine, index) => (
                            <div key={index} className="border border-border rounded-lg p-4 mb-3 bg-muted/30">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">Medicine {index + 1}</h4>
                                {formData.medicines.length > 1 && (
                                  <Button type="button" onClick={() => removeMedicine(index)} variant="destructive" size="sm">
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <div>
                                  <Label>Medicine Name *</Label>
                                  <Input 
                                    value={medicine.medicine_name} 
                                    onChange={(e) => updateMedicine(index, 'medicine_name', e.target.value)} 
                                    placeholder="Medicine name" 
                                  />
                                </div>
                                <div>
                                  <Label>Dosage *</Label>
                                  <Input 
                                    value={medicine.dosage} 
                                    onChange={(e) => updateMedicine(index, 'dosage', e.target.value)} 
                                    placeholder="e.g., 100mg" 
                                  />
                                </div>
                                <div>
                                  <Label>Frequency *</Label>
                                  <Select value={medicine.frequency} onValueChange={(value) => updateMedicine(index, 'frequency', value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Once daily">Once daily</SelectItem>
                                      <SelectItem value="Twice daily">Twice daily</SelectItem>
                                      <SelectItem value="Three times daily">Three times daily</SelectItem>
                                      <SelectItem value="Four times daily">Four times daily</SelectItem>
                                      <SelectItem value="As needed">As needed</SelectItem>
                                      <SelectItem value="Weekly">Weekly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Start Date *</Label>
                                  <Input 
                                    type="date"
                                    value={medicine.start_date} 
                                    onChange={(e) => updateMedicine(index, 'start_date', e.target.value)} 
                                  />
                                </div>
                                <div>
                                  <Label>End Date</Label>
                                  <Input 
                                    type="date"
                                    value={medicine.end_date} 
                                    onChange={(e) => updateMedicine(index, 'end_date', e.target.value)} 
                                    min={medicine.start_date}
                                  />
                                </div>
                                <div>
                                  <Label>Refills Remaining</Label>
                                  <Input 
                                    type="number"
                                    min="0"
                                    value={medicine.refills_remaining} 
                                    onChange={(e) => updateMedicine(index, 'refills_remaining', e.target.value)} 
                                    placeholder="0"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <Label>Instructions</Label>
                                  <Textarea 
                                    value={medicine.instructions} 
                                    onChange={(e) => updateMedicine(index, 'instructions', e.target.value)} 
                                    placeholder="Specific instructions for this medicine" 
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Tests Section */}
                        <div className="col-span-2">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-lg font-semibold">Tests</Label>
                            <Button type="button" onClick={addTest} variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-1" />
                              Add Test
                            </Button>
                          </div>
                          {formData.tests.map((test, index) => (
                            <div key={index} className="border border-border rounded-lg p-4 mb-3 bg-muted/30">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">Test {index + 1}</h4>
                                {formData.tests.length > 1 && (
                                  <Button type="button" onClick={() => removeTest(index)} variant="destructive" size="sm">
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <Label>Test Name *</Label>
                                  <Input 
                                    value={test.test_name} 
                                    onChange={(e) => updateTest(index, 'test_name', e.target.value)} 
                                    placeholder="Test name" 
                                  />
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <Textarea 
                                    value={test.description} 
                                    onChange={(e) => updateTest(index, 'description', e.target.value)} 
                                    placeholder="Test description" 
                                    rows={2}
                                  />
                                </div>
                                <div>
                                  <Label>Instructions</Label>
                                  <Textarea 
                                    value={test.instructions} 
                                    onChange={(e) => updateTest(index, 'instructions', e.target.value)} 
                                    placeholder="Specific instructions for this test" 
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="col-span-2">
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Saving...' : (editingId ? 'Update Prescription' : 'Add Prescription')}
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading prescriptions...
                      </div>
                    ) : prescriptions.map((prescription) => {
                      const patient = patients.find(p => 
                        (prescription.patient_id && p.id === prescription.patient_id) ||
                        (prescription.guest_id && p.id === `guest_${prescription.guest_id}`)
                      );
                      const startDate = prescription.start_date ? new Date(prescription.start_date).toLocaleDateString() : null;
                      const endDate = prescription.end_date ? new Date(prescription.end_date).toLocaleDateString() : null;
                      
                      return (
                      <div key={prescription.id} className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedPrescriptions.includes(prescription.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPrescriptions([...selectedPrescriptions, prescription.id]);
                              } else {
                                setSelectedPrescriptions(selectedPrescriptions.filter(id => id !== prescription.id));
                              }
                            }}
                            className="mr-2"
                            aria-label={`Select prescription for ${patient ? patient.display_name : (prescription.patient_id ? `Patient ID: ${prescription.patient_id}` : `Guest ID: ${prescription.guest_id}`)}`}
                          />
                          <Pill className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {patient ? patient.display_name : (prescription.patient_id ? `Patient ID: ${prescription.patient_id}` : `Guest ID: ${prescription.guest_id}`)}
                            </h3>
                            {prescription.medication_name && (
                              <>
                                <p className="text-sm text-primary font-medium">{prescription.medication_name}</p>
                                <p className="text-sm text-muted-foreground">Dosage: {prescription.dosage} | Frequency: {prescription.frequency}</p>
                              </>
                            )}
                            {prescription.medicines && prescription.medicines.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-primary">Medicines:</p>
                                {prescription.medicines.map((medicine, idx) => (
                                  <div key={idx} className="ml-2 mt-1">
                                    <p className="text-sm font-medium">{medicine.medicine_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {medicine.dosage} | {medicine.frequency}
                                      {medicine.start_date && ` | Start: ${new Date(medicine.start_date).toLocaleDateString()}`}
                                      {medicine.end_date && ` | End: ${new Date(medicine.end_date).toLocaleDateString()}`}
                                      {medicine.refills_remaining && ` | Refills: ${medicine.refills_remaining}`}
                                    </p>
                                    {medicine.instructions && (
                                      <p className="text-xs text-muted-foreground italic">{medicine.instructions}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {prescription.tests && prescription.tests.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-primary">Tests:</p>
                                {prescription.tests.map((test, idx) => (
                                  <div key={idx} className="ml-2 mt-1">
                                    <p className="text-sm font-medium">{test.test_name}</p>
                                    {test.description && (
                                      <p className="text-xs text-muted-foreground">{test.description}</p>
                                    )}
                                    {test.instructions && (
                                      <p className="text-xs text-muted-foreground italic">{test.instructions}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground">Start: {startDate}{endDate ? ` | End: ${endDate}` : ''}</p>
                            {prescription.refills_remaining && (
                              <p className="text-sm text-muted-foreground">Refills: {prescription.refills_remaining}</p>
                            )}
                            {prescription.instructions && (
                              <p className="text-sm text-muted-foreground mt-1 italic">{prescription.instructions}</p>
                            )}
                            <p className={`text-xs mt-1 ${prescription.is_active ? 'text-green-600' : 'text-red-600'}`}>
                              {prescription.is_active ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(prescription)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(prescription.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      );
                    })}
                    {!loading && prescriptions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No prescriptions found.
                      </div>
                    )}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DoctorPrescriptions;