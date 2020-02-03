let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let enemies = [];
let enemyMissiles = [];
let missiles = [];
let player;
let enemySize = 20;
let time = 0;
let isPaused = false;
let code;
let upCode;
let isMoving;
let shoot = [false, 0];
let score = 0;
let highScore;
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

function submitHighScore() {
  localStorage.setItem('highScore', JSON.stringify(score));
}
function getHighScore() {
  highScore = localStorage.getItem('highScore');
  if (!(highScore >= 0)) {
    highScore = 0;
  }
}

function Component(x,y,type) {
  this.x = x;
  this.y = y;
  if (type == "missile") {
    this.width = 6;
    this.height = 6;
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, this.width, this.height);
  } else {
    this.width = 20;
    this.height = 20;
    this.canFire = true;
    this.reload = 0;
    this.reloadSpeed = 333;
    this.moveSpeed = 3;
    this.power = -1;
    this.lives = 1;
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, this.width, this.height);
  };
}
function Enemy(x, y, type) {
  this.x = x;
  this.y = y;
  this.speed = Math.floor(levels[currentLevel].speed * Math.random()) + 1;
  if (type == "normal") {
    this.width = enemySize;
    this.height = enemySize;
    this.canFire = false;
    this.color = "red";
    console.log("normal");
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.width, this.height);
  } else if (type == "attack") {
    this.width = enemySize + 5;
    this.height = enemySize + 5;
    this.canFire = true;
    this.color = "orange";
    console.log("attack");
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.width, this.height);
  }
  
}

function spawnEnemy() {
  let spawnPosition = Math.floor((301 - enemySize) * Math.random());
  if (currentLevel > 9) {
    let chance = Math.floor(100 * Math.random());
    if (chance <= 49) {
      enemies.push(new Enemy(430, spawnPosition, "normal"));
    } else {
      enemies.push(new Enemy(430, spawnPosition, "attack"));
    }
  } else {
    enemies.push(new Enemy(430, spawnPosition, "normal"));
  }
};
function fire() {
  if (player.canFire) {
    missiles.push(new Component(player.x + 20, player.y + 7, "missile"));
    player.canFire = false;
  }
}
function enemyFire(enemy) {
  if (enemy.canFire) {
    enemyMissiles.push(new Component(enemy.x, enemy.y + (enemy.height/2 - 3), "missile"));
    console.log(time);
  }
}

function collisionCheck(obj1, obj2) {
  if (obj1.x < obj2.x + obj2.width) {
    if (obj1.x + obj1.width >= obj2.x) {
      if (obj1.y <= obj2.y + obj2.height && obj1.y + obj1.height >= obj2.y) {
        return true;
      }
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
  ctx.textAlign = "center";
  ctx.fillText("High Score: " + highScore, canvas.width/2, 20);
}

function displayLives() {
  ctx.font = "15px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "right";
  ctx.fillText("Lives: " + player.lives, 430, 20);
}

function displayLevel() {
  ctx.font = " 15px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("LEVEL " + (currentLevel + 1), canvas.width/2, canvas.height/2);
  if ((currentLevel + 1) % 5 == 0) {
    ctx.fillText("You have been given the " + powers[player.power].name + " power-up!", canvas.width/2, 50);
    ctx.fillText(powers[player.power].description, canvas.width/2, 70);
  }
}
function newLevel() {
  currentLevel ++;
  time = 0;
  spawnSpeed = levels[currentLevel].spawnTime;
  killCount = 0;
  if ((currentLevel + 1) % 5 == 0) {
    if (currentLevel != 4) {
      powers[player.power].clear();
    }
    let powerNum = Math.floor(powers.length * Math.random());
    player.power = powerNum;
    powers[player.power].power();
    player.lives++;
  }
}

function updateGameArea() {
  for (let i=0; i<enemies.length; i++) {
    enemies[i].x -= enemies[i].speed;
    if (time % 1000 == 0) {
      enemyFire(enemies[i]);
    }
  }
  for (let i=0; i<missiles.length; i++) {
    missiles[i].x += 5;
    if (missiles[i].x > canvas.width) {
      missiles.splice(i, 1);
      i--;
    }
  }
  for (let i=0; i<enemyMissiles.length; i++) {
    enemyMissiles[i].x -= 5;
    if (enemyMissiles[i].x < 0) {
      enemyMissiles.splice(i, 1);
      i--;
    }
  }
  if (shoot[0] == true && shoot[1] === 1) {
    fire();
    shoot[0] = false;
  }
  if (isMoving) {
    switch (code) {
      case 87:
      case 38:
        if (player.y >= player.moveSpeed) {
          player.y -= player.moveSpeed;
          break;
        }
        player.y = 0;
        break;
      case 83:
      case 40:
        if (player.y + player.height < canvas.height - player.moveSpeed) {
          player.y += player.moveSpeed;
          break;
        } 
        player.y = canvas.height - player.height;
        break;
    }
  }
  clearGameArea();
  for (let i=0; i<enemies.length; i++) {
    ctx.fillStyle = enemies[i].color;
    ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
  }
  for (let i=0; i<enemyMissiles.length; i++) {
    ctx.fillStyle = "black";
    ctx.fillRect(enemyMissiles[i].x, enemyMissiles[i].y, 6, 6);
  }
  displayLives();
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
  if (!player.canFire) {
    player.reload += 20;
  }
  if (player.reload > player.reloadSpeed) {
    player.reload = 0;
    player.canFire = true;
  }
  time += 20;
  if (time % spawnSpeed === 0) {
    spawnEnemy();
  };
  for (let i=0; i<missiles.length; i++) {
    for (let j=0; j<enemies.length; j++) {
      if (collisionCheck(missiles[i], enemies[j])) {
        console.log("test");
        missiles.splice(i, 1);
        enemies.splice(j, 1);
        i--;
        j--;
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
    player.lives--;
    enemies.splice(0, 1);
    if (player.lives == 0) {
      endGame();
    }
  }
  if (collisionCheck(player, enemyMissiles[0])) {
    player.lives--;
    enemyMissiles.splice(0, 1);
    if (player.lives == 0) {
      endGame();
    }
  }
};

function startGame() {
  canvas.focus();
  if (time === 0) {
    score = 0;
    spawnSpeed = levels[0].spawnTime;
    killCount = 0;
    currentLevel = 0;
    player = new Component(10, 140);
    spawnEnemy();
    interval = setInterval(updateGameArea, 20);
    updateScore();
    getHighScore();
    document.getElementById('start').blur();
  }
}
function endGame() {
  if (currentLevel > 3) {
    powers[player.power].clear();
  }
  clearInterval(interval);
  clearGameArea();
  time = 0;
  while (enemies.length > 0) {
    enemies.shift();
  };
  while (missiles.length > 0) {
    missiles.shift();
  };
  while (enemyMissiles.length > 0) {
    enemyMissiles.shift();
  }
  ctx.font = "25px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  if (score <= highScore) {
    ctx.fillText("You died on level " + (currentLevel + 1) + ".", canvas.width/2, canvas.height/2 - 45);
    ctx.fillText("Final Score: " + score, canvas.width/2, canvas.height/2 -15);
  } else {
    ctx.fillText("Congratulations!", canvas.width/2, canvas.height/2 - 45);
    ctx.fillText("Your new high score is " + score + "!", canvas.width/2, canvas.height/2 - 15);
    submitHighScore();
  }
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
