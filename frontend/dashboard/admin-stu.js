// Render bookings into the bookings table
window.renderBookingsTable = function(bookings) {
  const tbody = document.querySelector('#pending-bookings-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!Array.isArray(bookings) || bookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
    return;
  }
  bookings.forEach(booking => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${booking.user?.fullName || 'N/A'}</td>
      <td>${booking.hostel?.name || 'N/A'}</td>
      <td>${booking.roomType || ''}</td>
      <td>${booking.user?.gender ? booking.user.gender.charAt(0).toUpperCase() + booking.user.gender.slice(1) : 'N/A'}</td>
      <td>${booking.roomNumber || '-'}</td>
      <td>${booking.amount ? 'GHS ' + booking.amount : ''}</td>
      <td><span class="badge ${booking.status}">${booking.status || ''}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-view" onclick="window.showBookingModal('${booking._id}')">View</button>
          ${booking.status === 'pending' ? `<button class="btn-approve" onclick="window.confirmBooking('${booking._id}')">Approve</button><button class="btn-reject" onclick="window.cancelBooking('${booking._id}')">Reject</button>` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

// Render profile requests into the profile requests table
window.renderProfileRequestsTable = function(requests) {
  const tbody = document.querySelector('#profile-requests-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!Array.isArray(requests) || requests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">No profile requests found.</td></tr>';
    return;
  }
  requests.forEach(req => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${req.tenantName || req.currentName || ''}</td>
      <td>${req.currentName || ''}</td>
      <td>${req.newName || ''}</td>
      <td>${req.currentEmail || ''}</td>
      <td>${req.newEmail || ''}</td>
      <td>${req.status || ''}</td>
      <td>${req.submittedAt ? new Date(req.submittedAt).toLocaleString() : ''}</td>
      <td>
        <div class="action-buttons">
          ${req.status === 'pending' ? `<button class="btn-approve" onclick="window.approveProfileRequest('${req._id}')">Approve</button><button class="btn-reject" onclick="window.rejectProfileRequest('${req._id}')">Reject</button>` : ''}
          <button class="btn-view" onclick="window.showProfileRequestModal('${req._id}')">View</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

// Render tour requests into the tour requests table
window.renderTourRequestsTable = function(tourRequests) {
  const tbody = document.querySelector('#tour-requests-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!Array.isArray(tourRequests) || tourRequests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">No tour requests found.</td></tr>';
    return;
  }
  tourRequests.forEach(req => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${req.name || ''}</td>
      <td>${req.email || ''}</td>
      <td>${req.phone || ''}</td>
      <td>${req.campus || ''}</td>
      <td>${req.preferredDate ? new Date(req.preferredDate).toLocaleDateString() : ''}</td>
      <td>${req.preferredTime || ''}</td>
      <td>${req.status || 'pending'}</td>
      <td>
        <div class="action-buttons">
          ${req.status === 'pending' ? `<button class="btn-approve" onclick="window.approveTourRequest('${req._id}')">Approve</button><button class="btn-reject" onclick="window.rejectTourRequest('${req._id}')">Reject</button>` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

// Global functions for profile request actions
window.approveProfileRequest = function(requestId) {
  const token = localStorage.getItem('token');
  fetch(`https://hostel-backend-b6e8.onrender.com/api/admin/profile-requests/${requestId}/approve`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast('Profile request approved successfully', 'success');
      loadProfileRequests();
      loadDashboardData();
    } else {
      showToast('Error approving profile request', 'error');
    }
  })
  .catch(error => {
    console.error('Error approving profile request:', error);
    showToast('Error approving profile request', 'error');
  });
};

window.rejectProfileRequest = function(requestId) {
  if (confirm('Are you sure you want to reject this profile request?')) {
    const token = localStorage.getItem('token');
    fetch(`https://hostel-backend-b6e8.onrender.com/api/admin/profile-requests/${requestId}/reject`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showToast('Profile request rejected successfully', 'success');
        loadProfileRequests();
        loadDashboardData();
      } else {
        showToast('Error rejecting profile request', 'error');
      }
    })
    .catch(error => {
      console.error('Error rejecting profile request:', error);
      showToast('Error rejecting profile request', 'error');
    });
  }
};

// Global functions for tour request actions
window.approveTourRequest = function(requestId) {
  const token = localStorage.getItem('token');
  fetch(`https://hostel-backend-b6e8.onrender.com/api/admin/tour-requests/${requestId}/approve`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast('Tour request approved successfully', 'success');
      loadTourRequests();
      loadDashboardData();
    } else {
      showToast('Error approving tour request', 'error');
    }
  })
  .catch(error => {
    console.error('Error approving tour request:', error);
    showToast('Error approving tour request', 'error');
  });
};

window.rejectTourRequest = function(requestId) {
  if (confirm('Are you sure you want to reject this tour request?')) {
    const token = localStorage.getItem('token');
    fetch(`https://hostel-backend-b6e8.onrender.com/api/admin/tour-requests/${requestId}/reject`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showToast('Tour request rejected successfully', 'success');
        loadTourRequests();
        loadDashboardData();
      } else {
        showToast('Error rejecting tour request', 'error');
      }
    })
    .catch(error => {
      console.error('Error rejecting tour request:', error);
      showToast('Error rejecting tour request', 'error');
    });
  }
};

