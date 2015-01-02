/* @flow */

var Coquette = require('coquette');

var Entity = require('./Entity');

var Game = require('../Game');
var math = require('../util/math');

var VANISH_MS = 500;
var PARTICLE_SPEED_BASE = 15;

class ExplosionParticle {
  constructor(originalCenter, originalSize) {
    var randX = math.randInt(0, originalSize.x / 2);
    var randY = math.randInt(0, originalSize.y / 2);

    this.center = {
      x: originalCenter.x - originalSize.x / 4 + randX,
      y: originalCenter.y - originalSize.y / 4 + randY
    };

    // Set angle away from original center
    this.angle = -Math.atan2(this.center.y - originalCenter.y, this.center.x - originalCenter.x);

    this.speed = PARTICLE_SPEED_BASE + math.randInt(0, 10);

    this.timeElapsed = 0;
  }

  move(dt: number) {
    this.timeElapsed += dt;

    var spd = dt/100 * this.speed;
    var vec = math.calcVector(spd, this.angle);
    this.center.x += vec.x;
    this.center.y += vec.y;
  }

  draw(ctx) {
    var alpha = (VANISH_MS - this.timeElapsed) / VANISH_MS;
    ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
    ctx.fillRect(this.center.x, this.center.y, 1, 1);
  }
}

class Explosion extends Entity {

  init(game: Game, creator: Entity) {
    this.game = game;

    this.center = creator.center;
    this.size = creator.size;

    this.timeElapsed = 0;

    this.initParticles();
  }

  initParticles() {
    var numParticles = math.randInt(10, 15);

    this.particles = [];

    for (var i = 0; i < numParticles; i++) {
      this.particles[i] = new ExplosionParticle(this.center, this.size);
    }
  }

  update(dt: number) {
    this.timeElapsed += dt;

    if (this.timeElapsed > VANISH_MS) {
      this.game.c.entities.destroy(this);
      return;
    }

    this.particles.forEach((particle) => {
      particle.move(dt);
    });
  }

  draw(ctx: any) {
    // Draw particle field
    this.particles.forEach((particle) => {
      particle.draw(ctx);
    });
  }
}

module.exports = Explosion;
