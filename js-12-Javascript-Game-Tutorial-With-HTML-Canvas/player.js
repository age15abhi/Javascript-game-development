import { Sitting, Running, Jumping, Falling , Rolling } from "./playerStates.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = player;

    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame;

    // fps
    this.fps = 30;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;

    this.speed = 0;
    this.maxSpeed = 10;

    this.vy = 0;
    this.weight = 1;

    // state management in for the dog
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
    ];

  }
  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);
    // Horizontal Movement
    this.x += this.speed;
    if (input.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (input.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    // Vertical Movement
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;
    //Sprite Animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);

    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    // in this the states[0] is sitting state
    // and states array create the object according to the number
    // and this.current state is a object which call the all the function of the class created by states array;
    this.currentState.enter();
  }

  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        // Collision Detection
        enemy.markedForDeletion = true;
        this.game.score++;
      } else {
        // No Collision
      }
    });
  }
}
