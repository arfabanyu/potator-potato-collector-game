export default class Enemy {
    constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.dx = 0;
    this.dy = 0;
    this.speed = 2;
    this.image = new Image();
    this.image.src = '../design/source/ships-01.svg';
    }

    moveTowards(player){
        this.player = player;
        const angle = Math.atan2(player.y - this.y, player.x - this.x);

        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    }

    draw(ctx, player){
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle + Math.PI / 2);
        ctx.drawImage(this.image, -this.size, -this.size, this.size * 2, this.size * 2);
        ctx.restore();
    }
}