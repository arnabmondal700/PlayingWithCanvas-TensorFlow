const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.59,    // confidence threshold for predictions.
}
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
const video = document.querySelector('#video');

let model;
let temp;
let tempHeight;
handTrack.startVideo(video).then(status => {
    if (status) {
        navigator.getUserMedia({ video: { width: window.innerWidth, height: window.innerHeight } },
            function (stream) {
                video.srcObject = stream;
                setInterval(runDetcion, 100);
            },
            function (err) {
                console.log("The following error occurred: " + err.name);
            }
        );

    }
});

function runDetcion() {
    model.detect(video).then(prediction => {


        if (prediction.length > 0) {
            // console.log(prediction[0]);
            mouse.x = prediction[0].bbox[0] * (window.innerWidth / 400);
            mouse.y = prediction[0].bbox[1] * (window.innerWidth / 400);
            console.log(mouse);
        }

    })
}
handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
})
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var circleColur = ["Blue", "Green", "Red", "Pink", "yellow", "violet", "grey", "orange", "brown"];
var shadowDarkIndex = 0;
var mouse = {
    x: undefined,
    y: undefined
};
window.addEventListener("mousemove", function (e) {
    // console.log(e)
    // mouse.x = e.pageX;
    // mouse.y = e.pageY;
});
function Circle(x, y, radious, dx, dy, colour) {
    this.x = x + radious * 2;
    this.y = y + radious * 2;
    this.radious = radious;
    this.dx = dx;
    this.dy = dy;
    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radious, 0, Math.PI * 2, false);
        ctx.strokeStyle = colour;
        ctx.fillStyle = colour;
        ctx.fill();
        ctx.stroke();
    }
    this.update = function () {
        if (this.x + this.radious * 2 > window.innerWidth || this.x - this.radious < 0)
            this.dx = -this.dx;
        if (this.y + this.radious * 2 > window.innerHeight || this.y - this.radious < 0)
            this.dy = -this.dy;
        this.x += this.dx;
        this.y += this.dy;

        if (mouse.x - this.x < 50 && mouse.x - this.x > -50
            && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
            if (this.radious < 50) {
                this.radious += 1;
            }
        } else if (this.radious > 5) {
            this.radious -= 1;
        }
        this.draw();
    }
}
var circleArray = [];
for (var i = 0; i < 500; i++) {
    radious = 30;
    x = Math.random() * (window.innerWidth - radious * 2) + radious;
    y = Math.random() * (window.innerWidth - radious * 2) + radious;
    dx = (Math.random() - 0.5) * 5;
    dy = (Math.random() - 0.5) * 5;
    colour = circleColur[Math.round(Math.random() * circleColur.length)];
    circleArray.push(new Circle(x, y, radious, dx, dy, colour));
}
function animate() {
    requestAnimationFrame(animate);
    ctx.beginPath();
    ctx.shadowBlur = shadowDarkIndex;
    ctx.shadowOffsetX = shadowDarkIndex;
    ctx.shadowColor = "black";
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}
animate();