export default class Player {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.dx = 0;
    this.dy = 0;
    this.speed = 2;
    this.image = new Image();
    this.image.src = '../design/source/musang.png';
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    const canvas = document.querySelector('canvas');

    if (this.x > canvas.width) this.x = 0;
    if (this.y > canvas.height) this.y = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y < 0) this.y = canvas.height;
  }

  draw(ctx) {
    const angle = Math.atan2(this.dy, this.dx);

    ctx.save();
    ctx.translate(this.x, this.y);

  if (this.dx < 0) {
    // Menghadap kiri
    ctx.scale(-1, 1); // mirror horizontal
    ctx.drawImage(this.image, -this.size, -this.size, this.size * 2, this.size * 2);
  } else {
    // Menghadap kanan
    ctx.drawImage(this.image, -this.size, -this.size, this.size * 2, this.size * 2);
  }

  ctx.restore();
  }
}
