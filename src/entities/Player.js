/* @flow */

var Coquette = require('coquette');
var Game = require('../Game');
var Entity = require('./Entity');
var Bullet = require('./Bullet');

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
    }
  }
}

module.exports = Player;
