class Sonic {
  constructor(game) {
    this.game = game;
    this.x = 400;
    this.y = 0;
    this.scaler = 10
    this.width = this.game.height / this.scaler;
    this.height = this.game.height / this.scaler;
    this.gravity = 5;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }
  update() {
    this.width = this.game.height / this.scaler;
    this.height = this.game.height / this.scaler;
    this.y += this.gravity;
    if (this.y + this.height >= 400) {
      this.gravity = 0;
    }
  }
  sonicResize() {
    
    this.width = this.game.height / 30;
    this.height = this.game.height / 30;
     if (this.y + this.height >= 400) {
       this.gravity = 0;
     }
  }
}
