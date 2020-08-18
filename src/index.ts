import {Scene, PlayerStatus, PauseBtnStatus, EnemyStatus} from './enums.js';
import {Size, Pos, Player, El} from './interfaces.js';
import {Bullet, Enemy} from './classes.js';
import {MultiStatusElName, maxCanvasSz, canvasDic, ctxDic, multiStatusElBasicInfo, ImgResourceName, imgResourceSrcDic, imgResourceDic, canvasImgSources, multiStatusElCanvasImgSources} from './sourcedata.js';
import {isImpact, isTouched, isClicked} from './utils.js';

type SizeAndPos = Size & Pos;
const wastedEvent = new CustomEvent('wasted');

const canvasContainer = document.getElementById('canvasContainer') as HTMLDivElement;
const canvasUIHeight: number = 45;
const canvasUIElDic: Record<'pause'/*  | 'voice' */, SizeAndPos> = {
  pause: {
    width: 60,
    height: canvasUIHeight,
    x: 0,
    y: 0,
  },
  // voice: {
  //   width: 60,
  //   height: canvasUIHeight,
  //   x: 0,
  //   y: 0,
  // },
};

const player: Player = {
  status: PlayerStatus.Normal1,
  width: 68,
  height: 84,
  x: 0,
  y: 0,
  isActive: false,
  score: 0,
  init() {
    this.status = PlayerStatus.Normal1;
    this.x = canvasDic.main.width / 2 - this.width / 2;
    this.y = canvasDic.main.height - this.height / 2;
    this.isActive = false;
    this.score = 0;
  },
  move(pos: Pos | undefined) {
    // 防超出屏幕
    this.x = (pos as Pos).x <= canvasDic.main.width ? (pos as Pos).x : canvasDic.main.width - this.width / 2;
    this.y = (pos as Pos).y <= canvasDic.main.height ? (pos as Pos).y : canvasDic.main.height - this.height / 2;
  },
  update() {
    if (0 == state.time % 15) {
      player.status < PlayerStatus.Wasted
      ? this.toggleNormalStatus()
      : ++this.status;
    }
    this.render();
  },
  toggleNormalStatus() {
    this.status = PlayerStatus.Normal1 == this.status ? PlayerStatus.Normal2 : PlayerStatus.Normal1;
  },
  shoot() {
    const idx = state.bullets.findIndex(bullet => !bullet.isActive);
    -1 != idx
    ? state.bullets[idx].init({x: this.x, y: this.y - this.height / 2})
    : new Bullet() && this.shoot();
  },
  render() {
    const canvasImgSource: CanvasImageSource = multiStatusElCanvasImgSources.player[this.status];
    !!canvasImgSource && ctxDic.main.drawImage(canvasImgSource, this.x - this.width / 2, this.y - this.height / 2);
  }
};

interface State {
  scene: Scene;
  isPaused: boolean;
  time: number;
  handle: number;
  enemies: Enemy[];
  bullets: Bullet[];
  init: () => void;
}

const state: State = {
  scene: Scene.Start,
  /** 是否已暂停 */
  isPaused: false,
  /** 用于决定敌机出现时机 */
  time: 0,
  /** 接收 requestAnimationFrame 返回值 */
  handle: 0,
  enemies: [],
  bullets: [],
  init() {
    this.scene = Scene.Start;
    this.isPaused = false;
    this.time = 0;
    this.handle = 0;
  },
};

interface Bg {
  y: number;
  init: () => void;
  update: () => void;
  render: () => void;
}

const bg: Bg = {
  y: 0,
  init() {
    canvasImgSources.bg.width = canvasDic.bg.width;
    canvasImgSources.bg.height = canvasDic.bg.height * 2;
    const ctx = canvasImgSources.bg.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(imgResourceDic.bg, 0, 0, canvasDic.bg.width, canvasDic.bg.height);
    ctx.drawImage(imgResourceDic.bg, 0, canvasDic.bg.height, canvasDic.bg.width, canvasDic.bg.height);
    this.y = -canvasImgSources.bg.height / 2;
  },
  update() {
    this.y += 1;
    0 <= this.y && (this.y = -canvasImgSources.bg.height / 2);
    this.render();
  },
  render() {
    ctxDic.bg.clearRect(0, 0, canvasDic.bg.width, canvasDic.bg.height);
    ctxDic.bg.drawImage(canvasImgSources.bg, 0, this.y);
  }
};

const handleTouchSceneMap: Map<number, Function> = new Map([
  [Scene.Start, touchStart],
  [Scene.End, touchRestart],
]);

const handleClickSceneMap: Map<number, Function> = new Map([
  [Scene.Start, clickStart],
  [Scene.End, clickRestart],
]);

// 更新
function updateMainInPlaying(): void {
  updateBullets();
  updateEnemies();
  impact();
}

function enemiesTakingAction(): void {
  if (0 == state.time % 800) {
    const idx = state.enemies.findIndex(enemy => 2 == enemy.lv && !enemy.isActive);
    -1 != idx ? state.enemies[idx].init() : new Enemy(1);
  } else if (0 == state.time % 80) {
    const idx = state.enemies.findIndex(enemy => 1 == enemy.lv && !enemy.isActive);
    -1 != idx ? state.enemies[idx].init() : new Enemy(2);
  }
}

