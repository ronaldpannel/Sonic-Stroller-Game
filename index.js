window.addEventListener("load", () => {
  /**@type{HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1420;
  canvas.height = 680;
  const aspectRatio = canvas.width / canvas.height;
  const cityBg = document.getElementById("cityBg");
  const platformImg = document.getElementById("platformBg");

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.gameSpeed = 1;
      this.frameRate = 0;
      this.motoBotArray = [];
      this.ringsArray = [];
      this.debug = true;

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
      if (this.frameRate % Math.floor(Math.random() * 1000 + 1) == 0) {
        let x = this.width + 50;
        let y = 345;
        this.motoBotArray.push(new MotoBot(this, x, y));
      }
      console.log(this.motoBotArray.length);
    }
    createRings() {
      if (this.frameRate % Math.floor(Math.random() * 1000 + 1) == 0) {
        let x = this.width + 50;
        let y = 145;
        this.ringsArray.push(new Ring(this, x, y));
      }
      console.log(this.ringsArray.length);
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

      for (let i = this.ringsArray.length - 1; i > 0; i--) {
        this.ringsArray[i].draw(ctx);
        this.ringsArray[i].update();
        if (this.ringsArray[i].x < 0) {
          this.ringsArray.splice(i, 1);
        }
      }
    }
  }

  const game = new Game(canvas.width, canvas.height);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
  }
  animate();

  //end of load
});
