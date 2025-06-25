document.addEventListener('DOMContentLoaded', async function() {
    const errorDiv = document.getElementById('profile-error');
    const successDiv = document.getElementById('profile-success');
    const form = document.getElementById('profileForm');

    // Fetch current user info
    try {
        const response = await fetch('/api/users/me', { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('firstName').value = data.firstName || '';
            document.getElementById('lastName').value = data.lastName || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            // Enable form fields in case they were disabled
            form.querySelectorAll('input,button').forEach(el => el.disabled = false);
        } else {
            errorDiv.textContent = 'Could not load profile. Please log in.';
            errorDiv.style.display = 'block';
            form.querySelectorAll('input,button').forEach(el => el.disabled = true);
        }
    } catch (e) {
        errorDiv.textContent = 'Error loading profile.';
        errorDiv.style.display = 'block';
        form.querySelectorAll('input,button').forEach(el => el.disabled = true);
    }

    // Handle form submit
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';

        const payload = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim()
        };

        try {
            const response = await fetch('/api/users/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                successDiv.textContent = 'Profile updated successfully!';
                successDiv.style.display = 'block';
            } else {
                let errorMsg = 'Failed to update profile.';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch {
                    errorMsg = await response.text() || errorMsg;
                }
                errorDiv.textContent = errorMsg;
                errorDiv.style.display = 'block';
            }
        } catch (e) {
            errorDiv.textContent = 'Error updating profile.';
            errorDiv.style.display = 'block';
        }
    });
});
