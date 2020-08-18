import { canvasDic, ctxDic, imgResourceDic, multiStatusElCanvasImgSources, multiStatusElBasicInfo } from './sourcedata.js';
import { EnemyStatus } from './enums.js';
import { randLeft } from './utils.js';
import { state } from './index.js';
class Bullet {
    constructor() {
        this.width = 4;
        this.height = 8;
        this.x = 0;
        this.y = 0;
        this.isActive = false;
    }
    init(pos) {
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
class Enemy {
    constructor(lv) {
        this.lv = lv;
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.isActive = false;
        this.hp = 0;
        this.status = EnemyStatus.Normal;
        const enemyName = `enemy${this.lv}`;
        this.width = multiStatusElBasicInfo[enemyName].width;
        this.height = multiStatusElBasicInfo[enemyName].height;
    }
    init() {
        const enemyName = `enemy${this.lv}`;
        this.status = EnemyStatus.Normal;
        this.hp = multiStatusElBasicInfo[enemyName].hp;
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
            const enemyName = `enemy${this.lv}`;
            this.hp <= 0 && ++this.status;
            multiStatusElBasicInfo[enemyName].countStatuses <= this.status && this.exit();
        }
        this.isActive && this.render();
    }
    exit() {
        this.isActive = false;
    }
    render() {
        const canvasImgSource = multiStatusElCanvasImgSources[`enemy${this.lv}`][this.status];
        !!canvasImgSource && ctxDic.main.drawImage(canvasImgSource, this.x - this.width / 2, this.y - this.height / 2);
    }
}
export { Bullet, Enemy, };