function updateBullets(): void {
  for (let i = 0; i < state.bullets.length; ++i) {
    state.bullets[i].isActive && state.bullets[i].move();
  }
}

function updateEnemies(): void {
  for (let i = 0; i < state.enemies.length; ++i) {
    state.enemies[i].isActive && state.enemies[i].move();
  }
}

function impact(): void {
  for (let enemyIdx = 0; enemyIdx < state.enemies.length; ++enemyIdx) {
    if (
      state.enemies[enemyIdx].hp <= 0
      || !state.enemies[enemyIdx].isActive
    ) { continue; }
    for (let bulletIdx = 0; bulletIdx < state.bullets.length; ++bulletIdx) {
      if (!state.bullets[bulletIdx].isActive) { continue; }
      if (isImpact(state.enemies[enemyIdx], state.bullets[bulletIdx])) {
        state.bullets[bulletIdx].exit();
        --state.enemies[enemyIdx].hp;
        ++player.score;
      }
    }

    // 检测敌机和玩家碰撞
    if (isImpact(state.enemies[enemyIdx], player)) {
      --state.enemies[enemyIdx].hp;
      state.enemies[enemyIdx].status = EnemyStatus.Wasted;
      document.dispatchEvent(wastedEvent);
    }
  }
}

// 操作
function togglePause(): void {
  const isPaused: boolean = !state.isPaused;
  state.isPaused = isPaused;

  isPaused
  ? cancelAnimationFrame(state.handle)
  : state.handle = requestAnimationFrame(run);
  
  const pauseBtnStatus: PauseBtnStatus = isPaused ? PauseBtnStatus.ResumeNormal : PauseBtnStatus.PauseNormal;
  ctxDic.scene.clearRect(canvasUIElDic.pause.x, 0, canvasUIElDic.pause.width, canvasUIElDic.pause.height);
  ctxDic.scene.drawImage(multiStatusElCanvasImgSources.pause[pauseBtnStatus], canvasUIElDic.pause.x, 0);
}

function touchCanvasUI(event: TouchEvent): void {
  isTouched(event.targetTouches[0], canvasUIElDic.pause)
}

function clickCanvasUI(event: MouseEvent): void {
  isClicked(event, canvasUIElDic.pause)
}

function touchCanvasScene(event: TouchEvent): void {
  handleTouchSceneMap.get(state.scene)?.(event);
}

function clickCanvasScene(event: MouseEvent): void {
  handleClickSceneMap.get(state.scene)?.(event);
}

function touchStart(event: TouchEvent): void {
  const fz: number = 24;
  const txt: SizeAndPos = {
    x: canvasDic.scene.width / 2 - fz,
    y: 480,
    width: fz * 2,
    height: fz,
  };
  if (isTouched(event.targetTouches[0], txt)) {
    state.scene = Scene.Playing;
    ctxDic.scene.clearRect(0, 0, canvasDic.scene.width, canvasDic.scene.height);
    canvasDic.scene.classList.toggle('no-event');
    canvasDic.main.classList.toggle('no-event');
  }
}

function clickStart(event: MouseEvent): void {
  const fz: number = 24;
  const txt: SizeAndPos = {
    x: canvasDic.scene.width / 2 - fz,
    y: 480,
    width: fz * 2,
    height: fz,
  };
  if (isClicked(event, txt)) {
    state.scene = Scene.Playing;
    ctxDic.scene.clearRect(0, 0, canvasDic.scene.width, canvasDic.scene.height);
    canvasDic.scene.classList.toggle('no-event');
    canvasDic.main.classList.toggle('no-event');
  }
}

function movePlayerOnMobile(event: TouchEvent): void {
  event.preventDefault();
  if (!isTouched(event.targetTouches[0], player)) { return; }
  player.move({
    x: event.targetTouches[0].clientX - canvasDic.main.offsetLeft,
    y: event.targetTouches[0].clientY - canvasDic.main.offsetTop,
  });
}

function movePlayerOnPC(event: MouseEvent): void {
  if (!event) { return; }
  player.move({
    x: event.offsetX,
    y: event.offsetY,
  });
}

function main(): void {
  init();
  state.handle = requestAnimationFrame(run);
}

async function init(): Promise<void> {
  initEvents();
  await initImgSourceDic();
  initMultiStatusElCanvasImgSources(); // 切割 <img>
  initCanvasSz();
  initCanvasScene();
  initCanvasUI();
  bg.init();
  initEls();
}

function initEvents(): void {
  const canvasContainer = document.getElementById('canvasContainer') as HTMLDivElement;
  canvasContainer.addEventListener('click', console.log);
  document.addEventListener('wasted', gameover);
  canvasDic.ui.addEventListener('touchstart', togglePause);
  canvasDic.ui.addEventListener('click', togglePause);
  canvasDic.scene.addEventListener('touchstart', touchCanvasScene);
  canvasDic.scene.addEventListener('click', clickCanvasScene);
  canvasDic.main.addEventListener('touchmove', movePlayerOnMobile);
  canvasDic.main.addEventListener('mousemove', movePlayerOnPC);
}

