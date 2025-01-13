// Message template
const messageTemplate = (message, isOwn) => `
  <div class="flex ${isOwn ? 'justify-end' : 'justify-start'}">
    <div class="${isOwn 
      ? 'bg-blue-600 text-gray-200 rounded-l-lg rounded-tr-lg' 
      : 'bg-[#2A2A2A] text-gray-200 rounded-r-lg rounded-tl-lg'
    } p-3 max-w-[80%]">
      <p class="break-words">${message}</p>
    </div>
  </div>
`;

// Store messages
let messages = [];

// DOM elements
const messagesContainer = document.getElementById('messages');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

// Add a new message
function addMessage(text, isOwn = true) {
  messages.push({ text, isOwn });
  messagesContainer.insertAdjacentHTML('beforeend', messageTemplate(text, isOwn));
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle form submission
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  
  if (text) {
    addMessage(text, true);
    messageInput.value = '';
    
    // Simulate received message after a short delay
    setTimeout(() => {
      addMessage('This is a response message', false);
    }, 1000);
  }
});