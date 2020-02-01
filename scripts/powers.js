var powers = [
  {
  name: "Rapid Fire",
  description: "Shoot as fast as you want!",
  power: function rapidFire() {
    player.reloadSpeed = 0;
  },
  clear: function clearRapidFire() {
    player.reloadSpeed = 333;
  }
  },
  {
  name: "Super Speed",
  description: "Move twice as fast!",
  power: function speedUp() {
    player.moveSpeed = 6;
  },
  clear: function clearSuperSpeed() {
    player.moveSpeed = 3;
  }
  },
  {
  name: "Bigger Enemies",
  description: "Your enemies are now bigger!",
  power: function bigEnemies() {
    enemySize = 30;
  },
  clear: function clearBigEnemies() {
    enemySize = 20;
  }
  }
];
