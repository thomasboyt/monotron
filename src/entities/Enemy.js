/* @flow */

var Coquette = require('coquette');
var math = require('../util/math');
var Game = require('../Game');

var Entity = require('./Entity');
var Bullet = require('./Bullet');
var Powerup = require('./Powerup');
var Explosion = require('./effects/Explosion');

type Coordinates = {
  x: number;
  y: number;
};

type Options = {
  center: Coordinates;
};

var lastPowerupTime = Date.now();

class Enemy extends Entity {

  game: Game;
  player: Entity;  // TODO: This isn't defined :|

  init(game: Game, settings: Options) {
    this.game = game;
    this.player = game.player;

    this.size = { x:15, y:15 };
    this.center = settings.center;
  }

  update(dt: number) {
    // Enemies attempt to get closer to the player

    var spd = dt/100 * this.game.config.enemySpeed;

    // Calculate the angle between enemy and player
    var player = this.player;
    var angle = Math.atan2(player.center.y - this.center.y, player.center.x - this.center.x);

    // Move at angle
    var vec = math.calcVector(spd, angle);
    this.center.x += vec.x;
    this.center.y += vec.y;
  }

  draw(ctx: any) {
    ctx.strokeStyle = '#fff';

    ctx.strokeRect(
      this.center.x - this.size.x / 2, this.center.y - this.size.y / 2,
      this.size.x, this.size.y
    );
  }

  destroy(mute?: boolean) {
    if (!mute) {
      this.game.audioManager.play('player_explosion');
    }

    new Explosion(this.game, {
      creator: this,
      vanishMs: 500
    });

    this.game.c.entities.destroy(this);

    this.game.score += 1;

    this.maybeCreatePowerup();
  }

  maybeCreatePowerup() {
    // Ensure powerup will not spawn in a place the player cannot reach
    var buf = this.game.config.edgeBuffer;
    var hw = this.size.x / 2, hh = this.size.y / 2;

    if (this.center.x - hw < buf ||
        this.center.y - hh < buf ||
        this.center.x + hw > this.game.width - buf ||
        this.center.y + hh > this.game.height - buf) {
      return;
    }

    var now = Date.now();
    if (now - lastPowerupTime < this.game.config.powerupSpawnThrottleMs) {
      return;
    }

    if (Math.random() < this.game.config.powerupProbability) {
      lastPowerupTime = now;

      new Powerup(this.game, {
        type: 'bomb',
        center: this.center
      });
    }
  }

  collision(other: Entity) {
    if (other instanceof Bullet) {
      if (other.creator === this.player) {
        this.destroy();
        this.game.c.entities.destroy(other);
      }
    }
  }
}

module.exports = Enemy;
