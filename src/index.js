require('@tensorflow/tfjs');
const blazeface = require('@tensorflow-models/blazeface');
const pre = document.getElementById('pre');
const lay = document.getElementById('lay');
const btn = document.getElementById('btn');
const file = document.getElementById('file');
const image = new Image();

const drawPoint = (x, y, ctx, ss = 3) => {
    ctx.beginPath();
    ctx.arc(x, y, ss, 0, 2 * Math.PI, true);
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fill();
}

const strokeSize = (imgWidth) => {
    return imgWidth / 100;
}

const disableBtn = () => {
    btn.innerText = 'processing';
    btn.disabled = true;
}

const enableBtn = () => {
    btn.innerText = 'load image'
    btn.disabled = false
}

async function draw(img, ctx) {
    const model = await blazeface.load();
    const predictions = await model.estimateFaces(img, false);
    const ss = strokeSize(img.width)
    pre.innerText = JSON.stringify(predictions, null, ss);
    if (predictions.length) {
        for (let predict of predictions) {
            const start = predict.topLeft;
            const end = predict.bottomRight;
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(start[0], start[1], end[0] - start[0], end[1] - start[1])
            for (let [x, y] of predict.landmarks) {
                drawPoint(x, y, ctx, ss);
            }
        }
    }
}


image.addEventListener('load', function (i) {
    disableBtn();
    const ctx = lay.getContext('2d');
    lay.width = this.naturalWidth;
    lay.height = this.naturalHeight;
    ctx.drawImage(this, 0, 0)
    draw(image, ctx).then(e => {
        enableBtn();
    })
})

file.addEventListener('change', e => {
    disableBtn();
    const reader = new FileReader();
    reader.readAsDataURL(file.files[0]);
    reader.addEventListener('load', e => {
        image.src = reader.result;
        enableBtn();
    })
})

btn.addEventListener('click', function (e) {
    file.click();
})
image.src = "faces.jpg"