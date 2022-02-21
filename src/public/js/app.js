const messageList = document.querySelector('ul');
const messageForm = document.querySelector('#message');
const nickForm = document.querySelector('#nick');
const socket = new WebSocket(`ws://${window.location.hostname}:8080`);

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
  socket.send(
    JSON.stringify({
      event: 'message',
      data: messageInput.value,
    }),
  );
  messageInput.value = '';
}

function handleNickSubmit(event) {
  event.preventDefault();
  const nickInput = nickForm.querySelector('input');
  socket.send(
    JSON.stringify({
      event: 'nick',
      data: nickInput.value,
    }),
  );
  nickInput.value = '';
}
messageForm.addEventListener('submit', handleSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
