/* @flow */

var Game = require('./Game');
var Enemy = require('./entities/Enemy');
var math = require('./util/math');

type Coordinates = {
  x: number;
  y: number;
};

var max = (a, b) => a > b ? a : b;

class EnemySpawner {
  _curTimeoutId: number;
  _numSpawned: number;

  constructor(game: Game) {
    this.game = game;
    this._numSpawned = 0;
  }

  start() {
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
    // TODO: make this a curve of some sort based on numSpawned so far

    return 1000;
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
