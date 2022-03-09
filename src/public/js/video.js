const socket = io('ws://localhost:8081/video', {
  transports: ['websocket'],
  jsonp: false,
});
const myVideo = document.getElementById('myVideo');
const soundButton = document.getElementById('sound');
const videoButton = document.getElementById('video');
const camerasSelect = document.getElementById('cameras');

const welcome = document.getElementById('welcome');
const call = document.getElementById('call');

call.hidden = true;

let myStream;
let isMute = false;
let isVideoOff = false;
let roomName;
let myPeerConnection; // RTC

async function getMedia(deviceId) {
  const initialConstraints = {
    audio: true,
    video: { facingMode: 'user' },
  };
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstraints,
    );
    myVideo.srcObject = myStream;

    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
}

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const currentCamera = myStream.getAudioTracks()[0];

    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      camerasSelect.appendChild(option);

      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
    });
  } catch (e) {
    console.log(e);
  }
}

function soundHandler() {
  myStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });
  if (!isMute) {
    soundButton.innerText = 'Unmute';
    isMute = true;
  } else {
    soundButton.innerText = 'Mute';
    isMute = false;
  }
}
function videoHandler() {
  myStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });
  if (!isVideoOff) {
    videoButton.innerText = 'Video On';
    isVideoOff = true;
  } else {
    videoButton.innerText = 'Video Off';
    isVideoOff = false;
  }
}

async function cameraHandler() {
  await getMedia(camerasSelect.value);
}

soundButton.addEventListener('click', soundHandler);
videoButton.addEventListener('click', videoHandler);
camerasSelect.addEventListener('input', cameraHandler);

// socket.io
socket.on('welcome', async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  socket.emit('offer', { offer, roomName });
});

socket.on('offer', async (offer) => {
  myPeerConnection.setRemoteDescription(offer);

  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit('answer', { answer, roomName });
});

socket.on('answer', (answer) => {
  myPeerConnection.setRemoteDescription(answer);
});

socket.on('ice', (ice) => {
  myPeerConnection.addIceCandidate(ice);
});

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

const roomNameForm = document.getElementById('roomName');

async function handleRoomNameSubmit(event) {
  event.preventDefault();
  const input = roomNameForm.querySelector('input');
  roomName = input.value;
  await initCall();
  socket.emit('join_room', { roomName });
  input.value = '';
}
roomNameForm.addEventListener('submit', handleRoomNameSubmit);

// RTC Code

function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  myPeerConnection.addEventListener('icecandidate', handleIce);
  // myPeerConnection.addEventListener('addstream', handleAddStream); // addstream is deprecated.
  myPeerConnection.addEventListener('track', handleAddStream); // addstream is deprecated.
  myStream.getTracks().forEach((track) => {
    myPeerConnection.addTrack(track, myStream);
  });
}

function handleIce(data) {
  socket.emit('ice', { ice: data.candidate, roomName: roomName });
}

function handleAddStream(data) {
  const peerVideo = document.getElementById('peerVideo');
  peerVideo.srcObject = data.streams[0];
}
