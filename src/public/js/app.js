const messageList = document.querySelector('ul');
const messageForm = document.querySelector('#message');
const nickForm = document.querySelector('#nick');
const socket = new WebSocket(`ws://${window.location.hostname}:8080`);

function makeMessage(event, data) {
  return JSON.stringify({ event, data });
}

socket.addEventListener('open', () => {
  console.log('Connected to Server!');
});

socket.addEventListener('close', () => {
  console.log('Disconnected from Server.');
});

socket.addEventListener('message', (message) => {
  const parsed = JSON.parse(message.data);
  const li = document.createElement('li');
  li.innerText = parsed.data;
  messageList.append(li);
});

function handleSubmit(event) {
  event.preventDefault();
  const messageInput = messageForm.querySelector('input');
  socket.send(makeMessage('message', messageInput.value));

  const li = document.createElement('li');
  li.innerText = `You: ${messageInput.value}`;
  li.style.textAlign = 'right';

  messageList.append(li);

  messageInput.value = '';
}

function handleNickSubmit(event) {
  event.preventDefault();
  const nickInput = nickForm.querySelector('input');
  socket.send(makeMessage('nick', nickInput.value));

  nickInput.value = '';
}
messageForm.addEventListener('submit', handleSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
