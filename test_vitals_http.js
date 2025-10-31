// Test script to verify vitals HTTP API endpoint
const baseUrl = 'http://localhost:8000'; // Adjust if needed

async function testVitalsAPI() {
    console.log('=== Vitals HTTP API Test ===\n');
    
    try {
        // First, try to login to get a token
        console.log('1. Attempting login...');
        const loginResponse = await fetch(`${baseUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                email: 'john.smith@email.com',
                password: 'password123'
            })
        });
        
        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
        }
        
        const loginData = await loginResponse.json();
        console.log('Login successful!');
        console.log('User ID:', loginData.user.id);
        console.log('User Role:', loginData.user.role);
        console.log('Token received:', loginData.token ? 'Yes' : 'No');
        
        // Now test the vitals endpoint
        console.log('\n2. Testing vitals endpoint...');
        const vitalsResponse = await fetch(`${baseUrl}/api/patients/${loginData.user.id}/vitals`, {
            headers: {
                'Authorization': `Bearer ${loginData.token}`,
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        console.log('Vitals API response status:', vitalsResponse.status);
        
        if (vitalsResponse.ok) {
            const vitalsData = await vitalsResponse.json();
            console.log('Vitals data received successfully!');
            console.log('Total vitals:', vitalsData.data.length);
            console.log('Pagination info:', vitalsData.pagination);
            console.log('Last updated:', vitalsData.last_updated);
            
            if (vitalsData.data.length > 0) {
                console.log('\nFirst vital record:');
                console.log(JSON.stringify(vitalsData.data[0], null, 2));
            }
        } else {
            const errorText = await vitalsResponse.text();
            console.error('Vitals API error:', vitalsResponse.status, errorText);
        }
        
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Run the test
testVitalsAPI();