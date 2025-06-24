document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
    const email     = document.getElementById('email').value.trim();
    const password  = document.getElementById('password').value;
    const phone     = document.getElementById('phone').value.trim();

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
        alert('Please fill in all required fields.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password, phone })
        });

        if (response.ok) {
            alert('Registration successful! Please log in.');
            window.location.href = 'login.html';
        } else {
            let errorMsg = 'Registration failed.';
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch {
                errorMsg = await response.text() || errorMsg;
            }
            alert(errorMsg);
        }
    } catch (error) {
        alert('Registration failed. Please try again.');
        console.error('Registration error:', error);
    }
});