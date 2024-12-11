import { PlayerStatus, EnemyStatus } from "./enums";

/** 游戏中元素的尺寸 */
interface Size {
  width: number;
  height: number;
}

/** 游戏中元素的坐标 */
interface Pos {
  x: number;
  y: number;
}

/** 游戏中的元素 */
interface El extends Size, Pos {
  /** 是否出现在场景中 */
  isActive: boolean;
  /** 移动位置 */
  move: (pos?: Pos) => void;
  exit?: () => void;
}

/** 战斗机 */
interface Fighter extends El {
  /** 状态对应图片下标 */
  status: PlayerStatus | EnemyStatus;
  /** 玩家不需要hp */
  hp?: number;
  init: () => void;
  /** 更新图片下标 */
  update: () => void;
}

/** 玩家 */
interface Player extends Fighter {
  score: number;
  toggleNormalStatus: () => void;
  shoot: () => void;
  render: () => void;
}

export {
  Size,
  Pos,
  El,
  Fighter,
  Player,
};
