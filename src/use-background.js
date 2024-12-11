import spriteSheet from '@/sprite.js';

export function Background(game) {
  return {
    y: 0,
    canvas: document.createElement('canvas'),
    get ctx() {
      return this.canvas.getContext('2d');
    },
    init() {
      this.y = -game.canvas.height;
      this.canvas.width = game.canvas.width;
      this.canvas.height = game.canvas.height * 2;
  
      const offsetList = [0, game.canvas.height];
      offsetList.forEach(offset => {
        this.ctx.drawImage(
          game.sprite,
          ...R.values(['x','y','w','h'], spriteSheet.background),
          0, this.y + offset, game.canvas.width, game.canvas.height,
        );
      });
    },
    update() {
      this.y += 1;
      if (0 <= this.y) {
        this.y = -game.canvas.height;
      }
    },
    render() {
      game.ctx.drawImage(this.canvas, 0, this.y);
    },
  };
}
