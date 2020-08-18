import { Size } from "./interfaces";

type CanvasId = 'bg' | 'ui' | 'scene' | 'main';
type EnemyName = 'enemy1' | 'enemy2';
type MultiStatusElName = 'player' | EnemyName | 'pause';
type ImgResourceName = 'bg' | 'bullet' | 'enemy1' | 'enemy2' | 'pause' | 'player' | 'shoot_copyright';

interface MultiStatusElBasicInfo {
  countStatuses: number;
  width: number;
  height: number;
}

interface FighterBasicInfo extends MultiStatusElBasicInfo {
  hp: number;
}

/**
 * bg: 背景图
 * ui 左上击杀数 右上暂停按钮
 * scene: 游戏开始或结束时显示切换场景的文字按钮
 * main: bullets enemies player 特定场景出现的元素，如游戏开始时的logo和"开始"
 */
const canvasDic: Record<CanvasId, HTMLCanvasElement> = {
  bg: document.getElementById('bg') as HTMLCanvasElement,
  ui: document.getElementById('ui') as HTMLCanvasElement,
  scene: document.getElementById('scene') as HTMLCanvasElement,
  main: document.getElementById('main') as HTMLCanvasElement,
};

const ctxDic: Record<CanvasId, CanvasRenderingContext2D> = {
  bg: canvasDic.bg.getContext('2d') as CanvasRenderingContext2D,
  ui: canvasDic.ui.getContext('2d') as CanvasRenderingContext2D,
  scene: canvasDic.scene.getContext('2d') as CanvasRenderingContext2D,
  main: canvasDic.main.getContext('2d') as CanvasRenderingContext2D,
};

const multiStatusElBasicInfo: Record<MultiStatusElName, MultiStatusElBasicInfo | FighterBasicInfo> = {
  pause: {
    countStatuses: 4,
    width: 60,
    height: 45,
  },
  player: {
    countStatuses: 6,
    width: 68,
    height: 84,
  },
  enemy1: {
    hp: 1,
    countStatuses: 5,
    width: 48,
    height: 36,
  },
  enemy2: {
    hp: 10,
    countStatuses: 5,
    width: 68,
    height: 94,
  },
};

const imgResourceSrcDic: Record<ImgResourceName, string> = {
  bg: 'img/background.png',
  bullet: 'img/bullet.png',
  enemy1: 'img/enemy1.png',
  enemy2: 'img/enemy2.png',
  pause: 'img/pause.png',
  player: 'img/player.png',
  shoot_copyright: 'img/shoot_copyright.png',
};

const imgResourceDic: Record<ImgResourceName, HTMLImageElement> = {
  bg: new Image(),
  bullet: new Image(),
  enemy1: new Image(),
  enemy2: new Image(),
  pause: new Image(),
  player: new Image(),
  shoot_copyright: new Image(),
};

/** 从精灵图中截取元素各状态对应画面 */
const canvasImgSources: {[prop: string]: HTMLCanvasElement} = {
  bg: document.createElement('canvas'),
};

const multiStatusElCanvasImgSources: Record<MultiStatusElName, CanvasImageSource[]> = {
  pause: [],
  player: [],
  enemy1: [],
  enemy2: [],
};

const maxCanvasSz: Size = {
  width: 400,
  height: 750,
};

export {
  EnemyName,
  FighterBasicInfo,
  MultiStatusElName,
  maxCanvasSz,
  canvasDic,
  ctxDic,
  multiStatusElBasicInfo,
  ImgResourceName,
  imgResourceSrcDic,
  imgResourceDic,
  canvasImgSources,
  multiStatusElCanvasImgSources,
  MultiStatusElBasicInfo,
};
