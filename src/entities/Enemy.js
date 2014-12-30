/* @flow */

var Coquette = require('coquette');
var Game = require('../Game');
var Entity = require('./Entity');

var ENEMY_SPEED = 10;

type Coordinates = {
  x: number;
  y: number;
};

type Options = {
  center: Coordinates;
  color: string;
};

class Enemy extends Entity {

  c: Coquette;
  color: string;

  init(game: Game, settings: Options) {
    this.c = game.c;

    this.size = { x:15, y:15 };
    this.center = settings.center;
    this.color = settings.color;
  }

  update(dt: number) {
  }

  draw(ctx: any) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.center.x - this.size.x / 2,
                 this.center.y - this.size.y / 2,
                 this.size.x,
                 this.size.y);
  }
}

module.exports = Enemy;
