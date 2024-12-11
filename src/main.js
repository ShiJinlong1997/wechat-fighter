import spriteSheet from '@/sprite-sheet.js';
import { Background } from '@/use-background.js';

function isHit(elem1, elem2) {
  return (
       elem1.left <= elem2.right && elem2.left <= elem1.right
    && elem1.top <= elem2.bottom && elem2.top <= elem1.bottom
  );
}

const game = {
  sprite: new Image(),
  /** @type {HTMLCanvasElement} */
  canvas: document.getElementById('canvas'),
  get ctx() {
    return this.canvas.getContext('2d');
  },
  timerId: -1,
  init() {
    const pct = Math.min(spriteSheet.background.w / innerWidth, 1);
    // canvas.size 设为 bg.size
    // canvas.style.size 等比缩放
    this.canvas.width = spriteSheet.background.w;
    this.canvas.height = spriteSheet.background.h;
    this.canvas.style.setProperty('width', `${ this.canvas.width * pct }px`);
    this.canvas.style.setProperty('height', `${ this.canvas.height * pct }px`);
  }
};

const bg = Background(game);

const enemyMap = {
  1: [],
  2: [],
  3: [],
};

const player = {
  bulletList: [],
};

function render() {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

  bg.render();

  R
  .values(enemyMap)
  .forEach(enemyList => {
    enemyList
    .inject(R.propEq('idle', 'status'))
    .forEach(enemy => enemy.render(game.ctx));
  });
  
  player
  .bulletList
  .inject(R.propEq('idle','status'))
  .forEach(bullet => bullet.render(game.ctx));
  
  player.render(game.ctx);
}

function run() {
  if (R.propEq('down', 'status', player)) {
    cancelAnimationFrame(handle);
    return;
  }

  bg.update();

  R
  .values(enemyList)
  .forEach(enemyList => {
    enemyList
    .inject(R.propEq('idle', 'status'))
    .forEach(enemy => enemy.update());
  });

  player.shoot();
  player.update();
  player.bulletList.forEach(bullet => bullet.update());

  R.unnest(R.values(enemyList)).find(enemy => {
    if (enemy.isHit(player)) {
      player.hit();
      enemy.hit();
    }
  });

  // 判断 player.bulletList 和 enemyList 碰撞


  player.bulletList.forEach(bullet => {
    enemyMap[bullet.type]
   .inject(R.propEq('idle','status'))
   .forEach(enemy => {
      if (bullet.isHit(enemy)) {
        enemy.hit();
        bullet.hit();
      }
    });
  });

  render();

  game.timerId = requestAnimationFrame(run);
}

function init() {
  game.init();
  bg.init();
}

function loadSprite() {
  game.sprite.src = '@/assets/sprite-sheet.png';
  return new Promise(resolve => {
    game.sprite.addEventListener('load', resolve, { once: true });
  });
}

function start() {
  game.timerId = requestAnimationFrame(run);
}

async function main() {
  await loadSprite();
  init();
}
