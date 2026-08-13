// Same note as script.js — relative path works if frontend + backend
// are served from the same Express app.
const API_URL = '/api';

const token = localStorage.getItem('token');

if (!token) {
  // No token, no access — send back to login
  window.location.href = 'index.html';
}

async function loadProfile() {
  try {
    const res = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      // Token missing/expired/invalid
      localStorage.removeItem('token');
      window.location.href = 'index.html';
      return;
    }

    const data = await res.json();
    document.getElementById('profile').innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Role:</strong> ${data.role}</p>
    `;
  } catch (err) {
    document.getElementById('message').textContent = 'Could not reach the server';
  }
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

loadProfile();
