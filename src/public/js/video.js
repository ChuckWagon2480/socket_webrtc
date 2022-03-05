const myVideo = document.getElementById('myVideo');
const soundButton = document.getElementById('sound');
const cameraButton = document.getElementById('camera');

let myStream;
let isMute = false;
let isCameraOff = false;

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    myVideo.srcObject = myStream;
  } catch (error) {
    console.log(error);
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
function cameraHandler() {
  myStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });
  if (!isCameraOff) {
    cameraButton.innerText = 'Camera On';
    isCameraOff = true;
  } else {
    cameraButton.innerText = 'Camera Off';
    isCameraOff = false;
  }
}

getMedia();
soundButton.addEventListener('click', soundHandler);
cameraButton.addEventListener('click', cameraHandler);
