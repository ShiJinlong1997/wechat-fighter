import {Size, Pos} from './interfaces.js';
import {canvasDic} from './sourcedata.js';

type SizeAndPos = Size & Pos;

// function isImpact(elA: SizeAndPos, elB: SizeAndPos): boolean {
//   return elA.y < elB.y + elB.height
//     && elB.y < elA.y + elA.height
//     && elA.x < elB.x + elB.width
//     && elB.x < elA.x + elA.width;
// }

function isImpact(elA: SizeAndPos, elB: SizeAndPos): boolean {
  return !(
    elA.x + elA.width < elB.x
    || elB.x + elB.width < elA.x
    || elA.y + elA.height < elB.y
    || elB.y + elB.height < elA.y
  );
}

function isMouseEvent(event: MouseEvent | TouchEvent): event is MouseEvent {
  return MouseEvent.prototype.isPrototypeOf(event);
}

function isTouched(touch: MouseEvent | Touch, el: SizeAndPos): boolean {
  const touchSz: number = 24;
  return touch.clientY < el.y + el.height
    && el.y < touch.clientY + touchSz
    && touch.clientX < el.x + el.width
    && el.x < touch.clientX + touchSz;
}

function isClicked(touch: MouseEvent, el: SizeAndPos): boolean {
  const touchSz: number = 24;
  return touch.offsetY < el.y + el.height
    && el.y < touch.offsetY + touchSz
    && touch.offsetX < el.x + el.width
    && el.x < touch.offsetX + touchSz;
}

function randLeft(width: number) {
  return Math.floor(Math.random() * (canvasDic.main.width - width))
};

export {
  isImpact,
  isMouseEvent,
  isTouched,
  isClicked,
  randLeft,
};
