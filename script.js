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
      downloadBtn.disabled = true;

uploadFrame.addEventListener('click', function() {
      upload.click();
});

input.addEventListener('change', function () {
  drawImageFromInput();
  drawImageFromInput(function () {
      const image = document.getElementById('filter');
      context.drawImage(image, 0, 0, 1080, 1080);
      prepareDownloadLink();
    });
  });

function drawImageFromInput(callback) {
  context.clearRect(0, 0, 1080, 1080);

  if (input.files.length === 0) {
    context.drawImage(ph, 0, 0, 1080, 1080);
    if (typeof callback === 'function') callback();
  } else {
    const img = new Image();
    img.addEventListener('load', function () {
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
