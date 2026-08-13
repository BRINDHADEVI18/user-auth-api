// If your frontend is served from the SAME Express app as your API,
// leave this as a relative path. If it's hosted separately, replace with
// your full backend URL, e.g. 'https://your-backend-url.onrender.com/api/auth'
const API_URL = '/api/auth';

const messageEl = document.getElementById('message');

function showMessage(text) {
  messageEl.textContent = text;
}

function getErrorMessage(data) {
  if (data.message) return data.message;
  if (data.errors && data.errors.length > 0) return data.errors[0].msg;
  return 'Something went wrong';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      showMessage(getErrorMessage(data));
    }
  } catch (err) {
    showMessage('Could not reach the server');
  }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (res.ok) {
      showMessage('Registered successfully! You can log in now.');
      document.getElementById('registerForm').reset();
    } else {
      showMessage(getErrorMessage(data));
    }
  } catch (err) {
    showMessage('Could not reach the server');
  }
});
