// wechat_fighter.js -- 初始化场景、创建敌机同时敌机开火、移动敌机子弹、移动敌机、玩家开火、移动玩家子弹、玩家移动和检测碰撞。
const {floor, random} = Math;
let scene = document.getElementById('scene');   // 获取游戏场景
let sceneWidth = scene.offsetWidth;             // 游戏场景宽度
let sceneHeight = scene.offsetHeight;           // 游戏场景高度
let player = document.getElementById('player'); // 获取玩家
playerWidth = player.offsetWidth;               // 玩家宽度
playerHeight = player.offsetHeight;             // 玩家高度
let score = document.getElementById('score');   // 获取分数记录
let killNum = 0;              // 击杀敌机数
let mark = 0;                 // 倍数决定敌机等级
let allEnemyInfo = {};        // 存储全部敌机信息
let timerCreateEnemy = null;  // 敌机出现定时器
let timerMoveEnemyBullet = null;  // 移动敌机子弹定时器
let timerMoveEnemy = null;        // 移动敌机定时器
let timerPlayerShoot = null;      // 玩家开火定时器
let timerMovePlayerBullet = null; // 移动玩家子弹定时器
let timerImpact = null;           // 检测碰撞定时器

/*
gameStart()开始游戏前的封面
点击“开始游戏”r后依次调用以下函数：
  初始化场景
  创建敌机
  移动敌机子弹
  移动敌机
  玩家开火
  移动玩家子弹
  检测碰撞
  场景添加鼠标移动事件控制玩家移动
  文档添加鼠标按下事件控制玩家移动
 */
function gameStart() {
  let welcome = document.getElementById('welcome');
  welcome.style.opacity = 0;
  welcome.addEventListener('transitionend', () => {
    welcome.style.display = 'none';
  });
  initScene();
  createEnemy();
  moveEnemyBullet();
  moveEnemy();
  playerShoot();
  movePlayerBullet();
  impact();
  scene.addEventListener('mousemove', movePlayerOfMouse, true);
  document.addEventListener('keydown', movePlayerOfKeyboard);
}

/*
initScene()初始化场景
显示玩家的飞机并给玩家的飞机添加动画结束后事件，在爆炸后被移除。
显示左上角击杀记录，初始值0。
 */
function initScene() {
  player.style.display = 'block';
  player.style.top = `${sceneHeight - playerHeight}px`;
  player.style.left = `${sceneWidth/2 - playerWidth/2}px`;
  player.addEventListener('animationend', () => { scene.removeChild(player); });
  score.style.display = 'block';
  score.innerHTML = '击杀0';
}

/*
createEnemy()创建敌机和敌机出现的同时发射一发子弹。
每隔1000ms调用一次此函数，每次都让mark+1，
默认创建小型敌机，若mark是10的倍数则创建大型敌机。
className决定了它们的样式，hp决定它们的血量值。
allEnemyInfo这个对象记录全部敌机的信息，在移动敌机和检测碰撞时用得上。
allEnemyInfo对象的所有键值对都是敌机元素的id和敌机的血量值，
敌机元素的left就是它的id，用while反复随机生成确保唯一。
敌机出现后在它下方加一发子弹。
 */
function createEnemy() {
  ++mark;
  let className = 'enemy1';
  let hp = 1;
  if (0 == mark % 10) {
    className = 'enemy2';
    hp = 10;
  }
  let ele = document.createElement('div');
  ele.setAttribute('class', 'enemy');
  ele.classList.add(className);
  scene.appendChild(ele);
  let left = randLeft(ele);
  while (allEnemyInfo[`${left}`]) {
    left = randLeft(ele);
  }
  ele.setAttribute('id', `${left}`);
  ele.style.left = `${left}px`;
  ele.addEventListener('animationend', () => {scene.removeChild(ele); });
  allEnemyInfo[`${left}`] = hp;
  shoot(ele);
  timerCreateEnemy = setTimeout(createEnemy, 1000);
}

/*
randLeft(ele)随机返回0~场景宽度减去敌机宽度，用于敌机的left样式。
parameter:
  ele -- 敌机元素
 */
function randLeft(ele) {
  return floor(random() * (sceneWidth - ele.offsetWidth));
}

/*
shoot(ele)提取出敌机和玩家共同开火的代码部分封装成函数
parameter:
  ele -- 敌机元素或玩家
 */
