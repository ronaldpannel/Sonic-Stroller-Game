class Sonic {
  constructor(game) {
    this.game = game;

    this.scaler = 0.1;
    this.x = 150;
    this.y = 345;
    this.width = this.game.height * this.scaler;
    this.height = this.game.height * this.scaler;
    this.vel = 0;
    this.acc = 0;
    this.gravity = 0;
    this.isGrounded = false;
    this.image = document.getElementById("sonicImg");
    this.spriteWidth = 32;
    this.spriteHeight = 44;
    this.frameRate = 0;
    this.maxFrames = 8;
    this.frameX = 0;
    this.frameY = 0;
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
      ctx.strokeRect(this.x, this.y * 1, this.width, this.height);
      ctx.stroke();
    }
  }
  update() {
    if (this.y + this.height >= 345) {
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }
    this.vel += this.gravity;
    this.y += this.vel;
    if (this.y >= 345) {
      this.gravity = 0.5;
      this.vel = 0;
      this.y = 345;
      this.gravity = 0;
    }

    this.width = this.game.height * this.scaler;
    this.height = this.game.height * this.scaler;

    this.frameRate++;
    this.frameX++;

    if (this.frameRate % 1 == 0) {
      if (this.frameX >= this.maxFrames) {
        this.frameX = 0;
      }
    }
    if (this.isGrounded) {
      this.frameY = 0;
    } else {
      this.frameY = 1;
    }
  }

  jump() {
    this.vel += -8;
    this.gravity = 0.2;
    jumpSound.currentTime = 0
    jumpSound.play()
  }
}
