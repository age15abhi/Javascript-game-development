/** @type {HTMLCanvasElement} */
/** @type {HTMLCanvasElement} */
// simple canvas
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Collision canvas
const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

// score board
let score = 0;
ctx.font = "50px Impact";

// set time to the next raven
let timeToNextRaven = 0;
let ravelInterval = 500;
let lastTime = 0;

// create a variable called gameOver
let gameOver = false;

// raven class
let ravens = [];
class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;

    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);

    // directionX is for the horizontal speed
    this.directionX = Math.random() * 5 + 3;
    // directionX is for the vertical speed
    this.directionY = Math.random() * 5 - 2.5;

    this.markedForDeletion = false;

    // set the cross origin before the image.src
    this.image = new Image();
    this.image.src = "https://www.frankslaboratory.co.uk/downloads/raven.png";
    // this.image.crossOrigin = "anonymous";

    // frame is use for to change the frame static image to dynamic image
    this.frame = 0;
    this.maxFrame = 4;

    // it changes the flap wing speed of the bird
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;

    // Declare the variable for the random color
    this.randomColor = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];

    this.color =
      "rgb(" +
      this.randomColor[0] +
      "," +
      this.randomColor[1] +
      "," +
      this.randomColor[2] +
      ")";
  }

  // update function is used to code the animation of the ranvens
  update(deltaTime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1;
    }

    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeletion = true;

    this.timeSinceFlap += deltaTime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
    }

    // create a if condition if the this.x < this.width do gameOver = true
    if (this.x < 0 - this.width) gameOver = true;
  }

  // draw method is used to draw the ravens
  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

// explosion + sound effect class
let explosions = [];
class Explosions {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = "https://www.frankslaboratory.co.uk/downloads/boom.png";

    this.spriteWidth = 200;
    this.spriteHeight = 179;

    this.size = size;
    this.x = x;
    this.y = y;

    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = "Fire impact 1.wav";

    this.timeSinceLastFrame = 0;
    this.frameInterval = 200;

    this.markedForDeletion = false;
  }

  update(deltaTime) {
    if (this.frame === 0) this.sound.play();
    this.timeSinceLastFrame += deltaTime;
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) this.markedForDeletion = true;
    }
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y - this.size / 4,
      this.size,
      this.size
    );
  }
}

// draw score function is draw the score in the canvas
function drawScore() {
  ctx.fillStyle = "black";
  ctx.fillText("Score " + score, 50, 75);
  ctx.fillStyle = "white";
  ctx.fillText("Score " + score, 55, 80);
}

// create a function which display gameOver on the Screen
function drawGameOver () {
  ctx.textAlign = 'center'
  ctx.fillStyle = 'black';
  ctx.fillText('GAME OVER , YOUR SCORE IS ' + score , canvas.width/2 , canvas.height/2);

  ctx.textAlign = 'center'
  ctx.fillStyle = 'white';
  ctx.fillText('GAME OVER , YOUR SCORE IS ' + score , canvas.width/2 + 5 , canvas.height/2 + 5);
}

// color pixel detect
window.addEventListener("click", function (e) {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  // console.log(detectPixelColor);
  const pc = detectPixelColor.data;
  ravens.forEach((Object) => {
    if (
      Object.randomColor[0] === pc[0] &&
      Object.randomColor[1] === pc[1] &&
      Object.randomColor[2] === pc[2]
    ) {
      // here is color collision detection so we take a collision effect and sound so here is the coding of explosion take place
      Object.markedForDeletion = true;
      score++;
      explosions.push(new Explosions(Object.x, Object.y, Object.width));
      console.log(explosions);
    }
  });
});

// animate function for animate the canvas continuously
function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);

  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  timeToNextRaven += deltaTime;

  if (timeToNextRaven > ravelInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort(function (a, b) {
      return a.width - b.width;
    });
  }

  // calling the function drawScore
  drawScore();

  // after calling the drawScore we create the ravens
  [...ravens, ...explosions].forEach((Object) => Object.update(deltaTime));
  [...ravens, ...explosions].forEach((Object) => Object.draw());

  ravens = ravens.filter((Object) => !Object.markedForDeletion);
  explosions = explosions.filter((Object) => !Object.markedForDeletion);

  //   console.log(ravens);

  if(!gameOver)requestAnimationFrame(animate);
  else drawGameOver();
}

animate(0);
