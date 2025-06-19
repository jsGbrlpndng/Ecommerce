document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('admin-login-form');
    if (!form) return;
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('admin-login-error');
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                window.location.href = 'index.html';
            } else {
                const errorText = await response.text();
                errorDiv.textContent = errorText || 'Invalid credentials';
                errorDiv.style.display = 'block';
            }
        } catch (err) {
            errorDiv.textContent = 'Login failed. Please try again.';
            errorDiv.style.display = 'block';
        }
    });
});
