// const messageList = document.querySelector('ul');
// const messageForm = document.querySelector('#message');
// const nickForm = document.querySelector('#nick');
const socket = io();

const welcome = document.getElementById('welcome');
const roomForm = welcome.querySelector('form');

function handleRoomSubmit(event) {
  event.preventDefault();
  const room = roomForm.querySelector('input');

  socket.emit('enter_room', { data: room.value }, (res) => {
    console.log(res);
  });
  // send에서는 message이벤트 뿐이라 타입과 데이터를 직접 object로 만들고 또 stringify해야 했다.
  // emit은 이벤트와 데이터를 인자로 받으며 문자열이 아니어도 알아서 처리해준다.
  // 심지어 front에서 실행될 ack function까지 콜백처럼 구성할 수 있다.
  room.value = '';
}

// function makeMessage(event, data) {
//   return JSON.stringify({ event, data });
// }

// socket.addEventListener('open', () => {
//   console.log('Connected to Server!');
// });

// socket.addEventListener('close', () => {
//   console.log('Disconnected from Server.');
// });

// socket.addEventListener('message', (message) => {
//   const parsed = JSON.parse(message);
//   const li = document.createElement('li');
//   li.innerText = parsed.data;
//   messageList.append(li);
// });

// function handleSubmit(event) {
//   event.preventDefault();
//   const messageInput = messageForm.querySelector('input');
//   socket.send(makeMessage('message', messageInput.value));

//   const li = document.createElement('li');
//   li.innerText = `You: ${messageInput.value}`;
//   li.style.textAlign = 'right';

//   messageList.append(li);

//   messageInput.value = '';
// }

// function handleNickSubmit(event) {
//   event.preventDefault();
//   const nickInput = nickForm.querySelector('input');
//   socket.send(makeMessage('nick', nickInput.value));

//   nickInput.value = '';
// }
// messageForm.addEventListener('submit', handleSubmit);
// nickForm.addEventListener('submit', handleNickSubmit);
roomForm.addEventListener('submit', handleRoomSubmit);
