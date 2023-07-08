import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { BackGround } from "./background.js";
import { ClimbingEnemy, FlyingEnemy, GroundEnemy } from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.speed = 0;
      this.maxSpeed = 6;
      this.groundMargin = 80;
      this.background = new BackGround(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.enemies = [];
      this.particles = [];
      this.maxParticle = 50;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = true;
      this.score = 0;
      this.fontColor = "black";
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    update(deltaTime) {
      this.background.update();
      this.player.update(this.input.keys, deltaTime);

      // handle enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();

        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        if (enemy.markedForDeletion)
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
      });

      // Handle particles and call the particles array update function
      this.particles.forEach((particle, index) => {
        particle.update();
        if (particle.markedForDeletion) this.particles.splice(index, 1);
      });

      if(this.particles.length > this.maxParticle){
        this.particles = this.particles.slice(0 , this.maxParticle);
      }

      // console.log(this.particles)
    }

    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.particles.forEach(particle => {
        particle.draw(context); 
      })
      this.UI.draw(context);
    }

    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5)
        this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
      // console.log(this.enemies)
    }
  }

  // objects creation
  const game = new Game(canvas.width, canvas.height);
  console.log(game);

  let lastTime = 0;
  // animate function
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    // console.log(deltaTime)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(animate);
  }
  animate(0);
});
