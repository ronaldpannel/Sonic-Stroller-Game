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

      this.bg = new Bg(this, cityBg, 1, 60);
      this.bg1 = new Bg(this, platformImg, 2, 0);
      this.sonic = new Sonic(this);

      window.addEventListener("resize", (e) => {
        let width = e.currentTarget.innerWidth;
        let height = Math.floor(e.currentTarget.innerWidth / aspectRatio);
        this.reset(width, height);
        console.log("h", height, "w", width);
      });
      this.reset(this.width, this.height);
    }
    reset(width, height) {
      canvas.width = width;
      canvas.height = height;
      this.width = width;
      this.height = height;
      // this.sonic.sonicResize()
    }
    render(ctx) {
      this.bg.draw(ctx);
      this.bg.update();
      this.bg1.draw(ctx);
      this.bg1.update();

      this.sonic.draw(ctx);
      this.sonic.update()
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
