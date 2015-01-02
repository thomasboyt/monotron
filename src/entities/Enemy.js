/* @flow */

var Coquette = require('coquette');
var math = require('../util/math');

var Game = require('../Game');
var Entity = require('./Entity');
var Player = require('./Player');
var Bullet = require('./Bullet');

var ENEMY_SPEED = 5;

type Coordinates = {
  x: number;
  y: number;
};

type Options = {
  center: Coordinates;
};

class Enemy extends Entity {

  game: Game;
  player: Player;

  init(game: Game, settings: Options) {
    this.game = game;
    this.player = game.player;

    this.size = { x:15, y:15 };
    this.center = settings.center;
  }

  update(dt: number) {
    // Enemies attempt to get closer to the player

    var spd = dt/100 * ENEMY_SPEED;

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

  collision(other: Entity) {
    if (other instanceof Bullet) {
      if (other.creator === this.player) {
        this.game.c.entities.destroy(this);
        this.game.c.entities.destroy(other);

        this.game.score += 1;
      }
    } else if (other instanceof Player) {
      this.game.fsm.die();
    }
  }
}

module.exports = Enemy;
