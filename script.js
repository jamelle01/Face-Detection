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
  
  
  setTimeout(async () => {
    c('detecting face')
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
    c('preparing the box')
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    c('face detected')
    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.60)
    canvas.getContext('2d').clearRect(0, 0, canvas.width,canvas.height)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

    
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box

      let str = result.toString()
      var splitStr = str.split(" ");
      // let no = await string.length;
      // no = no-6
      console.log(splitStr)

      const drawBox = new faceapi.draw.DrawBox(box, { label: splitStr[0] })
      drawBox.draw(canvas)
    })

    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
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