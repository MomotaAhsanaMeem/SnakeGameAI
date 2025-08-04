let canvas;
let video;
let posenet;
let score = document.getElementById("score")
let highScore = document.getElementById("highScore")
let s = 0;
let h = 0;
let x;
let y;
let dirX = 0;
let dirY = 0;
let sX = 310;
let sY = 260;
let fX = 320;
let fY = 220;
let size = 20;


function setup() {
    canvas = createCanvas(640, 480);
    canvas.center();
    background('lightblue')
    video = createCapture(VIDEO)
    video.hide()
    posenet = ml5.poseNet(video,modelReady);
    posenet.on('pose',gotPoses);
}

function modelReady() {
    console.log("Model is ready")
}

function gotPoses(poses) {
    // console.log(poses)

    if (poses.length > 0) {
        x = poses[0].pose.keypoints[0].position.x;
        y = poses[0].pose.keypoints[0].position.y;

        if (y < 200) {        // up
            dirX = 0;
            dirY = -2;
        } else if (y > 280) {       // down
            dirX = 0;
            dirY = 2;
        } else if (x < 290) {       // left
            dirX = 2;
            dirY = 0
        } else if (x > 350) {       // right
            dirX = -2;
            dirY = 0;
        }
    }
}

function draw() {
    background("lightblue")
    moveSnake();
    drawSnake();
    drawFood();

    // check collision
    if (checkCollision()) {
        resetGame();
    }
}

function moveSnake() {
    sX += dirX;
    sY += dirY;
    
    var distance = dist(sX,sY,fX,fY)
    if (distance < 23) {
        manageScore()
        changeFoodPosition();
    }
}

function manageScore() {
    s += 10
    score.innerText = s;

    if (s > h) {
        h = s;
        highScore.innerText = h;
    }
}

function changeFoodPosition() {
    fX = Math.floor(Math.random() * (640 - size));
    fY = Math.floor(Math.random() * (480 - size));
}

function drawSnake() {
    stroke("green")
    fill("green")
    rect(sX,sY,size)
}

function drawFood() {
    stroke("red")
    fill("red")
    ellipse(fX,fY,size)
}

function checkCollision() {
    return (sX < 0 || sX > 640 - size || sY < 0 || sY > 480 - size);
}

function resetGame() {
    background("lightblue")
    fill("black");
    textSize(20);
    textAlign(CENTER,CENTER)
    text("Game Over!",320,240)
    noLoop();
    setTimeout(() => {
        loop();
        sX = 310;
        sY = 260;
        dirX = 0;
        dirY = 0;
        s = 0;
        score.innerText = s;
        console.log("reset") 
        changeFoodPosition();
    }, 2000)     // 2 seconds delay
}