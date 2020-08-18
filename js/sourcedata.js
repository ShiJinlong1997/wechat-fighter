/**
 * bg: 背景图
 * ui 左上击杀数 右上暂停按钮
 * scene: 游戏开始或结束时显示切换场景的文字按钮
 * main: bullets enemies player 特定场景出现的元素，如游戏开始时的logo和"开始"
 */
const canvasDic = {
    bg: document.getElementById('bg'),
    ui: document.getElementById('ui'),
    scene: document.getElementById('scene'),
    main: document.getElementById('main'),
};
const ctxDic = {
    bg: canvasDic.bg.getContext('2d'),
    ui: canvasDic.ui.getContext('2d'),
    scene: canvasDic.scene.getContext('2d'),
    main: canvasDic.main.getContext('2d'),
};
const multiStatusElBasicInfo = {
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
const imgResourceSrcDic = {
    bg: 'img/background.png',
    bullet: 'img/bullet.png',
    enemy1: 'img/enemy1.png',
    enemy2: 'img/enemy2.png',
    pause: 'img/pause.png',
    player: 'img/player.png',
    shoot_copyright: 'img/shoot_copyright.png',
};
const imgResourceDic = {
    bg: new Image(),
    bullet: new Image(),
    enemy1: new Image(),
    enemy2: new Image(),
    pause: new Image(),
    player: new Image(),
    shoot_copyright: new Image(),
};
/** 从精灵图中截取元素各状态对应画面 */
const canvasImgSources = {
    bg: document.createElement('canvas'),
};
const multiStatusElCanvasImgSources = {
    pause: [],
    player: [],
    enemy1: [],
    enemy2: [],
};
const maxCanvasSz = {
    width: 400,
    height: 750,
};
export { maxCanvasSz, canvasDic, ctxDic, multiStatusElBasicInfo, imgResourceSrcDic, imgResourceDic, canvasImgSources, multiStatusElCanvasImgSources, };
