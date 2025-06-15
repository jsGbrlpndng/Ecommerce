// --- Dropdown user info, login, register, logout logic (copied from index.js/shop.js) ---
document.addEventListener("DOMContentLoaded", () => {
  // Dropdown logic
  fetch('/api/users/me', {
    credentials: 'include'
  })
    .then(res => {
      if (!res.ok) throw new Error('Not logged in');
      return res.json();
    })
    .then(data => {
      const usernameElem = document.getElementById('dropdown-username');
      const emailElem = document.getElementById('dropdown-email');
      if (usernameElem) usernameElem.textContent = data.username;
      if (emailElem) emailElem.textContent = data.email;
      document.getElementById('user-info-section').style.display = '';
      document.getElementById('logout-btn').style.display = '';
      document.getElementById('dropdown-login-form').style.display = 'none';
      document.getElementById('register-link-section').style.display = 'none';
    })
    .catch(() => {
      const usernameElem = document.getElementById('dropdown-username');
      const emailElem = document.getElementById('dropdown-email');
      if (usernameElem) usernameElem.textContent = "Guest";
      if (emailElem) emailElem.textContent = "";
      document.getElementById('user-info-section').style.display = '';
      document.getElementById('logout-btn').style.display = 'none';
      document.getElementById('dropdown-login-form').style.display = '';
      document.getElementById('register-link-section').style.display = '';
    });

  // Login form handler
  const loginForm = document.getElementById('dropdown-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('dropdown-login-email').value.trim();
      const password = document.getElementById('dropdown-login-password').value;
      const errorDiv = document.getElementById('dropdown-login-error');
      errorDiv.style.display = 'none';
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        });
        if (response.ok) {
          window.location.reload();
        } else {
          const error = await response.text();
          errorDiv.textContent = error || 'Invalid email or password';
          errorDiv.style.display = 'block';
        }
      } catch (error) {
        errorDiv.textContent = 'An error occurred during login';
        errorDiv.style.display = 'block';
      }
    });
  }

  // Admin Login button
  const showAdminBtn = document.getElementById('show-admin-login');
  if (showAdminBtn) {
    showAdminBtn.addEventListener('click', function() {
      window.location.href = 'admin/index.html';
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function() {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('user');
      window.location.reload();
    });
  }

  // --- Existing about.js logic below ---

  // Initialize AOS animation library if it exists
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }

  // Check team member images
  checkTeamMemberImages();

  // Add about section image fallback
  const aboutImage = document.querySelector(".about-image-container img");
  if (aboutImage) {
    aboutImage.onerror = function () {
      this.src = "/placeholder.svg?height=500&width=800&text=About+Harmony+Haven";
      console.log(`About image failed to load, using fallback`);
      this.onerror = null;
    };

    // Check if image is already loaded
    if (aboutImage.complete && aboutImage.naturalHeight === 0) {
      aboutImage.src = "/placeholder.svg?height=500&width=800&text=About+Harmony+Haven";
    }
  }
});

function checkTeamMemberImages() {
  // Get all team member image elements
  const teamImages = document.querySelectorAll(".team-member-image img");

  // Define fallback images in case the actual images fail to load
  const fallbackImages = {
    "john-doe.jpg": "/placeholder.svg?height=300&width=300&text=John+Doe",
    "jane-smith.jpg": "/placeholder.svg?height=300&width=300&text=Jane+Smith",
    "mike-johnson.jpg": "/placeholder.svg?height=300&width=300&text=Mike+Johnson",
    default: "/placeholder.svg?height=300&width=300&text=Team+Member",
  };

  // Check each image and apply fallback if needed
  teamImages.forEach((img) => {
    // Store original src
    const originalSrc = img.getAttribute("src");

    // Add error handler to replace with fallback if image fails to load
    img.onerror = function () {
      const filename = originalSrc.split("/").pop();
      console.error(`Image failed to load: ${originalSrc}`);
      this.src = fallbackImages[filename] || fallbackImages.default;
      this.onerror = null; // Prevent infinite loop
    };

    // Check if image is already loaded
    if (img.complete && img.naturalHeight === 0) {
      const filename = originalSrc.split("/").pop();
      img.src = fallbackImages[filename] || fallbackImages.default;
    }
  });
}