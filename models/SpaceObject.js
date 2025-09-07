export default class SpaceObject {
  constructor(x, y, size, score) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.score = score;
    this.image = new Image();
    this.tick = Math.random() * Math.PI * 2; // biar nggak semua objek sync
    this.yOffset = 0;
  }

  update() {
    // bikin naik-turun pakai fungsi sinus
    this.tick += 0.04; // semakin besar → semakin cepat
    this.yOffset = Math.sin(this.tick) * 5; // 5 = tinggi gelombang
  }

  draw(ctx) {
    this.image.src =
      this.score === 20
        ? '../public/images/koin.png'
        : this.score === 10
        ? '../public/images/kentang.png'
        : '../public/images/minuman.png';

    const size =
      this.score === 20
        ? this.size * 1.5
        : this.score === 10
        ? this.size * 4.5
        : this.size * 4;
    ctx.save();
    ctx.translate(this.x, this.y + this.yOffset); // tambahin offset
    ctx.drawImage(this.image, -size / 2, -size / 2, size, size);
    ctx.restore();
  }
}