function initImgSourceDic(): Promise<void> {
  let countLoadedImgs: number = 0;
  let prop: ImgResourceName;
  return new Promise((resolve, reject) => {
    for (prop in imgResourceSrcDic) {
      imgResourceDic[prop].src = imgResourceSrcDic[prop];
      imgResourceDic[prop].addEventListener('load', event => {
        ++countLoadedImgs;
        Object.keys(imgResourceSrcDic).length == countLoadedImgs && resolve();
      });
    }
  });
}

function initMultiStatusElCanvasImgSources(): void {
  let prop: MultiStatusElName;
  for (prop in multiStatusElBasicInfo) {
    for (let i = 0; i < multiStatusElBasicInfo[prop].countStatuses; ++i) {
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      canvas.width = multiStatusElBasicInfo[prop].width;
      canvas.height = multiStatusElBasicInfo[prop].height;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.drawImage(imgResourceDic[prop], 0, i * canvas.height, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
      multiStatusElCanvasImgSources[prop][i] = canvas;
    }
  }
}

function initCanvasSz(): void {
  const canvasSz: Size = {
    width: document.documentElement.clientWidth < maxCanvasSz.width ? document.documentElement.clientWidth : maxCanvasSz.width,
    height: document.documentElement.clientHeight < maxCanvasSz.height ? document.documentElement.clientHeight : maxCanvasSz.height,
  };

  canvasContainer.style.cssText += `
    width: ${canvasSz.width}px;
    height: ${canvasSz.height}px;
  `;

  canvasDic.bg.width = canvasDic.scene.width = canvasDic.main.width = canvasSz.width;
  canvasDic.bg.height = canvasDic.scene.height = canvasDic.main.height = canvasSz.height;
  
  canvasDic.ui.width = canvasSz.width;
  canvasDic.ui.height = canvasUIHeight;
}

function initCanvasScene(): void {
  initSceneStart();
}

function initCanvasUI(): void {
  canvasUIElDic.pause.x = canvasDic.ui.width - canvasUIElDic.pause.width;
  ctxDic.ui.drawImage(multiStatusElCanvasImgSources.pause[PauseBtnStatus.PauseNormal], canvasUIElDic.pause.x, 0);
}

function initEls() {
  state.enemies.push(new Enemy(2));

  for (let i = 0; i < 10; ++i) {
    state.enemies.push(new Enemy(1));
    state.bullets.push(new Bullet());
  }
}

function run(): void {
  bg.update();

  if (state.scene == Scene.Playing) {
    ctxDic.main.clearRect(0, 0, canvasDic.main.width, canvasDic.main.height);
    ++state.time;

    if (player.status < PlayerStatus.Wasted) {
      enemiesTakingAction();
      0 == state.time % 10 && player.shoot(); // 玩家开火
      updateMainInPlaying();
    }

    player.update();

    // 玩家死后只更新状态动画到最后并显示场景文字
    if (PlayerStatus.Wasted <= player.status) {
      player.status < multiStatusElBasicInfo.player.countStatuses && player.update();
      if (multiStatusElBasicInfo.player.countStatuses <= player.status) {
        state.scene = Scene.End;
        ctxDic.main.clearRect(0, 0, canvasDic.main.width, canvasDic.main.height);
        drawTxtAlign('重开', canvasDic.scene.height / 2);
      }
    }
  }

  state.handle = requestAnimationFrame(run);
}

function gameover(): void {
  player.status = PlayerStatus.Wasted;
  canvasDic.scene.classList.toggle('no-event');
  canvasDic.main.classList.toggle('no-event');
}

function touchRestart(event: TouchEvent): void {
  const fz: number = 24;
  const txt: SizeAndPos = {
    x: canvasDic.scene.width / 2 - fz,
    y: canvasDic.scene.height / 2 - fz,
    width: fz * 2,
    height: fz,
  };
  if (isTouched(event.targetTouches[0], txt)) {
    initSceneStart();
    state.init();
    player.init();
  }
}

function clickRestart(event: MouseEvent): void {
  const fz: number = 24;
  const txt: SizeAndPos = {
    x: canvasDic.scene.width / 2 - fz,
    y: canvasDic.scene.height / 2,
    width: fz * 2,
    height: fz,
  };
  if (isClicked(event, txt)) {
    initSceneStart();
    state.init();
    player.init();
  }
}

function initSceneStart(): void {
  ctxDic.scene.clearRect(0, 0, canvasDic.scene.width, canvasDic.scene.height);
  ctxDic.scene.drawImage(imgResourceDic.shoot_copyright, 0, 100, canvasDic.scene.width, canvasDic.scene.width * .51);
  drawTxtAlign('开始', 500);
}

function drawTxtAlign(txt: string, y: number): void {
  ctxDic.scene.fillStyle = '#333';
  const fz: number = 24;
  ctxDic.scene.font = `${fz}px sans-serif`;
  const x: number = canvasDic.scene.width / 2 - txt.length / 2 * fz;
  ctxDic.scene.fillText(txt, x, y);
}

main();

export {state};
