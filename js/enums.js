var Scene;
(function (Scene) {
    Scene[Scene["Start"] = 0] = "Start";
    Scene[Scene["Playing"] = 1] = "Playing";
    Scene[Scene["End"] = 2] = "End";
})(Scene || (Scene = {}));
;
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["Normal1"] = 0] = "Normal1";
    PlayerStatus[PlayerStatus["Normal2"] = 1] = "Normal2";
    PlayerStatus[PlayerStatus["Wasted"] = 2] = "Wasted";
})(PlayerStatus || (PlayerStatus = {}));
;
var EnemyStatus;
(function (EnemyStatus) {
    EnemyStatus[EnemyStatus["Normal"] = 0] = "Normal";
    EnemyStatus[EnemyStatus["Wasted"] = 1] = "Wasted";
})(EnemyStatus || (EnemyStatus = {}));
;
var PauseBtnStatus;
(function (PauseBtnStatus) {
    PauseBtnStatus[PauseBtnStatus["PauseNormal"] = 0] = "PauseNormal";
    PauseBtnStatus[PauseBtnStatus["PausePressed"] = 1] = "PausePressed";
    PauseBtnStatus[PauseBtnStatus["ResumeNormal"] = 2] = "ResumeNormal";
    PauseBtnStatus[PauseBtnStatus["ResumePressed"] = 3] = "ResumePressed";
})(PauseBtnStatus || (PauseBtnStatus = {}));
;
export { Scene, PlayerStatus, EnemyStatus, PauseBtnStatus, };
