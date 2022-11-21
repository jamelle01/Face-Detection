const video = document.getElementById('video');
const vid = document.getElementsByClassName('vid')[0];
const password = document.getElementById('password');
password.style.display = "none"; // so that it won't show at first

Promise.all([ // load all the models first before anything
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(c('video')).then(startVideo)

function c(c){ 
  console.log(c);
}
function startVideo(){
  // navigator.getUserMedia(
  //   { video: {} },
  //   stream => video.srcObject = stream,
  //   err => console.error(err)
  // )
  navigator.mediaDevices.getUserMedia({
    video: true
  })
  .then(stream => {
    window.localStream = stream;
    video.srcObject = stream;
  })
  .catch((err) => {
    console.log(err);
  });
}

video.addEventListener('playing',async () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  c('canvas ready');
  const labeledFaceDescriptors = await loadLabeledImages();
  c('image loaded');
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.60);

  const myInterval = setInterval(async () => {
    c('detecting face');
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
    c('preparing the box')
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    // canvas.getContext('2d').clearRect(0, 0, canvas.width,canvas.height)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor)); // collect the result
    
    let str = results.toString(); //
    
    results.forEach(async (result, i) => {
      const box = resizedDetections[i].detection.box;

      str = result.toString();
      var splitStr = str.split(" ");
      
      if (splitStr[0] !== "unknown"){ //if not eq to unknown it proceed
        clearInterval(myInterval);
        console.log("interval clear"); // clear the time in interval resulting to stop scanning
        console.log(splitStr[0]); // check
        video.style.display = "none"; //hid the video  
        vid.style.display = "none"; //hid the video  
        localStream.getVideoTracks()[0].stop(); //
        const result = splitStr[0].toUpperCase();
        document.getElementById("username").innerText = (result);
        password.style.display = "grid";
      }
    })

  }, 100);
  return false;
})

function loadLabeledImages() {
  const labels = ['jeramelle', 'jerico', 'eric'] // NEED TO BE SOMEWHERE AND FETCH
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 1; i++) {
        const img = await faceapi.fetchImage(`./labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
        c("check images")
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}