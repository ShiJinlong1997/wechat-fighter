import spriteSheet from './sprite-sheet.js';

function update(entity) {
  R.when(
    () => entity.sprite.interval <= R.subtract(Date.now(), entity.sprite.lastTime),
    () => entity.sprite.set(entity.sprite.i + 1)
  );

  // 若游戏时间经过了 entity.update.timeout，则更新 entity 的图片索引
  if (gameTime >= entity.update.timeout) {
    entity.update.timeout += entity.update.interval;
    entity.update.index = (entity.update.index + 1) % entity.update.images.length;
  }

  // 若 entity 已被击中，则更新其图片索引为击中图片索引
  if (entity.hit) {
    entity.update.index = entity.update.hitIndex;
  }

  // 若 entity 已被击中且游戏时间超过了 entity.hit.timeout，则将 entity.hit 设置为 false
  if (
    entity.hit
  ) {
    entity.status.status = 'alive';
  }
}

export function Enemy1(game) {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    speed: 10,
    hp: 1,
    status: 'idle',
    hit: {
      lastTime: Number.POSITIVE_INFINITY,
      recoveryTime: 1000,
    },
    get isHit() {
      return Date.now() - this.hit.lastTime <= this.hit.recoveryTime;
    },
    frame: {
      active: ['enemy1'],
      hit: [],
      down: R.range(0, 4).map(R.compose( R.concat('enemy1_down'), R.inc )),
      i: 0,
      interval: 100,
      lastTime: 0,
    },
    get src() {
      return this.frame[this.status][this.frame.i];
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
}
