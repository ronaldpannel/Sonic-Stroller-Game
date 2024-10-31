window.addEventListener("load", () => {
  /**@type{HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1420;
  canvas.height = 680;
  const aspectRatio = canvas.width / canvas.height;
  const cityBg = document.getElementById("cityBg");
  const platformImg = document.getElementById("platformBg");
  const ringSound = document.getElementById("hyperRingSound");
  const jumpSound = document.getElementById("Jump.wav");
  const destroySound = document.getElementById("destroySound");
  const hurtSound = document.getElementById("hurtSound");
  const citySound = document.getElementById("citySound");

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.gameSpeed = 1;
      this.frameRate = 0;
      this.motoBotArray = [];
      this.ringsArray = [];
      this.debug = false;
      this.score = 0;
      this.highestScore = localStorage.getItem("sonicHighScore") || 0;
      this.hsScore;

      this.gameOver = false;
      this.startBtn = document.getElementById("startBtn");
      this.resetBtn = document.getElementById("resetBtn");

      this.bg = new Bg(this, cityBg, 1, 60);
      this.bg1 = new Bg(this, platformImg, 1.5, 0);
      this.sonic = new Sonic(this);

      window.addEventListener("keydown", (e) => {
        if (e.key === "d" && this.sonic.isGrounded) {
          this.debug = !this.debug;
        }
      });

      window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" && this.sonic.isGrounded) {
          this.sonic.jump();
        }
      });
      this.resetBtn.addEventListener("click", () => {
        location.reload();
        localStorage.setItem("sonicHighScore", 0);
      });

      this.startBtn.addEventListener("click", () => {
        location.reload();
      });
      window.addEventListener("mousedown", () => {
        if (this.sonic.isGrounded) {
          this.sonic.jump();
        }
      });

      window.addEventListener("resize", (e) => {
        let width = e.currentTarget.innerWidth;
        let height = Math.floor(e.currentTarget.innerWidth / aspectRatio);
        this.reset(width, height);
      });
      this.reset(this.width, this.height);
    }
    reset(width, height) {
      canvas.width = width;
      canvas.height = height;
      this.width = width;
      this.height = height;
      setInterval(() => {
        this.gameSpeed += 0.2;
      }, 5000);
    }
    createMotoBots() {
      if (this.frameRate % 300 == 0) {
        let x = this.width + 50;
        let y = 345;
        this.motoBotArray.push(new MotoBot(this, x, y));
      }
    }
    createRings() {
      if (this.frameRate % randomIntFromRange(50, 700) == 0) {
        let x = this.width + 50;
        let y = 320;
        this.ringsArray.push(new Ring(this, x, y));
      }
    }
    collision(a, b) {
      if (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      ) {
        return true;
      }
    }
    displayScore(ctx) {
      ctx.font = "30px Aerial";
      ctx.fillStyle = "white";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(`SCORE:-  ${this.score}`, 100, 50);

      ctx.fillText(
        "Press Arrow Up or Click Mouse to Jump",
        this.width * 0.5,
        50
      );
      ctx.fillText(`HIGH SCORE:- ${this.highestScore}`, 1280, 50);
      if (this.gameOver) {
        ctx.font = "60px Aerial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(
          `GAME OVER your score is:-  ${this.score}`,
          this.width * 0.5,
          this.height * 0.5 - 100
        );
      }
    }
    showHitScore(ctx) {
      if (!this.sonic.isGrounded && this.sonic.isHitting) {
        ctx.fillStyle = "yellow";
        ctx.font = "30px Aerial";
        ctx.fillText(" +10", this.sonic.x, this.sonic.y);
      }
    }

    showCoinScore(ctx) {
      if (this.sonic.isHittingCoin) {
        ctx.fillStyle = "yellow";
        ctx.font = "30px Aerial";
        ctx.fillText(" +1", this.sonic.x, this.sonic.y);
      }
    }
    setHighestScore() {
      if (this.score > localStorage.getItem("sonicHighScore")) {
        localStorage.setItem("sonicHighScore", this.score);
        this.hsScore = localStorage.getItem("sonicHighScore");
        this.highestScore = this.hsScore;
      }
    }

    render(ctx, deltaTime) {
      this.createMotoBots();
      this.createRings();
      this.frameRate++;

      this.bg.draw(ctx);
      this.bg.update();
      this.bg1.draw(ctx);
      this.bg1.update();

      this.sonic.draw(ctx);
      this.sonic.update(deltaTime);

      for (let i = this.motoBotArray.length - 1; i > 0; i--) {
        this.motoBotArray[i].draw(ctx);
        this.motoBotArray[i].update(deltaTime);
        if (this.motoBotArray[i].x < 0) {
          this.motoBotArray.splice(i, 1);
        }
      }
      this.displayScore(ctx);
      this.setHighestScore();
      this.showHitScore(ctx);
      this.showCoinScore(ctx);

      for (let i = this.ringsArray.length - 1; i > 0; i--) {
        this.ringsArray[i].draw(ctx);
        this.ringsArray[i].update(deltaTime);
        if (this.ringsArray[i].x < 0) {
          this.ringsArray.splice(i, 1);
        }
      }
      //sonic ring collision
      for (let i = 0; i < this.ringsArray.length; i++) {
        let b = this.ringsArray[i];
        if (this.collision(this.sonic, b)) {
          this.sonic.isHittingCoin = true;
          ringSound.currentTime = 0;
          ringSound.volume = 0.1;
          ringSound.play();
          this.score++;
          this.ringsArray.splice(i, 1);
          setTimeout(() => {
            this.sonic.isHittingCoin = false;
          }, 800);
        }
      }
      //sonic motoBot collision
      for (let i = 0; i < this.motoBotArray.length; i++) {
        let b = this.motoBotArray[i];
        if (this.collision(this.sonic, b)) {
          if (this.sonic.isGrounded) {
            this.startBtn.classList.add("btnActive");
            this.resetBtn.classList.add("btnActive");
            hurtSound.currentTime = 0;
            hurtSound.volume = 0.5;
            hurtSound.play();
            setTimeout(() => {
              this.gameOver = true;
            }, 100);
          }
          if (
            this.sonic.y + this.sonic.height >= b.y &&
            this.sonic.x < b.x + b.width &&
            this.sonic.x + this.sonic.width > b.x &&
            !this.sonic.isGrounded
          ) {
            this.sonic.jump();
            this.sonic.jump();
            this.score += 10;
            this.sonic.isHitting = true;
            destroySound.currentTime = 0;
            destroySound.volume = 0.3;
            destroySound.play();
            this.motoBotArray.splice(i, 1);
            setTimeout(() => {
              this.sonic.isHitting = false;
            }, 800);
          }
        }
      }
      if (!this.gameOver) {
        citySound.volume = 0.3;
        citySound.play();
        citySound.loop = true;
      } else {
        citySound.pause();
      }

      if (!this.sonic.isGrounded) {
        this.bg.y += 0.5;
        setTimeout(() => {
          this.bg.y -= 0.5;
        }, 250);
      }
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.render(ctx, deltaTime);
    animations = requestAnimationFrame(animate);
    if (game.gameOver) {
      cancelAnimationFrame(animations);
    }
  }
  animate(0);

  //end of load
});