function shoot(ele) {
  let bullet = document.createElement('div');
  bullet.setAttribute('class', 'bullet');
  scene.appendChild(bullet);
  if ('player' == ele.getAttribute('id')) {
    bullet.classList.add('bullet1');
    bullet.style.top = `${ele.offsetTop - bullet.offsetHeight}px`;
  } else {
    bullet.classList.add('bullet2');
    bullet.style.top = `${ele.offsetTop + ele.offsetHeight}px`;
  }
  bullet.style.left = `${ele.offsetLeft + ele.offsetWidth/2 - bullet.offsetWidth/2}px`;
}

/* moveEnemyBullet()移动敌机子弹，每隔20ms调用一次此函数。 */
function moveEnemyBullet() {
  let allBullet2 = document.getElementsByClassName('bullet2');
  for (let i = 0; i < allBullet2.length; ++i) {
    allBullet2[i].style.top = `${allBullet2[i].offsetTop + 6}px`;
    if (sceneHeight <= allBullet2[i].offsetTop) {
      scene.removeChild(allBullet2[i]);
    }
  }
  timerMoveEnemyBullet = setTimeout(moveEnemyBullet, 20);
}

/*
moveEnemy()移动敌机，每隔20ms调用一次此函数。
若有敌机血量值是0则不管它，让它呆着播放完爆炸动画场景会移除这个敌机子元素。
若敌机移出场景外则场景移除这个敌机子元素，记录敌机信息的对象里也删除此属性。
 */
function moveEnemy() {
  let allEnemy = document.getElementsByClassName('enemy');
  for (let i = 0; i < allEnemy.length; ++i) {
    let enemyId = allEnemy[i].getAttribute('id');
    if (0 < allEnemyInfo[enemyId]) {
      allEnemy[i].style.top = `${allEnemy[i].offsetTop + 4}px`;
      if (sceneHeight <= allEnemy[i].offsetTop) {
        delete allEnemy[i].id;
        scene.removeChild(allEnemy[i]);
      }
    }
  }
  timerMoveEnemy = setTimeout(moveEnemy, 20);
}

/* playerShoot()玩家开火，每隔100ms调用一次此函数。 */
function playerShoot() {
  shoot(player);
  timerPlayerShoot = setTimeout(playerShoot, 100);
}

/* movePlayerBullet()移动玩家子弹，每隔10ms调用一次此函数。 */
function movePlayerBullet() {
  let allBullet1 = document.getElementsByClassName('bullet1');
  for (let i = 0; i < allBullet1.length; ++i) {
    allBullet1[i].style.top = `${allBullet1[i].offsetTop - 6}px`;
    if (allBullet1[i].offsetTop <= 0) {
      scene.removeChild(allBullet1[i]);
    }
  }
  timerMovePlayerBullet = setTimeout(movePlayerBullet, 10);
}

/*
impact()检测敌机、玩家和双方子弹和碰撞情况，持续调用此函数。
检测敌机和玩家子弹碰撞
  若碰撞到了则移除此子弹，此敌机的血量-1，
    若此敌机死亡则增加击杀数；
    播放敌机爆炸动画并移除此敌机的信息记录。

检测敌机和玩家碰撞
  若碰撞则玩家死亡，游戏结束。
  清空所有定时器，播放玩家和被撞敌机的爆炸动画并删除此敌机的信息记录。

检测敌机子弹和玩家碰撞
  若碰撞则玩家死亡，游戏结束善后步骤同上。
 */
