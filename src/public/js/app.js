const messageList = document.querySelector('ul');
const messageForm = document.querySelector('form');
const socket = new WebSocket(`ws://${window.location.hostname}:8080`);

socket.addEventListener('open', () => {
  console.log('Connected to Server!');
});

socket.addEventListener('close', () => {
  console.log('Disconnected from Server.');
});

socket.addEventListener('message', (message) => {
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList.append(li);
});

function handleSubmit(event) {
  event.preventDefault();
  const message = messageForm.querySelector('input').value;
  socket.send(
    JSON.stringify({
      event: 'message',
      data: message,
    }),
  );
}
messageForm.addEventListener('submit', handleSubmit);
