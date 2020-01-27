let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let enemies = [];
let missiles = [];
let player;
let time = 0;
let isPaused = false;
let code;
let upCode;
let isMoving;
let shoot = [false, 0];
let score;
let spawnSpeed;
let killCount = 0;
let currentLevel = 0;
$(document).ready(canvas.focus());

window.addEventListener('keyup', function(event) {
  upCode = event.keyCode;
  if (upCode === code) {
      isMoving = false;
  }
  if (upCode === 32) {
    shoot[1] = 0;
  }
});
window.addEventListener('keydown', function(event) {
  if (event.keyCode == 38 ||
      event.keyCode == 40 ||
      event.keyCode == 83 ||
      event.keyCode == 87) {
    code = event.keyCode;
    isMoving = true;
  }
  switch (event.keyCode) {
    case 32:
      shoot[0] = true;
      shoot[1]++;
      break;
    case 13:
      startGame();
      break;
    case 80:
      pauseGame();
      break;
  }
});

function component(x,y,type) {
  this.x = x;
  this.y = y;
  if (type == "enemy") {
    this.width = 20;
    this.height = 20;
    this.speed = Math.floor(levels[currentLevel].speed * Math.random()) + 1;
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, this.width, this.height);
  } else if (type == "missile") {
    this.width = 6;
    this.height = 6;
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, this.width, this.height);
  } else {
    this.width = 20;
    this.height = 20;
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, this.width, this.height);
  };
}

function spawnEnemy() {
  let spawnPosition = Math.floor(281 * Math.random());
  enemies.push(new component(430, spawnPosition, "enemy"));
};
function fire() {
  missiles.push(new component(player.x + 20, player.y + 7, "missile"));
}

function collisionCheck(obj1, obj2) {
  if (obj1.x < obj2.x + obj2.width && obj1.x + obj1.width >= obj2.x) {
    if (obj1.y <= obj2.y + obj2.height && obj1.y + obj1.height >= obj2.y) {
      return true;
    }
  }
  return false;
}

function clearGameArea() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function updateScore() {
  ctx.font = "15px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "start";
  ctx.fillText("Level: " + (currentLevel + 1) + " - Score: " + score, 20, 20);
}

function displayLevel() {
  ctx.font = "Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("LEVEL " + (currentLevel + 1), canvas.width/2, canvas.height/2);
}
function newLevel() {
  currentLevel ++;
  time = 0;
  spawnSpeed = levels[currentLevel].spawnTime;
  killCount = 0;
}

function updateGameArea() {
  for (let i=0; i<enemies.length; i++) {
    enemies[i].x -= enemies[i].speed;
  }
  for (let i=0; i<missiles.length; i++) {
    missiles[i].x += 5;
    if (missiles[i].x > canvas.width) {
      missiles.splice(i, 1);
    };
  }
  if (shoot[0] == true && shoot[1] === 1) {
    fire();
    shoot[0] = false;
  }
  if (isMoving) {
    switch (code) {
      case 87:
      case 38:
        if (player.y >= 3) {
          player.y -= 3;
          break;
        }
        player.y = 0;
        break;
      case 83:
      case 40:
        if (player.y + player.height < canvas.height - 3) {
          player.y += 3;
          break;
        } 
        player.y = canvas.height - player.height;
        break;
    }
  }
  clearGameArea();
  for (let i=0; i<enemies.length; i++) {
    ctx.fillStyle = "red";
    ctx.fillRect(enemies[i].x, enemies[i].y, 20, 20);
  }
  updateScore();
  if (time < 2000) {
    displayLevel();
  }
  for (let i=0; i<missiles.length; i++) {
    ctx.fillStyle = "black";
    ctx.fillRect(missiles[i].x, missiles[i].y, 6, 6);
  }
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, 20, 20);
  time += 20;
  if (time % spawnSpeed === 0) {
    spawnEnemy();
  };
  for (let i=0; i<missiles.length; i++) {
    for (let j=0; j<enemies.length; j++) {
      if (collisionCheck(missiles[i], enemies[j])) {
        missiles.splice(i, 1);
        enemies.splice(j, 1);
        score += 50;
        killCount++;
        if (levels[currentLevel].hasOwnProperty('killReq')) {
          if (killCount === levels[currentLevel].killReq) {
            newLevel();
          }
        }
      }
    }
  }
  if (collisionCheck(player, enemies[0]) || enemies[0].x <= 0) {
      endGame();
  }
};

function startGame() {
  canvas.focus();
  if (time === 0) {
    score = 0;
    spawnSpeed = levels[0].spawnTime;
    killCount = 0;
    currentLevel = 0;
    player = new component(10, 140);
    spawnEnemy();
    interval = setInterval(updateGameArea, 20);
    updateScore();
    document.getElementById('start').blur();
  }
}
function endGame() {
  clearInterval(interval);
  clearGameArea();
  time = 0;
  while (enemies.length > 0) {
    enemies.shift();
  };
  while (missiles.length > 0) {
    missiles.shift();
  };
  ctx.font = "25px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("You died on level " + (currentLevel + 1) + ".", canvas.width/2, canvas.height/2 - 45);
  ctx.fillText("Final Score: " + score, canvas.width/2, canvas.height/2 -15);
  ctx.font = "15px Arial";
  ctx.fillText("Press Start or hit Enter to try again", canvas.width/2, canvas.height/2 + 15);
  document.getElementById('end').blur();
}
function pauseGame() {
  if (!isPaused) {
    clearInterval(interval);
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width/2, canvas.height/2);
    isPaused = true;
  } else if (isPaused) {
    interval = setInterval(updateGameArea, 20);
    isPaused = false;
  }
}

$('#start').click(startGame);
$('#end').click(endGame);
