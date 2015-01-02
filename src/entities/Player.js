/* @flow */

var Coquette = require('coquette');
var Game = require('../Game');

var Entity = require('./Entity');
var Bullet = require('./Bullet');
var Enemy = require('./Enemy');
var Explosion = require('./Explosion');

var PLAYER_SPEED = 15;
var THROTTLE_MS = 200;

type Coordinates = {
  x: number;
  y: number;
};

type Options = {
  center: Coordinates;
};

class Player extends Entity {

  c: Coquette;
  game: Game;
  lastShot: number;

  init(game: Game, settings: Options) {
    this.c = game.c;
    this.game = game;

    this.size = { x:15, y:15 };
    this.center = settings.center;

    this.lastShot = 0;
  }

  update(dt: number) {
    var spd = PLAYER_SPEED/100 * dt;

    // Movement
    if (this.c.inputter.isDown(this.c.inputter.W)) {
      this.center.y -= spd;
    } else if (this.c.inputter.isDown(this.c.inputter.S)) {
      this.center.y += spd;
    }
    if (this.c.inputter.isDown(this.c.inputter.A)) {
      this.center.x -= spd;
    } else if (this.c.inputter.isDown(this.c.inputter.D)) {
      this.center.x += spd;
    }

    var hw = this.size.x / 2;
    var hh = this.size.y / 2;

    if (this.center.x + hw < 0) {
      this.center.x = hw;
    }
    if (this.center.y + hh < 0) {
      this.center.y = hh;
    }
    if (this.center.x - hw > this.game.width) {
      this.center.x = this.game.width - hw;
    }
    if (this.center.y - hh > this.game.width) {
      this.center.y = this.game.width - hh;
    }

    // Shooting
    if (this.c.inputter.isPressed(this.c.inputter.I)) {
      this.shoot('up');
    } else if (this.c.inputter.isPressed(this.c.inputter.K)) {
      this.shoot('down');
    } else if (this.c.inputter.isPressed(this.c.inputter.J)) {
      this.shoot('left');
    } else if (this.c.inputter.isPressed(this.c.inputter.L)) {
      this.shoot('right');
    }

    // Bomb
    if (this.c.inputter.isPressed(this.c.inputter.SPACE)) {
      this.bomb();
    }
  }

  shoot(direction: string) {
    var now = Date.now();

    if (now - this.lastShot < THROTTLE_MS) {
      return;
    }

    this.lastShot = now;

    new Bullet(this.game, {
      direction: direction,
      creator: this,
      speed: 35
    });
  }

  bomb() {
    var enemies = this.c.entities.all(Enemy);
    enemies.forEach((enemy) => {
      enemy.destroy(true);
    });

    this.game.audioManager.play('player_explosion');
  }

  draw(ctx: any) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.center.x - this.size.x / 2,
                 this.center.y - this.size.y / 2,
                 this.size.x,
                 this.size.y);
  }

  collision(other: Entity) {
    if (other instanceof Bullet) {
      if (other.creator !== this) {
        this.game.fsm.die();
      }
    } else if (other instanceof Enemy) {
      other.destroy(false);

      new Explosion(this.game, {
        creator: this,
        vanishMs: 1500
      });

      this.game.c.entities.destroy(this);

      setTimeout(() => {
        this.game.fsm.die();
      }, 2000);
    }
  }
}

module.exports = Player;
