/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 700;
const explosions = [];

let canvasPosition = canvas.getBoundingClientRect();
console.log(canvasPosition);

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;

    // width of the rectangle canvas
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;

    this.x = x ;
    this.y = y ;

    // declare this.image = new Image()
    this.image = new Image();
    this.image.src = "https://www.frankslaboratory.co.uk/downloads/boom.png";

    // declare frame variable to animate the image
    this.frame = 0;

    // declare a variable this.timer which slow down the animation speed of the sprite
    this.timer = 0;

    //  declare a variable this.angle which rotate the sprite
    this.angle = Math.random() * 6.2;

    this.sound = new Audio()
    this.sound.src = 'Ice attack 2.wav'
  }

  update() {
    if(this.frame === 0) this.sound.play();
    this.timer++;
    if (this.timer % 10 == 0) {
      this.frame++;
    }
  }
  draw() {
    // to rotate the image on canvas we use save and restore method in canvas
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0-this.width/2,
      0-this.width/2,
      this.width,
      this.height
    );

    ctx.restore();
  }
}

// this function capture the mouse x and y position
window.addEventListener("click", function (e) {
  createAnimation(e);
});

// window.addEventListener("mousemove", function (e) {
//   createAnimation(e);
// });

function createAnimation(e) {
  let positionX = e.x - canvasPosition.left;
  let positionY = e.y - canvasPosition.top;

  // this line call the class constructor and draw the image of the boomBing and store it in the array
  explosions.push(new Explosion(positionX, positionY));

  //   ctx.fillStyle = 'white';
  //   ctx.fillRect(e.x - canvasPosition.left-25, e.y-canvasPosition.top-25, 50, 50);
}

console.log(explosions);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    explosions[i].draw();

    if (explosions[i].frame > 5) {
      explosions.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animate);
}

animate();
