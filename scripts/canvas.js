let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let enemies = [];
let missiles = [];
let spawnTime = 0;
let player;
let code;
let isMoving;

function component(x,y,type) {
  this.x = x;
  this.y = y;
  if (type == "enemy") {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, 20, 20);
  } else if (type == "missile") {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 6, 6);
  } else {
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, 20, 20);
  };
}

function spawnEnemy() {
  let spawnPosition = Math.floor(131 * Math.random());
  enemies.push(new component(430, spawnPosition, "enemy"));
}
function fire() {
  missiles.push(new component(player.x + 20, player.y + 7, "missile"));
}


function clearGameArea() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function updateGameArea() {
  for (let i=0; i<enemies.length; i++) {
    enemies[i].x--;
  }
  for (let i=0; i<missiles.length; i++) {
    missiles[i].x += 5;
  }
  if (isMoving) {
    switch (code) {
      case 87:
      case 38:
        player.y -= 3;
        break;
      case 83:
      case 40:
        player.y += 3;
        break;
    }
  }
  clearGameArea();
  for (let i=0; i<enemies.length; i++) {
    ctx.fillStyle = "red";
    ctx.fillRect(enemies[i].x, enemies[i].y, 20, 20);
  }
  for (let i=0; i<missiles.length; i++) {
    ctx.fillStyle = "black";
    ctx.fillRect(missiles[i].x, missiles[i].y, 6, 6);
  }
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, 20, 20);
  spawnTime += 20;
  if (spawnTime % 3000 === 0) {
    spawnEnemy();
  };
};

function startGame() {
  if (spawnTime === 0) {
    player = new component(10, 140);
    spawnEnemy();
    interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function(event) {
      code = event.keyCode;
      isMoving = true;
      if (code == 32) {
        fire();
      }
    });
    window.addEventListener('keyup', function() {
      isMoving = false;
    });
  }
}
function endGame() {
  clearInterval(interval);
  clearGameArea();
  spawnTime = 0;
  while (enemies.length > 0) {
    enemies.shift();
  };
  while (missiles.length > 0) {
    missiles.shift();
  };
}

$('#start').click(startGame);
$('#end').click(endGame);
