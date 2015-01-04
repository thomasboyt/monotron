/* @flow */

var Coquette = require('coquette');
var Game = require('../Game');
var Entity = require('./Entity');

type Coordinates = {
  x: number;
  y: number;
};

type Options = {
  creator: Entity;
  direction: string;
  speed: number;
};

class Bullet extends Entity {

  c: Coquette;
  game: Game;
  creator: Entity;
  speed: number;
  velocity: Coordinates;

  init(game: Game, settings: Options) {
    this.c = game.c;
    this.game = game;

    this.size = { x:3, y:3 };

    this.speed = settings.speed;
    var creator = this.creator = settings.creator;

    this.game.audioManager.play('shoot');

    // TODO: ew.
    if (settings.direction === 'left') {
      this.center = {
        x: creator.center.x - creator.size.x / 2 - Math.ceil(this.size.x / 2),
        y: creator.center.y
      };
      this.velocity = { x: -this.speed, y: 0 };

    } else if (settings.direction === 'right') {
      this.center = {
        x: creator.center.x + creator.size.x / 2 + Math.ceil(this.size.x / 2),
        y: creator.center.y
      };
      this.velocity = { x: this.speed, y: 0 };

    } else if (settings.direction === 'up') {
      this.center = {
        x: creator.center.x,
        y: creator.center.y - creator.size.y / 2 - Math.ceil(this.size.y / 2)
      };
      this.velocity = { x: 0, y: -this.speed };

    } else if (settings.direction === 'down') {
      this.center = {
        x: creator.center.x,
        y: creator.center.y + creator.size.y / 2 + Math.ceil(this.size.y / 2)
      };
      this.velocity = { x: 0, y: this.speed };
    }
  }

  update(dt: number) {
    this.center.x += this.velocity.x/100 * dt;
    this.center.y += this.velocity.y/100 * dt;

    // Detect if it goes off-screen
    if (this.center.x - this.size.x / 2 < 0 ||
        this.center.y - this.size.y / 2 < 0 ||
        this.center.x + this.size.x / 2 > this.game.width ||
        this.center.y + this.size.y / 2 > this.game.height) {
      this.c.entities.destroy(this);
    }
  }

  draw(ctx: any) {
    ctx.fillStyle = 'white';

    ctx.fillRect(this.center.x - this.size.x / 2,
                 this.center.y - this.size.y / 2,
                 this.size.x,
                 this.size.y);
  }
}

module.exports = Bullet;
