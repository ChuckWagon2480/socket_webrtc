const myVideo = document.getElementById('myVideo');

let myStream;

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

getMedia();
