/* @flow */

var config = {
  playerSpeed: 15,
  enemySpeed: 5,
  bulletSpeed: 35,

  // Minimum time between player shots
  fireThrottleMs: 200,

  // Minimum time between powerups
  powerupSpawnThrottleMs: 15000,

  // Probability that a powerup will spawn
  powerupProbability: 0.1
};

module.exports = config;
