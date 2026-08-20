// Same note as script.js — relative path works if frontend + backend
// are served from the same Express app.
const API_URL = '/api';


const CHAT_API_URL = 'https://chatroom-api-nebl.onrender.com'; //  chat-api Render URL
const token = localStorage.getItem('token');

if (!token) window.location.href = 'index.html';

// ---- Tab switching ----
document.querySelectorAll('.tabBtn[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tabContent').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tabBtn').forEach(b => b.classList.remove('active'));
    document.getElementById(btn.dataset.tab).style.display = 'block';
    btn.classList.add('active');
  });
});

function getUserIdFromToken(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.id; // or payload.userId — depends on what you signed into the JWT
}

// ---- Profile ----
async function loadProfile() {

  

  try {
    
const userId = getUserIdFromToken(token);

    const res = await fetch(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
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
    document.getElementById('updateName').value = data.name;
    document.getElementById('updateEmail').value = data.email;

    if (data.role.trim() === 'admin') {
      document.getElementById('usersTabBtn').style.display = 'inline-block';
      loadAllUsers();
    }
  } catch (err) {
    document.getElementById('message').textContent = 'Could not reach the server';
  }
}

// ---- Update profile ----
document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('updateName').value;
  const email = document.getElementById('updateEmail').value;

  const res = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, email })
  });
  const data = await res.json();
  if (res.ok) {
    document.getElementById('message').textContent = 'Profile updated';
    loadProfile();
  } else {
    document.getElementById('message').textContent = data.message || 'Update failed';
  }
});

// ---- Logout ----
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

// ---- All users (admin) ----
async function loadAllUsers() {
  const res = await fetch(`${API_URL}/users/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const users = await res.json();
  document.getElementById('userList').innerHTML = users
    .map(u => `
      <p>${u.name} — ${u.email} (${u.role})
        <button class="deleteBtn" data-id="${u.id}">Delete</button>
      </p>
    `)
    .join('');

  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', () => deleteUser(btn.dataset.id));
  });
}

async function deleteUser(id) {
  if (!confirm('Delete this user?')) return;
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) loadAllUsers();
  else {
    const data = await res.json();
    alert(data.message || 'Failed to delete user');
  }
}

// ---- Chat ----
async function loadHistory() {
  const res = await fetch(`${CHAT_API_URL}/api/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const messages = await res.json();
  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML = messages.map(m => `<p><strong>${m.name}:</strong> ${m.text}</p>`).join('');
  chatBox.scrollTop = chatBox.scrollHeight;
}

try{

const socket = io(CHAT_API_URL, { auth: { token } });
socket.on('connect_error', (err) => console.error('Chat connect error:', err.message));
socket.on('receiveMessage', (msg) => {
  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML += `<p><strong>${msg.name || 'User'}:</strong> ${msg.text}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
});

document.getElementById('chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (text) {
    socket.emit('sendMessage', text);
    input.value = '';
  }
});
}
catch (err){
    console.error('Socket.IO failed to initialize:', err.message);
}

// ---- Init ----
loadProfile();
loadHistory();