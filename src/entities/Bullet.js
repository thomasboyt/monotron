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
  creator: Entity;
  speed: number;
  velocity: Coordinates;

  init(game: Game, settings: Options) {
    this.c = game.c;

    this.size = { x:3, y:3 };
    this.color = 'white';

    this.speed = settings.speed;
    var creator = this.creator = settings.creator;

    if (settings.direction === 'left') {
      this.center = {
        x: creator.center.x - creator.size.x / 2 - Math.ceil(this.size.x / 2),
        y: creator.center.y
      };
      this.vec = { x: -this.speed, y: 0 };

    } else if (settings.direction === 'right') {
      this.center = {
        x: creator.center.x + creator.size.x / 2 + Math.ceil(this.size.x / 2),
        y: creator.center.y
      };
      this.vec = { x: this.speed, y: 0 };

    } else if (settings.direction === 'up') {
      this.center = {
        x: creator.center.x,
        y: creator.center.y - creator.size.y / 2 - Math.ceil(this.size.y / 2)
      };
      this.vec = { x: 0, y: -this.speed };

    } else if (settings.direction === 'down') {
      this.center = {
        x: creator.center.x,
        y: creator.center.y + creator.size.y / 2 + Math.ceil(this.size.y / 2)
      };
      this.vec = { x: 0, y: this.speed };
    }
  }

  update(dt: number) {
    this.center.x += this.vec.x/100 * dt;
    this.center.y += this.vec.y/100 * dt;
  }

  draw(ctx: any) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.center.x - this.size.x / 2,
                 this.center.y - this.size.y / 2,
                 this.size.x,
                 this.size.y);
  }
}

module.exports = Bullet;
