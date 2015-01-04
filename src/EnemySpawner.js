/* @flow */

var Game = require('./Game');
var Enemy = require('./entities/Enemy');
var Timer = require('./util/Timer');
var math = require('./util/math');

type Coordinates = {
  x: number;
  y: number;
};

var max = (a, b) => a > b ? a : b;

class EnemySpawner {
  _curTimeoutId: number;
  _numSpawned: number;
  timer: Timer;

  constructor(game: Game) {
    this.game = game;
    this._numSpawned = 0;
  }

  start() {
    this.timer = new Timer();
    this._spawnLoop();
  }

  stop() {
    clearTimeout(this._curTimeoutId);
  }

  _spawnLoop() {
    var ms = this.getSpawnDelay();

    this._curTimeoutId = setTimeout(() => {
      var coords = this._getNextCoordinates();

      new Enemy(this.game, {
        center: coords
      });

      this._numSpawned += 1;

      this._spawnLoop();
    }, ms);
  }

  getSpawnDelay(): number {
    // The difficulty curve is defined by a few points:
    // 1. The starting spawn delay
    // 2. The final spawn delay
    // 3. The time it takes to drop from the starting delay to the final delay

    var elapsed = this.timer.elapsed();
    var amntToDrop = this.game.config.initialSpawnDelay - this.game.config.minSpawnDelay;
    var amntDropped = elapsed * (amntToDrop / this.game.config.timeToFinalSpawnDelayMs);
    var delay = this.game.config.initialSpawnDelay - amntDropped;

    delay = max(delay, this.game.config.minSpawnDelay);

    return delay;
  }

  _getNextCoordinates(): Coordinates {
    // TODO: figure out how to get fancy with this
    var side = math.randInt(0, 3);

    var x = 0, y = 0;

    if (side === 0) {
      // left
      x = -20;
      y = math.randInt(0, this.game.height);
    } else if (side === 1) {
      // top
      x = math.randInt(0, this.game.width);
      y = -20;
    } else if (side === 2) {
      // bottom
      x = math.randInt(0, this.game.width);
      y = this.game.height + 20;
    } else if (side === 3) {
      // right
      x = this.game.width + 20;
      y = math.randInt(0, this.game.height);
    }

    return { x: x, y: y };
  }
}

module.exports = EnemySpawner;
