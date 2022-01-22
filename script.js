const input = document.getElementById('input-file'),
      upload = document.getElementById("uploadButton"),
      downloadBtn = document.getElementById("downloadButton"),
      download = document.getElementById("download"),
      downloadFrame = document.getElementById("downloadFrame"),
      uploadFrame = document.getElementById("uploadFrame"),
      canvas = document.getElementById('preview'),
      ph = document.getElementById('placeholder'),
      context = canvas.getContext('2d'),
      reader = new FileReader(),
      img = new Image();
      dLink = document.getElementById('downloadLink'),
      inputStorage = document.getElementById('inputStorage'),
      image = document.getElementById('filter'),
      downloadBtn.disabled = true;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('face-detection/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('face-detection/models')
]);

uploadFrame.addEventListener('click', function() {
      upload.click();
});

input.addEventListener('change', async function () {
  await drawImageFromInput().then(() => {
    context.drawImage(image, 0, 0, 1080, 1080);
    prepareDownloadLink();
    });
  });

async function centerFace() {
    const detection = await faceapi.detectSingleFace(inputStorage, new faceapi.TinyFaceDetectorOptions());
    return Object.values(detection.box)
  };

async function drawImageFromInput() {
  context.clearRect(0, 0, 1080, 1080);
  if (input.files.length === 0) {
    context.drawImage(ph, 0, 0, 1080, 1080);
    if (typeof callback === 'function') callback();
  } else {
    const img = new Image();

    img.addEventListener('load', async function () {

      try {
        inputStorage.src = URL.createObjectURL(input.files[0]);
        await centerFace().then((data) => {
          let x1 = data[0];
          let y1 = data[1];
          let faceWidth = data[2];
          let faceHeight = data[3];

          let size = faceHeight * 2;
          let i = 1
          y1 = y1 - ((size - faceHeight)/1.5);
          x1 = x1 - ((size - faceWidth) / 2);

          while (x1 < 0 || y1 < 0) {
            size = faceHeight * (2-(0.1*i));
            i++;
            if (i>20) {
              size = Math.min(img.height, img.width);
              let topBound = (size - faceHeight) / 2;
              let leftBound = (size - faceWidth) / 2;
              if (img.height < img.width) {
                y1 = 0;
                x1 = x1 - leftBound;
                x1 = Math.max(x1, 0);
              } else if (img.height > img.width) {
                x1 = 0;
                y1 = y1 - topBound;
                y1 = Math.max(y1, 0);
              } else {
                x1 = 0;
                y1 = 0;
              }
              context.drawImage(img, x1, y1, size, size, 0, 0, 1080, 1080);
              break
            }
          }
          context.drawImage(img, x1, y1, size, size, 0, 0, 1080, 1080);
        });
      } catch {
        size = Math.min(img.height, img.width);
        x1 = 0;
        y1 = 0;
        if (img.height < img.width) {
          //breit
          x1 = img.width / 2 - size / 2;
        } else if (img.height > img.width) {
          //hoch
          y1 = img.height / 2 - size / 2;
        }
        context.drawImage(img, x1, y1, size, size, 0, 0, 1080, 1080);
      }

        context.drawImage(image, 0, 0, 1080, 1080);

      if (typeof callback === 'function') callback();
    });
    img.src = URL.createObjectURL(input.files[0]);
  }
}

function prepareDownloadLink() {
  downloadBtn.disabled = false;
  download.href = canvas.toDataURL();
}

placeholder.onload = drawImageFromInput;
