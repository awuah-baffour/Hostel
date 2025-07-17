document.addEventListener("DOMContentLoaded", () => {
  // Search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      document.querySelectorAll(".card").forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const location = card.dataset.location.toLowerCase();
        card.style.display = (name.includes(filter) || location.includes(filter)) ? "block" : "none";
      });
    });
  }

  // Form validation
  const forms = document.querySelectorAll("form");
  forms.forEach(form => {
    form.addEventListener("submit", e => {
      const inputs = form.querySelectorAll("input[required], select[required]");
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.border = "2px solid red";
          valid = false;
        } else {
          input.style.border = "1px solid #ccc";
        }
      });
      if (!valid) {
        e.preventDefault();
        alert("Please fill out all required fields.");
      }
    });
  });

  // Password toggle
  const passwordInput = document.getElementById("passwordInput");
  const togglePassword = document.getElementById("togglePassword");
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.querySelector('img').src = "images/eye-off.svg";
        togglePassword.querySelector('img').alt = "Hide password";
      } else {
        passwordInput.type = "password";
        togglePassword.querySelector('img').src = "images/eye.svg";
        togglePassword.querySelector('img').alt = "Show password";
      }
    });
  }

  // Check authentication on protected pages
  const protectedPages = ['tenant.html', 'admin.html'];
  if (protectedPages.some(page => window.location.pathname.includes(page))) {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
    }
  }

  // Logout functionality
  const logoutButtons = document.querySelectorAll('#logout-btn');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'login.html';
    });
  });
});

// API Functions
async function loadHostels(campus) {
  try {
    const response = await fetch(`https://hostel-backend-b6e8.onrender.com/api/hostels?campus=${campus}`);
    return await response.json();
  } catch (error) {
    console.error('Error loading hostels:', error);
    return [];
  }
}

async function createBooking(bookingData) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://hostel-backend-b6e8.onrender.com/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    return await response.json();
  } catch (error) {
    console.error('Booking error:', error);
    return { error: 'Booking failed' };
  }
}

async function getUserBookings(userId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://hostel-backend-b6e8.onrender.com/api/bookings/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

async function confirmBooking(bookingId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://hostel-backend-b6e8.onrender.com/api/bookings/${bookingId}/confirm`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    console.error('Error confirming booking:', error);
    return { error: 'Confirmation failed' };
  }
}