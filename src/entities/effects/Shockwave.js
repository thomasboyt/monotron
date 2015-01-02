/* @flow */

var Coquette = require('coquette');

var Entity = require('../Entity');
var Enemy = require('../Enemy');

var Game = require('../../Game');

var SHOCKWAVE_SPEED = 25;
var MAX_RADIUS = 150;
var FADE_TIME_MS = 200;

class Shockwave extends Entity {

  init(game: Game, settings: any) {
    this.game = game;

    this.center = settings.center;

    this.radius = 0;
    this.size = {x: 0, y: 0};
    this.boundingBox = Coquette.Collider.CIRCLE;

    this.fadeTimer = 0;
  }

  update(dt: number) {
    if (this.radius >= MAX_RADIUS) {
      this.fadeTimer += dt;
      if (this.fadeTimer > FADE_TIME_MS) {
        this.game.c.entities.destroy(this);
      }

    } else {
      this.radius += dt/100 * SHOCKWAVE_SPEED;

      this.size.x = this.radius * 2;
      this.size.y = this.radius * 2;
    }
  }

  draw(ctx: any) {
    var alpha = (FADE_TIME_MS - this.fadeTimer) / FADE_TIME_MS;

    ctx.strokeStyle = 'rgba(255, 255, 255, ' + alpha + ')';

    var segments = 12;
    var angle = (360/segments) * (Math.PI/180);

    // start at top center
    ctx.beginPath();
    ctx.moveTo(this.center.x + this.radius, this.center.y);

    for (var i = 1; i < segments; i++) {
      var x = this.radius * Math.cos(angle * i);
      var y = this.radius * Math.sin(angle * i);
      ctx.lineTo(this.center.x + x, this.center.y + y);
    }
    ctx.closePath();

    ctx.stroke();
  }

  collision(other: Entity) {
    if (other instanceof Enemy) {
      other.destroy(true);
    }
  }
}

module.exports = Shockwave;
