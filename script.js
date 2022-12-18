const video = document.getElementById("video");
const vid = document.getElementsByClassName("vid")[0];
const password = document.getElementById("password");
password.style.display = "none"; // so that it won't show at first
let users;
let text = document.getElementById('text');

async function fetchWorkouts() {
  const response = await fetch("https://face-recognition-backend.adaptable.app/");
  const json = await response.json();
  if (response.ok) {
    users = await json.map((user) => {
      let container = {};
      container.username = user.username;
      container.password = user.password;

      return container;
    });
    console.log(users);
  }
}

Promise.all([
  // load all the models first before anything
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  fetchWorkouts(),
])
  .then(c("video"))
  .then(startVideo);

function c(c) {
  // const s = users.name;
  console.log(c);
}
function startVideo() {
  // start video cam for scanning
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then((stream) => {
      window.localStream = stream;
      video.srcObject = stream;
    })
    .catch((err) => {
      console.log(err);
    });
}

video.addEventListener("playing", async () => {
  // inig start sa video cam
  // Display the image in a canvas element
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  console.log(displaySize)
  faceapi.matchDimensions(canvas, displaySize);
  c("canvas ready");
  const labeledFaceDescriptors = await loadLabeledImages();
  c(labeledFaceDescriptors);
  c("image loaded");
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5);

  const myInterval = setInterval(async () => {
    c("detecting face");
    // Detect the face in the image
    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();
    c("preparing the box");
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // canvas.getContext('2d').clearRect(0, 0, canvas.width,canvas.height)
    // Compute the distances between the detected face descriptors and the labeled face descriptors
    const results = resizedDetections.map((d) =>
      faceMatcher.findBestMatch(d.descriptor)
    ); // collect the result

    let str = results.toString(); //

    results.forEach(async (result, i) => {
      const box = resizedDetections[i].detection.box;

      str = result.toString();
      var splitStr = str.split(" ");

      if (splitStr[0] !== "unknown") {
        //if not eq to unknown it proceed
        clearInterval(myInterval);
        console.log("interval clear"); // clear the time in interval resulting to stop scanning
        console.log(splitStr[0]); // check
        video.style.display = "none"; //close the video
        vid.style.display = "none"; //close the video
        localStream.getVideoTracks()[0].stop(); //
        const result = splitStr[0].toUpperCase();
        document.getElementById("username").innerText = result;
        password.style.display = "grid";
      }
    });
  }, 100);
  return false;
});

// load images from db
async function loadLabeledImages() {
  const labels = await users.map((user) => {
    return user.username;
  }); 

  console.log(labels);

  try {
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        // for (let i = 1; i <= 1; i++) {
        const img = await faceapi.fetchImage(
          `https://res.cloudinary.com/durortebu/image/upload/v1/photos/${label}/1.jpg`
        );
        console.log(
          `https://res.cloudinary.com/durortebu/image/upload/v1/photos/${label}/1.jpg`
        );
        // text += label+"\n";
        // document.getElementById('text').innerHTML= text;
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        c('prob')
        descriptions.push(detections.descriptor);

        c("check images");
        // }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  } catch (err) {
    console.log(err);
  }
}
