enum Scene {
  Start,
  Playing,
  End,
};

enum PlayerStatus {
  Normal1,
  Normal2,
  Wasted,
};

enum EnemyStatus {
  Normal,
  Wasted,
};

enum PauseBtnStatus {
  PauseNormal,
  PausePressed,
  ResumeNormal,
  ResumePressed,
};

export {
  Scene,
  PlayerStatus,
  EnemyStatus,
  PauseBtnStatus,
};
