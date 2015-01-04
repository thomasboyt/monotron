/* @flow */

var config = {
  playerSpeed: 15,
  enemySpeed: 5,
  bulletSpeed: 35,

  // Number of bombs started with
  numBombs: 1,

  // A buffer between the playing zone (where the player can move) and the edge of the screen
  edgeBuffer: 10,

  // Minimum time between player shots
  fireThrottleMs: 200,

  // Minimum time between powerups
  powerupSpawnThrottleMs: 15000,

  // Probability that a powerup will spawn
  powerupProbability: 0.1,

  // See EnemySpawner.getSpawnDelay()
  initialSpawnDelay: 1000,
  minSpawnDelay: 500,
  timeToFinalSpawnDelayMs: 90 * 1000,

  startDelayMs: 5000
};

module.exports = config;
