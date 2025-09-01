export default class SpaceObject {
    constructor(x, y, size, score){
    this.x = x;
    this.y = y;
    this.size = size;
    this.score = score;
    this.image = new Image();
    }

    draw(ctx){
        this.image.src = this.score === 20 ? '../design/source/objects-06.svg' : '../design/source/objects-04.svg';

        const size = this.score === 20 ? this.size * 4 : this.size * 2;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.image, -this.size, -this.size, size, size);
        ctx.restore();
    }
}