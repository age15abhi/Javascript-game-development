/**   @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;

const numberOfEnemies = 50;
const enemiesArray = [];

// gameFrame variable is used for slow down the enemies
let gameFrame = 0;

// enemy1 =  {
//     x : 0,
//     y : 0,
//     width : 50 ,
//     height : 50
// }

class Enemy {
  constructor() {
    // declare the variable this.image in the constructor
    this.image = new Image();
    this.image.src = "enemy4.png";

    // this is for to set the speed of the enemy
    this.speed = Math.random() * 4 + 1;

    // set the width and height of the sprite image
    this.spriteWidth = 213;
    this.spriteHeight = 213;
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;

    // these are the enemies property
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);

    // declare two variable newX and newY variable
    this.newX = Math.random() * (canvas.width - this.width);
    this.newY = Math.random() * (canvas.height - this.height);

    // for animate the character declare a variable frame
    this.frame = 0;

    // declare a variable called flapSpeed which change the wings of the enemies
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);

    // declare a angle variable which is used to fly the bird up and down
    // this.angle = 0;

    // declare a angleSpeed variable which is used to set the speed of the angle
    // this.angleSpeed = Math.random() * 1.5 + 0.5;

    //  declare a curve variable which is used to set the jumping speed of the enemies
    // this.curve = Math.random() * 200 ;

    // declare a variable interval which slow down the interval
    this.interval = Math.floor(Math.random() * 200 + 50) ;
  }

  // update method is for the moment of the enemy
  update() {
    if (gameFrame % this.interval === 0) {
      this.newX = Math.random() * (canvas.width - this.width);
      this.newY = Math.random() * (canvas.height - this.height);
    }

    let dx = this.x - this.newX;
    let dy = this.y - this.newY;

    this.x -= dx/70;
    this.y -= dy/70;

    // this.y += this.curve * Math.sin(this.angle);

    if (this.x + this.width < 0) this.x = canvas.width;

    // for animate the character we declare a variable called frame in the constructor

    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
  }

  // draw function is for the create the enemy
  draw() {
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
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

for (let i = 0; i < numberOfEnemies; i++) {
  enemiesArray.push(new Enemy());
}

// animate function
function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  enemiesArray.forEach((enemy) => {
    enemy.update();
    enemy.draw();
  });

  // gameFrame variable is increased every time
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
