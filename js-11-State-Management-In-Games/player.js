import {
  StandingLeft,
  StandingRight,
  SittingLeft,
  SittingRight,
  RunningLeft,
  RunningRight,
  JumpingLeft,
  JumpingRight,
  FallingLeft,
  FallingRight,
} from "./state.js";

export default class Player {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.states = [
      new StandingLeft(this),
      new StandingRight(this),
      new SittingLeft(this),
      new SittingRight(this),
      new RunningLeft(this),
      new RunningRight(this),
      new JumpingLeft(this),
      new JumpingRight(this),
      new FallingLeft(this),
      new FallingRight(this),
    ];
    this.currentState = this.states[1];
    this.image = document.getElementById("dogImage");
    this.width = 200;
    this.height = 181.83;
    // velocity in the y axis and weight fot the gravity
    this.vy = 0;
    this.weight = 1;
    // these x , y coordinate put the image in the center
    this.x = this.gameWidth / 2 - this.width / 2;
    this.y = this.gameHeight / 2 - this.height;

    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 5;

    this.speed = 0;
    this.maxSpeed = 10;

    // this is to slow down the speed of the frame
    this.fps = 120;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
  }

  draw(context, deltaTime) {
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    context.drawImage(
      this.image,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  // this.currentState[0].handleInput --
  // this is the meaning of the below line
  update(input) {
    this.currentState.handleInput(input);

    // Set the horizontal boundaries for the player
    // so that player does not move toward screen
    this.x += this.speed;
    if (this.x <= 0) this.x = 0;
    else if (this.x >= this.gameWidth - this.width)
      this.x = this.gameWidth - this.width;

    // here we deal with the vertical moment of the player
    // and we also set the vertical boundaries for the jumping state
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.weight;
    } else {
      this.vy = 0;
    }
    if (this.y > this.gameHeight - this.height)
      this.y = this.gameHeight - this.height;
  }

  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }

  onGround() {
    return this.y >= this.gameHeight - this.height;
  }
}
