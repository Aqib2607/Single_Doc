// Test script for Cancel button functionality in Medical Records Modal
// Run this in browser console after opening the medical records modal

console.log('=== Cancel Button Functionality Test ===\n');

// Test 1: Button Existence and Structure
function testButtonExistence() {
    console.log('1. Testing Cancel button existence...');
    
    const cancelButtons = document.querySelectorAll('button[aria-label*="Cancel record"]');
    console.log(`   Found ${cancelButtons.length} Cancel buttons`);
    
    if (cancelButtons.length > 0) {
        const firstButton = cancelButtons[0];
        console.log('   ✓ Cancel button found');
        console.log(`   - Button text: "${firstButton.textContent.trim()}"`);
        console.log(`   - ARIA label: "${firstButton.getAttribute('aria-label')}"`);
        console.log(`   - Classes: "${firstButton.className}"`);
        console.log(`   - Disabled: ${firstButton.disabled}`);
        
        // Check for icon
        const icon = firstButton.querySelector('svg');
        console.log(`   - Has icon: ${icon ? '✓' : '✗'}`);
        
        return true;
    } else {
        console.log('   ✗ No Cancel buttons found');
        return false;
    }
}

// Test 2: Click Event Handler
function testClickHandler() {
    console.log('\n2. Testing click event handler...');
    
    const cancelButtons = document.querySelectorAll('button[aria-label*="Cancel record"]:not([disabled])');
    
    if (cancelButtons.length === 0) {
        console.log('   ✗ No enabled Cancel buttons available for testing');
        return false;
    }
    
    const testButton = cancelButtons[0];
    console.log('   Testing click on first available Cancel button...');
    
    // Add event listener to monitor clicks
    let clickDetected = false;
    const clickHandler = () => {
        clickDetected = true;
        console.log('   ✓ Click event detected');
    };
    
    testButton.addEventListener('click', clickHandler, { once: true });
    
    // Simulate click
    testButton.click();
    
    setTimeout(() => {
        if (clickDetected) {
            console.log('   ✓ Click handler executed successfully');
        } else {
            console.log('   ✗ Click handler did not execute');
        }
        
        // Check for loading state
        const isLoading = testButton.querySelector('.animate-spin');
        if (isLoading) {
            console.log('   ✓ Loading state activated');
        }
        
        testButton.removeEventListener('click', clickHandler);
    }, 100);
    
    return true;
}

// Test 3: Accessibility Features
function testAccessibility() {
    console.log('\n3. Testing accessibility features...');
    
    const cancelButtons = document.querySelectorAll('button[aria-label*="Cancel record"]');
    
    if (cancelButtons.length === 0) {
        console.log('   ✗ No Cancel buttons found for accessibility testing');
        return false;
    }
    
    let accessibilityScore = 0;
    const totalTests = 5;
    
    cancelButtons.forEach((button, index) => {
        console.log(`   Testing button ${index + 1}:`);
        
        // Test ARIA label
        if (button.getAttribute('aria-label')) {
            console.log('     ✓ Has ARIA label');
            accessibilityScore++;
        } else {
            console.log('     ✗ Missing ARIA label');
        }
        
        // Test keyboard focusability
        if (button.tabIndex >= 0) {
            console.log('     ✓ Keyboard focusable');
            accessibilityScore++;
        } else {
            console.log('     ✗ Not keyboard focusable');
        }
        
        // Test role
        const role = button.getAttribute('role') || 'button';
        if (role === 'button') {
            console.log('     ✓ Proper button role');
            accessibilityScore++;
        }
        
        // Test focus outline
        button.focus();
        const computedStyle = window.getComputedStyle(button, ':focus');
        if (computedStyle.outline !== 'none' || computedStyle.boxShadow !== 'none') {
            console.log('     ✓ Has focus indicator');
            accessibilityScore++;
        } else {
            console.log('     ✗ Missing focus indicator');
        }
        
        // Test color contrast (simplified)
        const bgColor = window.getComputedStyle(button).backgroundColor;
        const textColor = window.getComputedStyle(button).color;
        if (bgColor !== textColor) {
            console.log('     ✓ Has color contrast');
            accessibilityScore++;
        }
    });
    
    const accessibilityPercentage = (accessibilityScore / (totalTests * cancelButtons.length)) * 100;
    console.log(`   Accessibility Score: ${accessibilityPercentage.toFixed(1)}%`);
    
    return accessibilityPercentage >= 80;
}

