/* @flow */

var Game = require('../Game');

var Entity = require('./Entity');

class Powerup extends Entity {
  radius: number;
  type: string;

  init(game: Game, settings: any) {
    this.center = settings.center;
    this.radius = 5;
    this.size = { x: this.radius * 2, y: this.radius * 2 };
    this.type = settings.type;
  }

  update(dt: number) {
  }

  draw(ctx: any) {
    ctx.strokeStyle = '#fff';

    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, 360);
    ctx.stroke();
    ctx.closePath();
  }
}

module.exports = Powerup;
