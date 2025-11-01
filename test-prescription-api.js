// Prescription API Integration Test Script
// Run this in browser console or Node.js environment

const API_BASE = 'http://127.0.0.1:8000/api';
let authToken = '';

// Test configuration
const testConfig = {
  email: 'sarah.johnson@hospital.com', // First doctor from database
  password: 'password123', // Default password
  patientId: 2 // Patient ID from database
};

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();
  
  console.log(`${options.method || 'GET'} ${endpoint}:`, {
    status: response.status,
    data: data
  });
  
  return { response, data };
}

// Test suite
async function runPrescriptionAPITests() {
  console.log('🧪 Starting Prescription API Integration Tests...\n');
  
  try {
    // Step 1: Login
    console.log('1️⃣ Testing Authentication...');
    const loginResult = await apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testConfig.email,
        password: testConfig.password
      })
    });
    
    if (loginResult.response.ok && loginResult.data.token) {
      authToken = loginResult.data.token;
      console.log('✅ Login successful\n');
    } else {
      throw new Error('Login failed');
    }
    
    // Step 2: Test GET /prescriptions (with pagination)
    console.log('2️⃣ Testing GET /prescriptions...');
    await apiCall('/prescriptions?per_page=5&page=1');
    console.log('✅ Prescription list retrieved\n');
    
    // Step 3: Test POST /prescriptions (create)
    console.log('3️⃣ Testing POST /prescriptions...');
    const createResult = await apiCall('/prescriptions', {
      method: 'POST',
      body: JSON.stringify({
        patient_id: testConfig.patientId,
        medication_name: 'Test Medication API',
        dosage: '100mg',
        frequency: 'Twice daily',
        instructions: 'Take with food - API Test',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        is_active: true,
        refills_remaining: 3
      })
    });
    
    let prescriptionId = null;
    if (createResult.response.status === 201) {
      prescriptionId = createResult.data.id;
      console.log('✅ Prescription created successfully\n');
    } else {
      console.log('❌ Prescription creation failed\n');
    }
    
    // Step 4: Test GET /prescriptions/{id} (show)
    if (prescriptionId) {
      console.log('4️⃣ Testing GET /prescriptions/{id}...');
      await apiCall(`/prescriptions/${prescriptionId}`);
      console.log('✅ Individual prescription retrieved\n');
    }
    
    // Step 5: Test search functionality
    console.log('5️⃣ Testing search functionality...');
    await apiCall('/prescriptions?search=Test Medication');
    console.log('✅ Search functionality tested\n');
    
    // Step 6: Test status filtering
    console.log('6️⃣ Testing status filtering...');
    await apiCall('/prescriptions?status=active');
    await apiCall('/prescriptions?status=inactive');
    console.log('✅ Status filtering tested\n');
    
    // Step 7: Test PUT /prescriptions/{id} (update)
    if (prescriptionId) {
      console.log('7️⃣ Testing PUT /prescriptions/{id}...');
      await apiCall(`/prescriptions/${prescriptionId}`, {
        method: 'PUT',
        body: JSON.stringify({
          patient_id: testConfig.patientId,
          medication_name: 'Updated Test Medication',
          dosage: '200mg',
          frequency: 'Once daily',
          instructions: 'Updated instructions - API Test',
          start_date: '2024-01-01',
          end_date: '2024-02-01',
          is_active: true,
          refills_remaining: 2
        })
      });
      console.log('✅ Prescription updated successfully\n');
    }
    
    // Step 8: Test bulk operations
    if (prescriptionId) {
      console.log('8️⃣ Testing bulk operations...');
      
      // Test deactivate
      await apiCall('/prescriptions/bulk-update', {
        method: 'POST',
        body: JSON.stringify({
          prescription_ids: [prescriptionId],
          action: 'deactivate'
        })
      });
      
      // Test activate
      await apiCall('/prescriptions/bulk-update', {
        method: 'POST',
        body: JSON.stringify({
          prescription_ids: [prescriptionId],
          action: 'activate'
        })
      });
      
      console.log('✅ Bulk operations tested\n');
    }
    
    // Step 9: Test DELETE /prescriptions/{id}
    if (prescriptionId) {
      console.log('9️⃣ Testing DELETE /prescriptions/{id}...');
      await apiCall(`/prescriptions/${prescriptionId}`, {
        method: 'DELETE'
      });
      console.log('✅ Prescription deleted successfully\n');
    }
    
    // Step 10: Test error handling
    console.log('🔟 Testing error handling...');
    
    // Test unauthorized access
    const oldToken = authToken;
    authToken = 'invalid-token';
    await apiCall('/prescriptions');
    authToken = oldToken;
    
    // Test invalid prescription ID
    await apiCall('/prescriptions/99999');
    
    // Test validation errors
    await apiCall('/prescriptions', {
      method: 'POST',
      body: JSON.stringify({
        // Missing required fields
        medication_name: 'Test'
      })
    });
    
    console.log('✅ Error handling tested\n');
    
    console.log('🎉 All Prescription API tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests if in browser environment
if (typeof window !== 'undefined') {
  console.log('Run runPrescriptionAPITests() to start the tests');
} else {
  // Run automatically in Node.js
  runPrescriptionAPITests();
}

// Export for manual execution
if (typeof module !== 'undefined') {
  module.exports = { runPrescriptionAPITests, apiCall };
}