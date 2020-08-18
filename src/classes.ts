import {Size, Pos, El, Fighter} from './interfaces.js';
import {EnemyName, FighterBasicInfo, canvasDic, ctxDic, imgResourceDic, multiStatusElCanvasImgSources, multiStatusElBasicInfo} from './sourcedata.js';
import {EnemyStatus} from './enums.js';
import {randLeft} from './utils.js';
import {state} from './index.js';

class Bullet implements El {
  public width: number = 4;
  public height: number = 8;
  public x: number = 0;
  public y: number = 0;
  public isActive: boolean = false;

  init(pos: Pos) {
    this.x = pos.x;
    this.y = pos.y;
    this.isActive = true;
  }
  move() {
    this.y -= this.height;
    this.y < 0 ? this.exit() : this.render();
  }
  exit() {
    this.isActive = false;
  }
  render() {
    ctxDic.main.drawImage(imgResourceDic.bullet, this.x - this.width / 2, this.y - this.height / 2);
  }
}

type EnemyLv = 1 | 2;

class Enemy implements Fighter {
  public width: number = 0;
  public height: number = 0;
  public x: number = 0;
  public y: number = 0;
  public isActive: boolean = false;
  public hp: number = 0;
  public status: number = EnemyStatus.Normal;

  constructor(public lv: EnemyLv) {
    const enemyName = `enemy${this.lv}` as EnemyName;
    this.width = multiStatusElBasicInfo[enemyName].width;
    this.height = multiStatusElBasicInfo[enemyName].height;
  }
  init() {
    const enemyName = `enemy${this.lv}` as EnemyName;
    this.status = EnemyStatus.Normal;
    this.hp = (multiStatusElBasicInfo[enemyName] as FighterBasicInfo).hp;
    this.x = randLeft(this.width) + this.width / 2;
    this.y = this.height / 2;
    this.isActive = true;
  }
  move() {
    0 < this.hp && (this.y += 4);
    canvasDic.main.height < this.y && this.exit();
    this.update();
  }
  update() {
    if (0 == state.time % 10) {
      const enemyName = `enemy${this.lv}` as EnemyName;
      this.hp <= 0 && ++this.status;
      multiStatusElBasicInfo[enemyName].countStatuses <= this.status && this.exit();
    }
    this.isActive && this.render();
  }
  exit() {
    this.isActive = false;
  }
  render() {
    const canvasImgSource: CanvasImageSource = multiStatusElCanvasImgSources[`enemy${this.lv}` as EnemyName][this.status];
    !!canvasImgSource && ctxDic.main.drawImage(canvasImgSource, this.x - this.width / 2, this.y - this.height / 2);
  }
}

export {
  Bullet,
  Enemy,
};
