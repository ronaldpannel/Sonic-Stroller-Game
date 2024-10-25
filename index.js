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
      this.gameOver = false;
      this.startBtn = document.getElementById("startBtn");

      this.bg = new Bg(this, cityBg, 1, 60);
      this.bg1 = new Bg(this, platformImg, 2, 0);
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
      this.startBtn.addEventListener("click", () => {
        location.reload();
      });
      window.addEventListener("mousedown", () => {
        this.sonic.jump();
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
    }
    createMotoBots() {
      if (this.frameRate % randomIntFromRange(200, 600) == 0) {
        let x = this.width + 50;
        let y = 345;
        this.motoBotArray.push(new MotoBot(this, x, y));
      }
    }
    createRings() {
      if (this.frameRate % randomIntFromRange(50, 200) == 0) {
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
        "Press Arr0w Up or Click Mouse to Jump",
        this.width * 0.5,
        50
      );
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
    render(ctx) {
      this.createMotoBots();
      this.createRings();
      this.frameRate++;

      this.bg.draw(ctx);
      this.bg.update();
      this.bg1.draw(ctx);
      this.bg1.update();

      this.sonic.draw(ctx);
      this.sonic.update();

      for (let i = this.motoBotArray.length - 1; i > 0; i--) {
        this.motoBotArray[i].draw(ctx);
        this.motoBotArray[i].update();
        if (this.motoBotArray[i].x < 0) {
          this.motoBotArray.splice(i, 1);
        }
      }
      this.displayScore(ctx);

      for (let i = this.ringsArray.length - 1; i > 0; i--) {
        this.ringsArray[i].draw(ctx);
        this.ringsArray[i].update();
        if (this.ringsArray[i].x < 0) {
          this.ringsArray.splice(i, 1);
        }
      }
      //sonic ring collision
      for (let i = 0; i < this.ringsArray.length; i++) {
        let b = this.ringsArray[i];
        if (this.collision(this.sonic, b)) {
          ringSound.currentTime = 0;
          ringSound.volume = 0.1;
          ringSound.play();
          this.score++;
          this.ringsArray.splice(i, 1);
        }
      }
      //sonic motoBot collision
      for (let i = 0; i < this.motoBotArray.length; i++) {
        let b = this.motoBotArray[i];
        if (this.collision(this.sonic, b)) {
          if (this.sonic.isGrounded) {
            this.startBtn.classList.add("btnActive");
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
            destroySound.currentTime = 0;
            destroySound.volume = 0.3;
            destroySound.play();
            this.motoBotArray.splice(i, 1);
          }
        }
      }
      if (!this.gameOver) {
        citySound.volume = 0.3
        citySound.play();
        citySound.loop = true;
      }else{
        citySound.pause()
      }
    }
  }

  const game = new Game(canvas.width, canvas.height);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    animations = requestAnimationFrame(animate);
    if (game.gameOver) {
      cancelAnimationFrame(animations);
    }
  }
  animate();

  //end of load
});
