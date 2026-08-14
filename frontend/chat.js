const CHAT_API_URL = 'https://chatroom-api-nebl.onrender.com';

const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

async function loadHistory() {
  const res = await fetch(`${CHAT_API_URL}/api/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const messages = await res.json();
  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML = messages
    .map(m => `<p><strong>${m.name}:</strong> ${m.text}</p>`)
    .join('');
  chatBox.scrollTop = chatBox.scrollHeight;
}

const socket = io(CHAT_API_URL, { auth: { token } });

socket.on('connect', () => console.log('Connected to chat server'));
socket.on('connect_error', (err) => console.error('Connection failed:', err.message));

socket.on('receiveMessage', (msg) => {
  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML += `<p><strong>${msg.name || 'You'}:</strong> ${msg.text}</p>`;
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

loadHistory();