const myVideo = document.getElementById('myVideo');
const soundButton = document.getElementById('sound');
const videoButton = document.getElementById('video');
const camerasSelect = document.getElementById('cameras');

let myStream;
let isMute = false;
let isVideoOff = false;

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

getMedia();
soundButton.addEventListener('click', soundHandler);
videoButton.addEventListener('click', videoHandler);
camerasSelect.addEventListener('input', cameraHandler);