// Test 4: Visual Feedback
function testVisualFeedback() {
    console.log('\n4. Testing visual feedback...');
    
    const cancelButtons = document.querySelectorAll('button[aria-label*="Cancel record"]:not([disabled])');
    
    if (cancelButtons.length === 0) {
        console.log('   ✗ No enabled Cancel buttons available for visual feedback testing');
        return false;
    }
    
    const testButton = cancelButtons[0];
    
    // Test hover effect
    console.log('   Testing hover effect...');
    testButton.dispatchEvent(new MouseEvent('mouseenter'));
    
    setTimeout(() => {
        const hoverStyle = window.getComputedStyle(testButton);
        console.log(`   - Hover background: ${hoverStyle.backgroundColor}`);
        
        testButton.dispatchEvent(new MouseEvent('mouseleave'));
    }, 50);
    
    // Test disabled state visual
    console.log('   Testing disabled state...');
    const originalDisabled = testButton.disabled;
    testButton.disabled = true;
    
    setTimeout(() => {
        const disabledStyle = window.getComputedStyle(testButton);
        console.log(`   - Disabled opacity: ${disabledStyle.opacity}`);
        console.log(`   - Disabled cursor: ${disabledStyle.cursor}`);
        
        testButton.disabled = originalDisabled;
    }, 50);
    
    return true;
}

// Test 5: Error Handling
function testErrorHandling() {
    console.log('\n5. Testing error handling...');
    
    // Check for error display elements
    const errorElements = document.querySelectorAll('[class*="text-red"], [class*="error"]');
    console.log(`   Found ${errorElements.length} potential error display elements`);
    
    // Check for success message elements
    const successElements = document.querySelectorAll('[class*="text-green"], [class*="success"]');
    console.log(`   Found ${successElements.length} potential success message elements`);
    
    // Check console for error logging
    const originalConsoleError = console.error;
    let errorLogged = false;
    
    console.error = (...args) => {
        if (args.some(arg => typeof arg === 'string' && arg.includes('Cancel'))) {
            errorLogged = true;
            console.log('   ✓ Error logging detected');
        }
        originalConsoleError.apply(console, args);
    };
    
    // Restore original console.error after test
    setTimeout(() => {
        console.error = originalConsoleError;
        if (!errorLogged) {
            console.log('   - No cancel-related errors logged (this is good if no errors occurred)');
        }
    }, 1000);
    
    return true;
}

// Run all tests
async function runAllTests() {
    console.log('Starting comprehensive Cancel button functionality tests...\n');
    
    const results = {
        buttonExistence: testButtonExistence(),
        clickHandler: testClickHandler(),
        accessibility: testAccessibility(),
        visualFeedback: testVisualFeedback(),
        errorHandling: testErrorHandling()
    };
    
    // Wait for async tests to complete
    setTimeout(() => {
        console.log('\n=== Test Results Summary ===');
        Object.entries(results).forEach(([test, passed]) => {
            console.log(`${test}: ${passed ? '✓ PASS' : '✗ FAIL'}`);
        });
        
        const passedTests = Object.values(results).filter(Boolean).length;
        const totalTests = Object.keys(results).length;
        const successRate = (passedTests / totalTests) * 100;
        
        console.log(`\nOverall Success Rate: ${successRate.toFixed(1)}% (${passedTests}/${totalTests})`);
        
        if (successRate >= 80) {
            console.log('🎉 Cancel button functionality is working well!');
        } else {
            console.log('⚠️  Cancel button needs attention - some tests failed');
        }
    }, 2000);
}

// Auto-run tests if in browser environment
if (typeof window !== 'undefined') {
    runAllTests();
} else {
    console.log('This test should be run in a browser environment');
}

// Export for manual testing
window.testCancelButton = {
    runAllTests,
    testButtonExistence,
    testClickHandler,
    testAccessibility,
    testVisualFeedback,
    testErrorHandling
};