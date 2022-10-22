const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  // faceapi.nets.faceExpressionNet.loadFromUri('/modeels'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(c('video')).then(startVideo)

function c(c){
  console.log(c);
}
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}


video.addEventListener('play',async () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  c('canvas ready')  
  const labeledFaceDescriptors = await loadLabeledImages()
  c('image loaded')
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.60)

  const myInterval = setInterval(async () => {
    c('detecting face')
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
    c('preparing the box')
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    
    canvas.getContext('2d').clearRect(0, 0, canvas.width,canvas.height)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    
    let str = results.toString()
    
    results.forEach(async (result, i) => {
      const box = resizedDetections[i].detection.box

      str = result.toString()
      var splitStr = str.split(" ");
      
      
      if (splitStr[0] !== "unknown"){
        clearInterval(myInterval)
        console.log("interval clear") // clear the time in interval resulting to stop scanning
        const username = splitStr[0];
        document.location.href = `https://www.google.com/${username}`;
      }

      const drawBox = new faceapi.draw.DrawBox(box, { label: splitStr[0] })
      drawBox.draw(canvas)
    })

  }, 100)
  return false;
})

function loadLabeledImages() {
  const labels = ['Jeramelle', 'Maui', 'Paul', 'Justin']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
        c("check images")
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}