import spriteSheet from '@/sprite-sheet.js';

/**
 * @param {'bullet1' | 'bullet2'} src
 */
export function Bullet(game, src) {
  const elem = {
    x: 0,
    y: 0,
    get left() {
      return this.x;
    },
    get center() {
      return this.x + this.w / 2;
    },
    get right() {
      return this.x + this.w;
    },
    get top() {
      return this.y;
    },
    get middle() {
      return this.y + this.h / 2;
    },
    get bottom() {
      return this.y + this.h;
    },
    speed: 10,
    init() {
      this.y = player.y - this.h;
      this.x = player.center - this.w / 2;
    },
    update(this) {
      this.y -= this.speed;
      if (this.y <= 0)
      return this;
    },
    render(this) {
      game.ctx.drawImage(
        game.sprite,
        ...R.values(spriteSheet[src]),
        ...R.props(['x','y','w','h'], this),
      );
    
      return this;
    }
  };

  Object.assign(elem, R.pick(['w','h'], spriteSheet[src]));

  return elem;
}
