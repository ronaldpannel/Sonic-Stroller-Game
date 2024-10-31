class MotoBot {
  constructor(game, x, y) {
    this.game = game;

    this.scaler = 0.1;
    this.x = x;
    this.y = y;
    this.width = this.game.height * this.scaler;
    this.height = this.game.height * this.scaler;
    this.vel = 0;
    this.acc = 0;
    this.gravity = 0;
    this.isGrounded = false;
    this.image = document.getElementById("motobugImg");
    this.spriteWidth = 48;
    this.spriteHeight = 30;
    this.frameRate = 0;
    this.maxFrames = 4;
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 10 * this.game.gameSpeed;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
  }
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );

    if (this.game.debug) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
  update(deltaTime) {
    this.x -= this.game.gameSpeed * 2.4;

    // this.frameRate++;
    // this.frameX++;

     if (this.frameTimer > this.frameInterval) {
       this.frameTimer = 0;
       if (this.frameX < this.maxFrames) {
         this.frameX++;
       } else {
         this.frameX = 0;
       }
     } else {
       this.frameTimer += deltaTime;
     }

    // if (this.frameRate % 1 == 0) {
    //   if (this.frameX >= this.maxFrames) {
    //     this.frameX = 0;
    //   }
    // }
  }
}
