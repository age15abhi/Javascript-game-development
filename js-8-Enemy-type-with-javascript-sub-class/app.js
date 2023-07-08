document.addEventListener("DOMContentLoaded", function () {
  // Basic canvas coding
  /**@type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 800;

  class Game {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];

      // enemy creation
      this.enemyInterval = 500;
      this.enemyTimer = 0;

      // Enemy type
      this.enemyType = ["worm", "ghost", "spider"];
    }

    // these two methods are public
    update(deltaTime) {
      this.enemies = this.enemies.filter((Object) => !Object.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewAnime();
        this.enemyTimer = 0;
        // console.log(this.enemies);
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((Object) => Object.update(deltaTime));
    }
    draw() {
      this.enemies.forEach((Object) => Object.draw(this.ctx));
    }

    // add new Anime method is private
    // it is create with the help of the # keyword

    #addNewAnime() {
      const randomEnemy =
        this.enemyType[Math.floor(Math.random() * this.enemyType.length)];
      if (randomEnemy == "worm") {
        this.enemies.push(new Worm(this));
      } else if (randomEnemy == "ghost") {
        this.enemies.push(new Ghost(this));
      } else if (randomEnemy == "spider") {
        this.enemies.push(new Spider(this));
      }
      this.enemies.sort(function (a, b) {
        return a.y - b.y;
      });
    }
  }

  // Enemy Class
  class Enemy {
    constructor(game) {
      this.game = game;
      //   console.log(game);
      this.markedForDeletion = false;
      this.frameX = 0;
      this.maxFrame = 5;
      this.frameInterval = 100;
      this.frameTimer = 0;
    }

    update(deltaTime) {
      this.x -= this.velocityInX * deltaTime;
      if (this.x < 0 - this.width) this.markedForDeletion = true;
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) this.frameX++;
        this.frameX = 0;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }

    draw(ctx) {
      ctx.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
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

  // Worm Class
  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      this.image = worm;
      this.velocityInX = Math.random() * 0.1 + 0.1;
    }
  }

  // Ghost Class
  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.6;
      this.image = ghost;
      console.log(this.image);
      this.velocityInX = Math.random() * 0.2 + 0.1;
      this.angle = 0;
      this.curve = Math.random() * 3; // this is for the up and down motion
    }

    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle) * this.curve;
      this.angle += 0.04;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      super.draw(ctx);
      ctx.restore();
    }
  }

  // Spider Class
  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 310;
      this.spriteHeight = 175;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = Math.random() * this.game.width;
      this.y = 0 - this.height;
      this.image = spider;
      this.velocityInX = 0;
      this.velocityInY = Math.random() * 0.1 + 0.1; // speed of spider up to down
      this.maxLength = Math.random() * this.game.height;
    }

    update(deltaTime) {
      super.update(deltaTime);
      if (this.y < 0 - this.height) this.markedForDeletion = true;
      this.y += this.velocityInY * deltaTime;
      if (this.y > this.maxLength) this.velocityInY *= -1;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, 0);
      ctx.lineTo(this.x + this.width / 2, this.y + 10);
      ctx.stroke();

      super.draw(ctx);
    }
  }

  const game = new Game(ctx, canvas.width, canvas.height);
  // animate function
  let lastTime = 1;

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    game.update(deltaTime);
    game.draw();
    // some code
    requestAnimationFrame(animate);
  }

  animate(0);
});
