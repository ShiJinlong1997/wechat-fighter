import spriteSheet from './sprite-sheet.js';

export function Player(game) {
  const elem = {
    x: 0,
    y: 0,
    get center() {
      return this.x + this.w / 2;
    },
    get middle() {
      return this.y + this.h / 2;
    },
    hp: 1,
    status: 'idle',
    frame: {
      active: R.map(R.compose( R.concat('hero'), R.inc ), R.range(0, 2)),
      down: R.map(R.compose( R.concat('hero_blowup_n'), R.inc ), R.range(0, 4)),
      i: 0,
      interval: 100,
      lastTime: 0,
    },
    get src() {
      return this.frame[this.status][this.frame.i];
    },
    bulletList: [],
    shoot(Bullet) {
      const append = xs => x => xs.push(x);
      const findOrCreate = R.unless(
        R.find(R.propEq('idle', 'status')),
        R.compose( R.tap(R.__, Bullet()), append )
      );

      findOrCreate(this.bulletList).init();
      return this;
    },
    update() {
      this.bulletList.forEach(bullet => bullet.update());
      this.src = loop;
      return this;
    },
    render() {
      game.ctx.drawImage(
        game.sprite,
        ...R.values(spriteSheet[this.src]),
        ...R.props(['x','y','w','h'], this),
      );

      return this;
    },
  };

  Object.assign(elem, R.pick(['w','h'], spriteSheet.hero1));

  return elem;
}