function impact() {
  let allEnemy = document.getElementsByClassName('enemy');
  let allBullet1 = document.getElementsByClassName('bullet1');
  let allBullet2 = document.getElementsByClassName('bullet2');
  for (let enemy = 0; enemy < allEnemy.length; ++enemy) {
    let enemyId = allEnemy[enemy].getAttribute('id');
    if (0 < allEnemyInfo[enemyId]) {
      for (let bullet1 = 0; bullet1 < allBullet1.length; ++bullet1) {
        if (allEnemy[enemy].offsetTop < allBullet1[bullet1].offsetTop &&
            allBullet1[bullet1].offsetTop < allEnemy[enemy].offsetTop + allEnemy[enemy].offsetHeight &&
            allEnemy[enemy].offsetLeft < allBullet1[bullet1].offsetLeft &&
            allBullet1[bullet1].offsetLeft < allEnemy[enemy].offsetLeft + allEnemy[enemy].offsetWidth) {
          scene.removeChild(allBullet1[bullet1]);
          --allEnemyInfo[enemyId];
          if (allEnemyInfo[enemyId] <= 0) {
            ++killNum;
            score.innerHTML = `击杀${killNum}`;
          }
        }
      }
    } else {
      selectEnemyAnimate(allEnemy[enemy]);
      delete allEnemyInfo[enemyId];
    }

    // 检测敌机和玩家碰撞
    if (allEnemy[enemy].offsetTop < player.offsetTop + playerHeight &&
        player.offsetTop < allEnemy[enemy].offsetTop + allEnemy[enemy].offsetHeight &&
        allEnemy[enemy].offsetLeft < player.offsetLeft + playerWidth &&
        player.offsetLeft < allEnemy[enemy].offsetLeft + allEnemy[enemy].offsetWidth) {
      clearAllTimer();
      player.style.animation = `wasted 1s forwards`;
      allEnemyInfo[enemyId] = 0;
      selectEnemyAnimate(allEnemy[enemy]);
      delete allEnemyInfo[enemyId];
      gameoverPanel('你撞机了');
    }
  }

  for (let bullet2 = 0; bullet2 < allBullet2.length; ++bullet2) {
    if (player.offsetTop < allBullet2[bullet2].offsetTop &&
        allBullet2[bullet2].offsetTop < player.offsetTop + player.offsetHeight &&
        player.offsetLeft < allBullet2[bullet2].offsetLeft &&
        allBullet2[bullet2].offsetLeft < player.offsetLeft + player.offsetWidth) {
      scene.removeChild(allBullet2[bullet2]);
      clearAllTimer();
      player.style.animation = `wasted 1s forwards`;
      gameoverPanel('你中弹了');
    }
  }
  timerImpact = setTimeout(impact, 1);
}

/*
selectEnemyAnimate(enemy)依敌机类型选择爆炸动画。
parameter:
  enemy -- 敌机元素
*/
function selectEnemyAnimate(enemy) {
  enemy.style.animation = enemy.classList.contains('enemy1') ?
                          `enemy1down 1s forwards`:
                          `enemy2down 1s forwards`;
}

/* clearAllTimer()清空所有定时器 */
function clearAllTimer() {
  clearTimeout(timerCreateEnemy);
  timerCreateEnemy = null
  clearTimeout(timerMoveEnemyBullet);
  timerMoveEnemyBullet = null
  clearTimeout(timerMoveEnemy);
  timerMoveEnemy = null
  clearTimeout(timerPlayerShoot);
  timerPlayerShoot = null
  clearTimeout(timerMovePlayerBullet);
  timerMovePlayerBullet = null
  clearTimeout(timerImpact);
  timerImpact = null;
}

function gameoverPanel(cause) {
  score.style.display = null;
  document.getElementById('cause_of_death').innerHTML = cause;
  document.getElementById('final_score').innerHTML = `击杀敌机${killNum}架`;
  document.getElementById('gameover').style.display = 'block';
  setTimeout(`location.reload();`, 10 * 1000);
}

/*
movePlayerOfMouse(event)用鼠标移动玩家飞机。
飞机的位置是鼠标在场景中的左距减去飞机宽度的一半，顶距减去飞机高度的一半。
鼠标在场景的位置若用offset会判断成鼠标在玩家飞机内的位置，造成玩家飞机闪烁。
∴offset应该被替换成鼠标在文档中的距离减去场景在文档中的距离。
 */
function movePlayerOfMouse(event) {
  event = event || window.event;
  let playerOY = player.offsetHeight / 2;
  let playerOX = player.offsetWidth / 2;
  player.style.top = `${event.clientY - scene.offsetTop - playerOY}px`;
  player.style.left = `${event.clientX - scene.offsetLeft - playerOX}px`;
}

/* movePlayerOfKeyboard(event)e用键盘方向键移动玩家飞机 */
function movePlayerOfKeyboard(event) {
  console.log(event.type);
  event = event || window.event;
  let keyPush = event.keyCode;
  switch (keyPush) {
    case 37:
      player.style.left = `${player.offsetLeft - 10}px`;
      break;
    case 38:
      player.style.top = `${player.offsetTop - 10}px`;
      break;
    case 39:
      player.style.left = `${player.offsetLeft + 10}px`;
      break;
    case 40:
      player.style.top = `${player.offsetTop + 10}px`;
      break;
    default:
      break;
  }

  if (player.offsetTop <= 0) {
    player.style.top = 0;
  }
  if (scene.offsetHeight - player.offsetHeight <= player.offsetTop) {
    player.style.top = `${scene.offsetHeight - player.offsetHeight}px`;
  }
  if (player.offsetLeft <= 0) {
    player.style.left = 0;
  }
  if (scene.offsetWidth - player.offsetWidth <= player.offsetLeft) {
    player.style.left = `${scene.offsetWidth - player.offsetWidth}px`;
  }
}
