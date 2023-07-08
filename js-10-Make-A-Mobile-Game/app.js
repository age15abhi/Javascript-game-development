window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1500;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;
  const fullScreenButton = this.document.getElementById("fullScreenButton");

  // Input Handler class
  class InputHandler {
    constructor() {
      this.keys = [];
      this.touchY = "";
      this.touchTresHold = 30;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        } else if (e.key === "Enter" && gameOver) restartGame();
        console.log(this.keys);
      });

      window.addEventListener("keyup", (e) => {
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight"
        ) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });

      window.addEventListener("touchstart", (e) => {
        this.touchY = e.changedTouches[0].pageY;
      });
      window.addEventListener("touchmove", (e) => {
        const swipeDistance = e.changedTouches[0].pageY - this.touchY;
        if (
          swipeDistance < -this.touchTresHold &&
          this.keys.indexOf("swipe up") === -1
        )
          this.keys.push("swipe up");
        else if (
          swipeDistance > this.touchTresHold &&
          this.keys.indexOf("swipe down") === -1
        ) {
          this.keys.push("swipe down");
          if (gameOver) restartGame();
        }
      });
      window.addEventListener("touchend", (e) => {
        this.keys.splice(this.keys.indexOf("swipe up"), 1);
        this.keys.splice(this.keys.indexOf("swipe down"), 1);
      });
    }
  }

  // player class
  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById("playerImage");
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
      this.maxFrame = 8;

      // fps
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
    }

    restart() {
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.maxFrame = 8;
      this.frameY = 0;
    }

    draw(context) {
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
    update(input, deltaTime, enemies) {
      // collision detection
      enemies.forEach((enemy) => {
        const dx = enemy.x + enemy.width / 2 - (this.x + this.width / 2);
        const dy = enemy.y + enemy.height / 2 - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.width / 2 + enemy.height / 2) {
          gameOver = true;
        }
      });

      // sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }

      // Horizontal Movement - control
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
      } else if (
        input.keys.indexOf("ArrowUp") > -1 ||
        (input.keys.indexOf("swipe up") > -1 && this.onGround())
      ) {
        this.vy = -32;
        this.frameY = 1;
      } else {
        this.speed = 0;
      }

      // horizontal boundaries
      this.x += this.speed;
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;

      // vertical movement - control
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 5;
      } else {
        this.vy = 0;
        this.frameY = 0;
        this.maxFrame = 8;
      }
      if (this.y > this.gameHeight - this.height)
        this.y = this.gameHeight - this.height;
    }
    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }

  // BackGround class
  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.image = document.getElementById("backgroundImage");
      this.speed = 7;
    }

    restart() {
      this.x = 0;
    }

    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width - this.speed,
        this.y,
        this.width,
        this.height
      );
    }
    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }
  }

  // class Enemy
  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById("enemyImage");
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;

      // frames
      this.frameX = 0;
      this.maxFrame = 5;
      this.speed = 8;
      // fps - frame per second
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;

      // remove the enemies who left the screen
      this.markedForDeletion = false;
    }

    draw(context) {
      context.drawImage(
        this.image,
        // image cropping and its framing
        this.frameX * this.width,
        0,
        this.width,
        this.height,

        // image size compared to the rectangle
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frame++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.markedForDeletion = true;
        score++;
      }
    }
  }

  // Handle Enemy function
  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach((enemy) => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
    enemies.filter((enemy) => !enemy.markedForDeletion);
  }

  // function to display the score
  function displayStatusText(context) {
    context.font = "40px Helvetica";
    context.fillStyle = "black";
    context.fillText("Score: " + score, 20, 50);
    context.fillStyle = "white";
    context.fillText("Score: " + score, 22, 52);

    if (gameOver) {
      context.textAlign = "center";
      context.fillStyle = "black";
      context.fillText(
        "GAME OVER , try again! , Press Enter to restart",
        canvas.width / 2,
        200
      );
      context.fillStyle = "white";
      context.fillText(
        "GAME OVER , try again! , Press Enter to restart",
        canvas.width / 2 + 2,
        202
      );
    }
  }

  function restartGame() {
    player.restart();
    backGround.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate(0);
  }

  function toggleFullScreen() {
    console.log(document.fullscreenElement);
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch((err) => {
        alert(`Error , you can not enable full screen mode`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // EventListen to the full screen button
  fullScreenButton.addEventListener('click' , toggleFullScreen);
 

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const backGround = new Background(canvas.width, canvas.height);

  // here is the variable to throw multiple enemy using delta time
  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;

  // animate function
  function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    // console.log(deltaTime)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backGround.draw(ctx);
    backGround.update();

    player.draw(ctx);
    player.update(input, deltaTime, enemies); // here we pass the input object of class input handler

    handleEnemies(deltaTime);

    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});