// Global function for booking confirmation with room assignment
window.confirmBooking = function(bookingId) {
  try {
    console.log('🎯 confirmBooking called with ID:', bookingId);
    console.log('🔍 Current window.bookingsData:', window.bookingsData);
    
    // Get the bookingsData from the global scope or try to find it
    let bookingsData = window.bookingsData || [];
    console.log('📊 Using bookingsData:', bookingsData);
    
    // If not available globally, try to get it from the current page context
    if (!bookingsData || bookingsData.length === 0) {
      console.log('⚠️ bookingsData not found in global scope, trying to fetch booking details...');
      
      // Fetch the specific booking details
      const token = localStorage.getItem('token');
      const campus = localStorage.getItem('campus') || 'STU';
      
      console.log('🔍 Fetching booking details for campus:', campus);
      
      fetch(`https://hostel-backend-b6e8.onrender.com/api/admin/bookings/${campus}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
        console.log('📥 Booking fetch response status:', response.status);
        return response.json();
      })
      .then(bookings => {
        console.log('📥 All bookings received:', bookings);
        const booking = bookings.find(b => b._id === bookingId);
        console.log('🔍 Found booking:', booking);
        
        if (booking) {
          showRoomAssignmentModal(booking);
        } else {
          console.log('❌ Booking not found in fetched data');
          showToast('Booking not found', 'error');
        }
      })
      .catch(error => {
        console.error('❌ Error fetching booking details:', error);
        showToast('Error loading booking details', 'error');
      });
      return;
    }
    
    // Find the booking data
    const booking = bookingsData.find(b => b._id === bookingId);
    console.log('🔍 Looking for booking with ID:', bookingId);
    console.log('📊 Available booking IDs:', bookingsData.map(b => b._id));
    console.log('✅ Found booking:', booking);
    
    if (!booking) {
      console.log('❌ Booking not found in bookingsData:', bookingId);
      showToast('Booking not found', 'error');
      return;
    }
    
    showRoomAssignmentModal(booking);
  } catch (error) {
    console.error('💥 CRITICAL ERROR in confirmBooking:', error);
    console.error('Error stack:', error.stack);
    alert('Error in confirmBooking function: ' + error.message);
  }
};

// Helper function to show room assignment modal
function showRoomAssignmentModal(booking) {
  try {
    console.log('🎭 Showing room assignment modal for booking:', booking);
    
    // Check if modal elements exist
    const modal = document.getElementById('room-assignment-modal');
    const studentNameSpan = document.getElementById('modal-student-name');
    const hostelNameSpan = document.getElementById('modal-hostel-name');
    const roomTypeSpan = document.getElementById('modal-room-type');
    const amountSpan = document.getElementById('modal-amount');
    const form = document.getElementById('room-assignment-form');
    
    console.log('🔍 Modal elements found:', {
      modal: !!modal,
      studentNameSpan: !!studentNameSpan,
      hostelNameSpan: !!hostelNameSpan,
      roomTypeSpan: !!roomTypeSpan,
      amountSpan: !!amountSpan,
      form: !!form
    });
    
    if (!modal) {
      console.error('❌ Room assignment modal not found!');
      showToast('Modal not found', 'error');
      return;
    }
    
    // Populate the room assignment modal with booking details
    if (studentNameSpan) {
      studentNameSpan.textContent = booking.user?.fullName || 'N/A';
      console.log('✅ Set student name:', booking.user?.fullName || 'N/A');
    }
    
    if (hostelNameSpan) {
      hostelNameSpan.textContent = booking.hostel?.name || 'N/A';
      console.log('✅ Set hostel name:', booking.hostel?.name || 'N/A');
    }
    
    if (roomTypeSpan) {
      roomTypeSpan.textContent = booking.roomType || 'N/A';
      console.log('✅ Set room type:', booking.roomType || 'N/A');
    }
    
    if (amountSpan) {
      amountSpan.textContent = booking.amount ? 'GHS ' + booking.amount : 'N/A';
      console.log('✅ Set amount:', booking.amount ? 'GHS ' + booking.amount : 'N/A');
    }
    
    // Store the booking ID for the form submission
    if (form) {
      form.setAttribute('data-booking-id', booking._id);
      console.log('✅ Set booking ID on form:', booking._id);
    }
    
    // Show the room assignment modal
    modal.classList.add('show');
    modal.style.zIndex = '9999'; // Ensure it's on top
    console.log('✅ Modal displayed with show class');
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR in showRoomAssignmentModal:', error);
    console.error('Error stack:', error.stack);
    alert('Error showing room assignment modal: ' + error.message);
  }
}

// Global showToast function
window.showToast = function(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  const toastContainer = document.getElementById('toast-container');
  if (toastContainer) {
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 5000);
  } else {
    // Fallback if toast container doesn't exist
    alert(message);
  }
};

// Test function to verify button clicks are working
window.testApproveButton = function(bookingId) {
  console.log('🧪 Test approve button clicked for booking:', bookingId);
  alert('Test approve button clicked for booking: ' + bookingId);
};

// ===== SEARCH AND SORTING FUNCTIONALITY =====

// Global variables for search and sorting
let allBookingsData = [];
let filteredBookingsData = [];
let currentSortColumn = '';
let currentSortDirection = 'asc';

// Make booking data globally accessible
window.allBookingsData = allBookingsData;
window.filteredBookingsData = filteredBookingsData;

// Initialize search and sorting functionality
function initializeSearchAndSort() {
  console.log('🔍 Initializing search and sorting functionality...');
  
  // Add event listeners for search and filter inputs
  const bookingFilter = document.getElementById('booking-filter');
  const bookingStatusFilter = document.getElementById('booking-status-filter');
  const bookingDateFilter = document.getElementById('booking-date-filter');
  const bookingGenderFilter = document.getElementById('booking-gender-filter');
  
  if (bookingFilter) {
    bookingFilter.addEventListener('input', filterBookings);
    console.log('✅ Added booking search filter listener');
  }
  
  if (bookingStatusFilter) {
    bookingStatusFilter.addEventListener('change', filterBookings);
    console.log('✅ Added booking status filter listener');
  }
  
  if (bookingDateFilter) {
    bookingDateFilter.addEventListener('change', filterBookings);
    console.log('✅ Added booking date filter listener');
  }

  if (bookingGenderFilter) {
    bookingGenderFilter.addEventListener('change', filterBookings);
    console.log('✅ Added booking gender filter listener');
  }
  
  // Add event listeners for sortable table headers
  const sortableHeaders = document.querySelectorAll('#pending-bookings-table th[data-sort]');
  sortableHeaders.forEach(header => {
    header.addEventListener('click', () => handleSort(header.getAttribute('data-sort')));
    header.style.cursor = 'pointer';
    console.log('✅ Added sort listener for column:', header.getAttribute('data-sort'));
  });
  
  // Add clear filters button
  addClearFiltersButton();
}

// Add clear filters button to the filter container
function addClearFiltersButton() {
  const filterContainer = document.querySelector('.filter-container');
  if (!filterContainer) return;
  
  // Check if clear button already exists
  if (document.getElementById('clear-filters-btn')) return;
  
  const clearButton = document.createElement('button');
  clearButton.id = 'clear-filters-btn';
  clearButton.className = 'action-btn';
  clearButton.style.cssText = 'margin-top: 1.5rem; padding: 0.5rem 1rem; background: #6c757d; border: none; color: white; border-radius: 6px; cursor: pointer; font-size: 0.9rem;';
  clearButton.textContent = 'Clear All Filters';
  clearButton.addEventListener('click', clearAllFilters);
  
  filterContainer.appendChild(clearButton);
  console.log('✅ Added clear filters button');
}

// Clear all filters
function clearAllFilters() {
  console.log('🧹 Clearing all filters...');
  
  const bookingFilter = document.getElementById('booking-filter');
  const bookingStatusFilter = document.getElementById('booking-status-filter');
  const bookingDateFilter = document.getElementById('booking-date-filter');
  const bookingGenderFilter = document.getElementById('booking-gender-filter');
  
  if (bookingFilter) bookingFilter.value = '';
  if (bookingStatusFilter) bookingStatusFilter.value = '';
  if (bookingDateFilter) bookingDateFilter.value = '';
  if (bookingGenderFilter) bookingGenderFilter.value = '';
  
  // Reset sorting
  currentSortColumn = '';
  currentSortDirection = 'asc';
  
  // Clear sort icons
  const headers = document.querySelectorAll('#pending-bookings-table th[data-sort]');
  headers.forEach(header => {
    const icon = header.querySelector('.sort-icon');
    if (icon) {
      icon.textContent = '';
      icon.style.color = '';
    }
  });
  
  // Reset filtered data to original data
  filteredBookingsData = [...allBookingsData];
  // Update global references
  window.filteredBookingsData = filteredBookingsData;
  
  // Re-render table
  renderBookingsTable(filteredBookingsData);
  
  showToast('All filters cleared', 'info');
}

// Update results counter
function updateResultsCounter() {
  const totalCount = allBookingsData.length;
  const filteredCount = filteredBookingsData.length;
  
  // Find or create results counter
  let resultsCounter = document.getElementById('results-counter');
  if (!resultsCounter) {
    resultsCounter = document.createElement('div');
    resultsCounter.id = 'results-counter';
    resultsCounter.style.cssText = 'margin-bottom: 1rem; font-size: 0.9rem; color: #666; font-weight: 500;';
    
    const bookingsSection = document.getElementById('bookings-section');
    const table = document.getElementById('pending-bookings-table');
    if (bookingsSection && table) {
      bookingsSection.insertBefore(resultsCounter, table);
    }
  }
  
  if (filteredCount === totalCount) {
    resultsCounter.textContent = `Showing ${totalCount} booking${totalCount !== 1 ? 's' : ''}`;
  } else {
    resultsCounter.textContent = `Showing ${filteredCount} of ${totalCount} booking${totalCount !== 1 ? 's' : ''}`;
  }
}

// Filter bookings based on search criteria
function filterBookings() {
  console.log('🔍 Filtering bookings...');
  
  const searchTerm = document.getElementById('booking-filter')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('booking-status-filter')?.value || '';
  const dateFilter = document.getElementById('booking-date-filter')?.value || '';
  const genderFilter = document.getElementById('booking-gender-filter')?.value || '';
  
  console.log('🔍 Filter criteria:', { searchTerm, statusFilter, dateFilter, genderFilter });
  
  filteredBookingsData = allBookingsData.filter(booking => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      (booking.user?.fullName?.toLowerCase().includes(searchTerm)) ||
      (booking.hostel?.name?.toLowerCase().includes(searchTerm)) ||
      (booking.roomType?.toLowerCase().includes(searchTerm)) ||
      (booking.roomNumber?.toLowerCase().includes(searchTerm)) ||
      (booking.amount?.toString().includes(searchTerm));
    
    // Status filter
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    
    // Date filter
    let matchesDate = true;
    if (dateFilter) {
      const bookingDate = new Date(booking.createdAt).toISOString().split('T')[0];
      matchesDate = bookingDate === dateFilter;
    }
    // Gender filter
    const matchesGender = !genderFilter || (booking.user?.gender?.toLowerCase() === genderFilter);
    
    return matchesSearch && matchesStatus && matchesDate && matchesGender;
  });
  
  // Update global reference
  window.filteredBookingsData = filteredBookingsData;
  
  console.log('📊 Filtered bookings:', filteredBookingsData.length, 'out of', allBookingsData.length);
  
  // Apply current sorting and render
  applySortingAndRender();
  updateResultsCounter(); // Update results counter after filtering
}

// Handle column sorting
function handleSort(column) {
  console.log('🔄 Sorting by column:', column);
  
  if (currentSortColumn === column) {
    // Toggle direction if same column
    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // New column, default to ascending
    currentSortColumn = column;
    currentSortDirection = 'asc';
  }
  
  // Update sort icons
  updateSortIcons(column, currentSortDirection);
  
  // Apply sorting and render
  applySortingAndRender();
}

// Update sort icons in table headers
function updateSortIcons(activeColumn, direction) {
  const headers = document.querySelectorAll('#pending-bookings-table th[data-sort]');
  
  headers.forEach(header => {
    const column = header.getAttribute('data-sort');
    const icon = header.querySelector('.sort-icon');
    
    if (column === activeColumn) {
      icon.textContent = direction === 'asc' ? ' ▲' : ' ▼';
      icon.style.color = '#3498db';
    } else {
      icon.textContent = '';
      icon.style.color = '';
    }
  });
}

// Apply sorting to filtered data and render
function applySortingAndRender() {
  if (!currentSortColumn) {
    // No sorting applied, just render filtered data
    renderBookingsTable(filteredBookingsData);
    return;
  }
  
  const sortedData = [...filteredBookingsData].sort((a, b) => {
    let aValue, bValue;
    
    switch (currentSortColumn) {
      case 'tenant':
        aValue = a.user?.fullName || '';
        bValue = b.user?.fullName || '';
        break;
      case 'hostel':
        aValue = a.hostel?.name || '';
        bValue = b.hostel?.name || '';
        break;
      case 'roomType':
        aValue = a.roomType || '';
        bValue = b.roomType || '';
        break;
      case 'roomNumber':
        aValue = a.roomNumber || '';
        bValue = b.roomNumber || '';
        break;
      case 'amount':
        aValue = parseFloat(a.amount) || 0;
        bValue = parseFloat(b.amount) || 0;
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      default:
        aValue = '';
        bValue = '';
    }
    
    // Handle numeric sorting
    if (currentSortColumn === 'amount') {
      return currentSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Handle string sorting
    if (aValue < bValue) {
      return currentSortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return currentSortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  console.log('🔄 Sorted data:', sortedData.length, 'items');
  renderBookingsTable(sortedData);
}

// Override the existing renderBookingsTable function to store data
window.renderBookingsTable = function(bookings) {
  console.log('📊 Rendering bookings table with', bookings.length, 'bookings');
  
  // Store the original data for filtering and sorting
  if (bookings.length > 0 && !allBookingsData.length) {
    allBookingsData = [...bookings];
    filteredBookingsData = [...bookings];
    // Update global references
    window.allBookingsData = allBookingsData;
    window.filteredBookingsData = filteredBookingsData;
    console.log('💾 Stored original bookings data:', allBookingsData.length, 'items');
  }
  
  // Render desktop table
  renderDesktopTable(bookings);
  
  // Render mobile cards
  renderMobileCards(bookings);
  
  updateResultsCounter(); // Update results counter after rendering
  console.log('✅ Bookings table and mobile cards rendered successfully');
};

// Render desktop table
function renderDesktopTable(bookings) {
  const tbody = document.querySelector('#pending-bookings-table tbody');
  if (!tbody) {
    console.error('❌ Bookings table tbody not found');
    return;
  }
  
  tbody.innerHTML = '';
  
  if (!Array.isArray(bookings) || bookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
    return;
  }
  
  bookings.forEach(booking => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${booking.user?.fullName || 'N/A'}</td>
      <td>${booking.hostel?.name || 'N/A'}</td>
      <td>${booking.roomType || ''}</td>
      <td>${booking.user?.gender ? booking.user.gender.charAt(0).toUpperCase() + booking.user.gender.slice(1) : 'N/A'}</td>
      <td>${booking.roomNumber || '-'}</td>
      <td>${booking.amount ? 'GHS ' + booking.amount : ''}</td>
      <td><span class="badge ${booking.status}">${booking.status || ''}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-view" onclick="window.showBookingModal('${booking._id}')">View</button>
          ${booking.status === 'pending' ? `<button class="btn-approve" onclick="window.confirmBooking('${booking._id}')">Approve</button><button class="btn-reject" onclick="window.cancelBooking('${booking._id}')">Reject</button>` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Render mobile cards
function renderMobileCards(bookings) {
  const mobileContainer = document.getElementById('mobile-bookings-container');
  if (!mobileContainer) {
    console.error('❌ Mobile bookings container not found');
    return;
  }
  
  mobileContainer.innerHTML = '';
  
  if (!Array.isArray(bookings) || bookings.length === 0) {
    mobileContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">No bookings found.</div>';
    return;
  }
  
  bookings.forEach(booking => {
    const card = document.createElement('div');
    card.className = 'mobile-booking-card';
    
    const statusClass = booking.status || 'pending';
    const statusText = booking.status || 'pending';
    
    card.innerHTML = `
      <div class="mobile-booking-header">
        <h3 class="mobile-booking-title">${booking.user?.fullName || 'N/A'}</h3>
        <span class="mobile-booking-status ${statusClass}">${statusText}</span>
      </div>
      <div class="mobile-booking-details">
        <div class="mobile-booking-detail">
          <span class="mobile-booking-label">Hostel</span>
          <span class="mobile-booking-value">${booking.hostel?.name || 'N/A'}</span>
        </div>
        <div class="mobile-booking-detail">
          <span class="mobile-booking-label">Room Type</span>
          <span class="mobile-booking-value">${booking.roomType || 'N/A'}</span>
        </div>
        <div class="mobile-booking-detail">
          <span class="mobile-booking-label">Room Number</span>
          <span class="mobile-booking-value">${booking.roomNumber || 'Not Assigned'}</span>
        </div>
        <div class="mobile-booking-detail">
          <span class="mobile-booking-label">Amount</span>
          <span class="mobile-booking-value mobile-booking-amount">${booking.amount ? 'GHS ' + booking.amount : 'N/A'}</span>
        </div>
        <div class="mobile-booking-detail full-width">
          <span class="mobile-booking-label">Booking Date</span>
          <span class="mobile-booking-value">${new Date(booking.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="mobile-booking-actions">
        <button class="btn-view" onclick="window.showBookingModal('${booking._id}')">View</button>
        ${booking.status === 'pending' ? `
          <button class="btn-approve" onclick="window.confirmBooking('${booking._id}')">Approve</button>
          <button class="btn-reject" onclick="window.cancelBooking('${booking._id}')">Reject</button>
        ` : ''}
      </div>
    `;
    
    mobileContainer.appendChild(card);
  });
}

// Initialize search and sorting when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for the page to fully load, then initialize
  setTimeout(() => {
    initializeSearchAndSort();
  }, 500);
});

// Handle window resize to switch between mobile and desktop views
window.addEventListener('resize', function() {
  const isMobile = window.innerWidth <= 768;
  const table = document.getElementById('pending-bookings-table');
  const mobileContainer = document.getElementById('mobile-bookings-container');
  
  if (isMobile) {
    if (table) table.style.display = 'none';
    if (mobileContainer) mobileContainer.style.display = 'block';
  } else {
    if (table) table.style.display = 'table';
    if (mobileContainer) mobileContainer.style.display = 'none';
  }
});

// Export functions for global access
window.filterBookings = filterBookings;
window.handleSort = handleSort;
window.initializeSearchAndSort = initializeSearchAndSort;
window.clearAllFilters = clearAllFilters; 