document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    if (!email || !password) {
        errorDiv.textContent = 'Please enter your email and password.';
        errorDiv.style.display = 'block';
        return;
    }

    try {
        console.log('Attempting login...');
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        console.log('Login response status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);
            
            // Store user data in localStorage
            const userData = {
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                username: data.firstName + ' ' + data.lastName // Add username for consistency
            };
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Double-check session is established
            const checkSession = await fetch('/api/users/me', {
                credentials: 'include'
            });
            
            if (checkSession.ok) {
                console.log('Session verified');
                // Check if we need to redirect to a specific page
                const params = new URLSearchParams(window.location.search);
                const redirect = params.get('redirect');
                if (redirect) {
                    // Ensure the redirect URL is relative and safe
                    const safeRedirect = redirect.replace(/^(?:[a-zA-Z]+:)?\/\//, '');
                    window.location.href = safeRedirect;
                } else {
                    // No redirect specified, go to index
                    window.location.href = 'index.html';
                }
            } else {
                throw new Error('Session verification failed');
            }
        } else {
            let errorMsg = 'Invalid email or password';
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch {
                errorMsg = await response.text() || errorMsg;
            }
            console.error('Login failed:', errorMsg);
            errorDiv.textContent = errorMsg;
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'An error occurred during login. Please try again.';
        errorDiv.style.display = 'block';
    }
});