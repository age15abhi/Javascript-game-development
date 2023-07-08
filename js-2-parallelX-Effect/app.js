const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);

// parallelX game speed
let gameSpeed = 10;

// create the new image in the heap section
const backgroundLayer1 = new Image();
backgroundLayer1.src = "layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "layer-5.png";

// create the variable x
// let x = 0;
// let x2 = 0;

const slider = document.getElementById('slider');
slider.value = gameSpeed;
const showGameSpeed = document.getElementById('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed;

slider.addEventListener('change' , function(e) {
  console.log(e.target.value)
  gameSpeed = e.target.value;
  // showGameSpeed.innerHTML = gameSpeed;
  showGameSpeed.innerHTML = e.target.value;
})


window.addEventListener('load' , function(){
// Manage the layer with the help of the class

class Layer {
  constructor(image, speedModifier) {
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = 700;
    // this.x2 = this.width;
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = gameSpeed * this.speedModifier;
  }

  // With the help of the update function we can manage the speed of the background
  update() {
    this.speed = gameSpeed * this.speedModifier;
    if (this.x <= -this.width) {
      this.x = 0;
    }
    // if (this.x2 <= -this.width) {
    //   this.x2 = this.width + this.x - this.speed;
    // }
    this.x = Math.floor(this.x - this.speed);
    // this.x2 = Math.floor(this.x2 - this.speed);
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
  }
}


// make the object of the classes
const layer1 = new Layer(backgroundLayer1 , 0.2);
const layer2 = new Layer(backgroundLayer2 , 0.4);
const layer3 = new Layer(backgroundLayer3 , 0.6);
const layer4 = new Layer(backgroundLayer4 , 0.8);
const layer5 = new Layer(backgroundLayer5 , 1);


// make a array of all the layer to apply the function of the class more efficiently

const gameObjects = [layer1 , layer2 , layer3 , layer4 , layer5]



// create the animate function to provide the animation  to the images

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
gameObjects.forEach(Object => {
    Object.update();
    Object.draw();
})
  requestAnimationFrame(animate);
}
animate();
})





// alternate method for the parallel x background
//   ctx.drawImage(backgroundLayer4, x, 0);
//   ctx.drawImage(backgroundLayer4, x2, 0);
//   if (x < -2400) x = 2400  + x2 - gameSpeed;
//   else x -= gameSpeed;
//   if (x2 < -2400) x2 = 2400 + x - gameSpeed;
//   else x2 -= gameSpeed;
