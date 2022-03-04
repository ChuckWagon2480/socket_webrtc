const messageForm = document.querySelector('#message');
const nickForm = document.querySelector('#nick');
const socket = io('http://localhost:8080/chat', {
  transports: ['websocket'],
  jsonp: false,
});

const welcome = document.getElementById('welcome');
const roomNameForm = welcome.querySelector('form');

const room = document.getElementById('room');
var roomName;

function addMessage(message, option) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  if (option) option(li);

  ul.append(li);
}

socket.on('welcome', (payload) => {
  const { nick } = payload;
  addMessage(`[${nick} joined!]`, (li) => {
    li.style.textAlign = 'center';
  });
});
socket.on('bye', (payload) => {
  const { nick } = payload;
  addMessage(`[${nick} left!]`, (li) => {
    li.style.textAlign = 'center';
  });
});
socket.on('message', (payload) => {
  const { nick, message } = payload;
  addMessage(`${nick}: ${message}`, (li) => {
    li.style.textAlign = 'left';
  });
});

function handleRoomSubmit(event) {
  event.preventDefault();
  roomName = roomNameForm.querySelector('input');

  socket.emit('enter_room', { data: roomName.value }, (res) => {
    console.log(res);

    welcome.hidden = true;
    room.hidden = false;
    const roomTitle = room.querySelector('#roomName');
    roomTitle.innerText = roomName.value;
  });
  // send에서는 message이벤트 뿐이라 타입과 데이터를 직접 object로 만들고 또 stringify해야 했다.
  // emit은 이벤트와 데이터를 인자로 받으며 문자열이 아니어도 알아서 처리해준다.
  // 심지어 front에서 실행될 ack function까지 콜백처럼 구성할 수 있다.
  room.value = '';
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const messageInput = messageForm.querySelector('input');
  socket.emit('message', {
    message: messageInput.value,
    roomName: roomName.value,
  });

  addMessage(`You: ${messageInput.value}`, (li) => {
    li.style.textAlign = 'right';
  });
  messageInput.value = '';
}

function handleNickSubmit(event) {
  event.preventDefault();
  const nickInput = nickForm.querySelector('input');
  socket.emit('nick', { nick: nickInput.value });

  nickInput.value = '';
}

messageForm.addEventListener('submit', handleMessageSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
roomNameForm.addEventListener('submit', handleRoomSubmit);
