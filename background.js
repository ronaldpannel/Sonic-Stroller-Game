class Bg {
  constructor(game, image, speedMultiplier, y) {
    this.game = game;
    this.image = image;
    this.x = 0;
    this.y = y;
    this.speedMultiplier = speedMultiplier;
    this.width = this.game.width;
    this.height = this.game.height;
    this.speed = this.game.gameSpeed * this.speedMultiplier;
  }
  draw(ctx) {
    
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
  update() {
    this.width = this.game.width;
    this.height = this.game.height;
    this.speed = this.game.gameSpeed * this.speedMultiplier;
    if (this.x <= -this.width) {
      this.x = 0;
    }
    this.x = Math.floor(this.x - this.speed);
  }
}
