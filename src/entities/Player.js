/* @flow */

var Coquette = require('coquette');
var Game = require('../Game');
var Timer = require('../util/Timer');

var Entity = require('./Entity');
var Bullet = require('./Bullet');
var Enemy = require('./Enemy');
var Explosion = require('./effects/Explosion');
var Shockwave = require('./effects/Shockwave');
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
  bombs: number;
  shotThrottleTimer: Timer;

  init(game: Game, settings: Options) {
    this.c = game.c;
    this.game = game;

    this.size = { x:15, y:15 };
    this.center = settings.center;
    this.shotThrottleTimer = new Timer(this.game.config.fireThrottleMs);

    this.bombs = this.game.config.numBombs;
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

    var buf = this.game.config.edgeBuffer;

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
    if (this.shotThrottleTimer.expired()) {
      this.shotThrottleTimer.reset();

      new Bullet(this.game, {
        direction: direction,
        creator: this,
        speed: this.game.config.bulletSpeed
      });
    }
  }

  bomb() {
    if (this.bombs === 0) {
      return;
    }

    this.bombs -= 1;

    var x = this.center.x;
    var y = this.center.y;

    this.game.audioManager.play('bomb');

    var mkShockwave = () => {
      new Shockwave(this.game, {
        center: {x: x, y: y}
      });
    };

    mkShockwave();
    setTimeout(mkShockwave, 100);
    setTimeout(mkShockwave, 200);
    setTimeout(mkShockwave, 300);
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
