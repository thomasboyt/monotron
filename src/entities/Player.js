/* @flow */

var Coquette = require('coquette');
var Game = require('../Game');

var Entity = require('./Entity');
var Bullet = require('./Bullet');
var Enemy = require('./Enemy');
var Explosion = require('./Explosion');
var Powerup = require('./Powerup');

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
  bombs: number;

  init(game: Game, settings: Options) {
    this.c = game.c;
    this.game = game;

    this.size = { x:15, y:15 };
    this.center = settings.center;

    this.lastShot = 0;
    this.bombs = 0;
  }

  update(dt: number) {
    var spd = this.game.config.playerSpeed/100 * dt;

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

    this.preventOffEdge();

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

  preventOffEdge() {
    var hw = this.size.x / 2;
    var hh = this.size.y / 2;

    var buf = 10;

    if (this.center.x - hw < buf) {
      this.center.x = buf + hw;
    }
    if (this.center.y - hh < buf) {
      this.center.y = buf + hh;
    }
    if (this.center.x + hw > this.game.width - buf) {
      this.center.x = this.game.width - hw - buf;
    }
    if (this.center.y + hh > this.game.height - buf) {
      this.center.y = this.game.height - hh - buf;
    }

  }

  shoot(direction: string) {
    var now = Date.now();

    if (now - this.lastShot < this.game.config.fireThrottleMs) {
      return;
    }

    this.lastShot = now;

    new Bullet(this.game, {
      direction: direction,
      creator: this,
      speed: this.game.config.bulletSpeed
    });
  }

  bomb() {
    if (this.bombs === 0) {
      return;
    }

    this.bombs -= 1;

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

    } else if (other instanceof Powerup) {
      if (other.type === 'bomb') {
        this.bombs += 1;
      }
      this.game.c.entities.destroy(other);
      this.game.audioManager.play('powerup');
    }
  }
}

module.exports = Player;
