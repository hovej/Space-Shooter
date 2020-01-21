let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let enemies = [];
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
  } else {
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, 20, 20);
  };
}
function spawnEnemy() {
  enemies.push(new component(430, 150, "enemy"));
}

function clearGameArea() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function updateGameArea() {
  for (let i=0; i<enemies.length; i++) {
    enemies[i].x--;
  }
  if (isMoving) {
    switch (code) {
      case 87:
        player.y--;
        break;
      case 83:
        player.y++;
        break;
    }
  }
  clearGameArea();
  for (let i=0; i<enemies.length; i++) {
    ctx.fillStyle = "red";
    ctx.fillRect(enemies[i].x, enemies[i].y, 20, 20);
  }
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, 20, 20);
  spawnTime += 20;
  if (spawnTime % 3000 === 0) {
    spawnEnemy();
  };
};

function startGame() {
  player = new component(10, 225);
  spawnEnemy();
  interval = setInterval(updateGameArea, 20);
  window.addEventListener('keydown', function(event) {
    code = event.keyCode;
    isMoving = true;
  });
  window.addEventListener('keyup', function() {
    isMoving = false;
  });
}
function endGame() {
  clearInterval(interval);
  clearGameArea();
  spawnTime = 0;
}

$('#start').click(startGame);
$('#end').click(endGame);
