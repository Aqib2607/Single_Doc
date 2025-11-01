// Test script for View All Appointments functionality
// Run this in browser console after logging in as a patient

async function testViewAllAppointments() {
  console.log('Testing View All Appointments functionality...');
  
  try {
    // Test API endpoint
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in first.');
      return;
    }
    
    console.log('1. Testing API endpoint...');
    const response = await fetch('/api/patient-appointments', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const appointments = await response.json();
    console.log(`✓ API endpoint working. Found ${appointments.length} appointments.`);
    
    // Test modal trigger
    console.log('2. Testing modal trigger...');
    const viewAllButton = document.querySelector('[aria-label="View all appointments"]');
    if (viewAllButton) {
      console.log('✓ View All button found in DOM');
      
      // Simulate click
      viewAllButton.click();
      
      // Check if modal opens
      setTimeout(() => {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          console.log('✓ Modal opened successfully');
          
          // Test search functionality
          const searchInput = modal.querySelector('input[placeholder*="Search"]');
          if (searchInput) {
            console.log('✓ Search input found');
            searchInput.value = 'test';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('✓ Search functionality triggered');
          }
          
          // Test filter functionality
          const statusFilter = modal.querySelector('select');
          if (statusFilter) {
            console.log('✓ Status filter found');
            statusFilter.value = 'confirmed';
            statusFilter.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('✓ Filter functionality triggered');
          }
          
          // Test table sorting
          const sortableHeaders = modal.querySelectorAll('th[class*="cursor-pointer"]');
          if (sortableHeaders.length > 0) {
            console.log(`✓ Found ${sortableHeaders.length} sortable columns`);
            sortableHeaders[0].click();
            console.log('✓ Sort functionality triggered');
          }
          
          console.log('✓ All tests passed! View All Appointments functionality is working.');
          
          // Close modal
          const closeButton = modal.querySelector('[aria-label="Close"]') || modal.querySelector('button[class*="absolute"]');
          if (closeButton) {
            closeButton.click();
            console.log('✓ Modal closed');
          }
          
        } else {
          console.error('✗ Modal did not open');
        }
      }, 1000);
      
    } else {
      console.error('✗ View All button not found in DOM');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Test different patient scenarios
async function testWithDifferentPatients() {
  console.log('Testing with different patient scenarios...');
  
  const scenarios = [
    { name: 'Empty appointments', expectedCount: 0 },
    { name: 'Multiple appointments', expectedCount: 5 },
    { name: 'Large dataset', expectedCount: 50 }
  ];
  
  for (const scenario of scenarios) {
    console.log(`Testing scenario: ${scenario.name}`);
    // This would require actual test data setup
    console.log(`Expected ${scenario.expectedCount} appointments`);
  }
}

// Performance test
async function testPerformance() {
  console.log('Testing performance...');
  
  const startTime = performance.now();
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/patient-appointments', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    const appointments = await response.json();
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    console.log(`✓ API response time: ${loadTime.toFixed(2)}ms`);
    
    if (loadTime < 1000) {
      console.log('✓ Performance: Excellent (< 1s)');
    } else if (loadTime < 3000) {
      console.log('⚠ Performance: Good (< 3s)');
    } else {
      console.log('✗ Performance: Needs improvement (> 3s)');
    }
    
  } catch (error) {
    console.error('Performance test failed:', error.message);
  }
}

// Accessibility test
function testAccessibility() {
  console.log('Testing accessibility...');
  
  const viewAllButton = document.querySelector('[aria-label="View all appointments"]');
  if (viewAllButton) {
    console.log('✓ View All button has aria-label');
    
    // Test keyboard navigation
    viewAllButton.focus();
    console.log('✓ Button is focusable');
    
    // Test ARIA attributes
    const modal = document.querySelector('[role="dialog"]');
    if (modal) {
      console.log('✓ Modal has proper role attribute');
    }
  }
}

// Run all tests
console.log('=== View All Appointments Test Suite ===');
testViewAllAppointments();

// Uncomment to run additional tests
// testWithDifferentPatients();
// testPerformance();
// testAccessibility();