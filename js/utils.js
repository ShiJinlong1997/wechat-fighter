import { canvasDic } from './sourcedata.js';
// function isImpact(elA: SizeAndPos, elB: SizeAndPos): boolean {
//   return elA.y < elB.y + elB.height
//     && elB.y < elA.y + elA.height
//     && elA.x < elB.x + elB.width
//     && elB.x < elA.x + elA.width;
// }
function isImpact(elA, elB) {
    return !(elA.x + elA.width < elB.x
        || elB.x + elB.width < elA.x
        || elA.y + elA.height < elB.y
        || elB.y + elB.height < elA.y);
}
function isMouseEvent(event) {
    return MouseEvent.prototype.isPrototypeOf(event);
}
function isTouched(touch, el) {
    const touchSz = 24;
    return touch.clientY < el.y + el.height
        && el.y < touch.clientY + touchSz
        && touch.clientX < el.x + el.width
        && el.x < touch.clientX + touchSz;
}
function isClicked(touch, el) {
    const touchSz = 24;
    return touch.offsetY < el.y + el.height
        && el.y < touch.offsetY + touchSz
        && touch.offsetX < el.x + el.width
        && el.x < touch.offsetX + touchSz;
}
function randLeft(width) {
    return Math.floor(Math.random() * (canvasDic.main.width - width));
}
;
export { isImpact, isMouseEvent, isTouched, isClicked, randLeft, };
