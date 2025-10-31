// Simple test script to debug the blogs API endpoint
async function testBlogsAPI() {
    try {
        console.log('Testing /api/blogs endpoint...');
        
        const response = await fetch('http://127.0.0.1:8000/api/blogs');
        
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const data = await response.json();
            console.log('Success! Data:', data);
            console.log('Data type:', typeof data);
            console.log('Is array:', Array.isArray(data));
            console.log('Length:', data.length);
        } else {
            const errorText = await response.text();
            console.error('Error response:', errorText);
        }
    } catch (error) {
        console.error('Network error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
}

// Run the test
testBlogsAPI();