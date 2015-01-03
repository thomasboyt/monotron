/* @flow */

var Coquette = require('coquette');

var Entity = require('../Entity');

var Game = require('../../Game');
var math = require('../../util/math');

var PARTICLE_SPEED_BASE = 15;

type Coordinates = {
  x: number;
  y: number;
}

class ExplosionParticle {

  explosion: Explosion;
  center: Coordinates;
  angle: number;
  speed: number;

  constructor(explosion: Explosion) {
    this.explosion = explosion;

    var originalSize = explosion.size;
    var originalCenter = explosion.center;

    var randX = math.randInt(0, originalSize.x / 2);
    var randY = math.randInt(0, originalSize.y / 2);

    this.center = {
      x: originalCenter.x - originalSize.x / 4 + randX,
      y: originalCenter.y - originalSize.y / 4 + randY
    };

    // Set angle away from original center
    this.angle = -Math.atan2(this.center.y - originalCenter.y, this.center.x - originalCenter.x);

    this.speed = PARTICLE_SPEED_BASE + math.randInt(0, 10);
  }

  move(dt: number) {
    var spd = dt/100 * this.speed;
    var vec = math.calcVector(spd, this.angle);
    this.center.x += vec.x;
    this.center.y += vec.y;
  }

  draw(ctx) {
    var alpha = (this.explosion.vanishMs - this.explosion.timeElapsed) / this.explosion.vanishMs;
    ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
    ctx.fillRect(this.center.x, this.center.y, 1, 1);
  }
}

class Explosion extends Entity {

  game: Game;
  creator: Entity;
  vanishMs: number;
  timeElapsed: number;
  particles: Array<ExplosionParticle>;  // </>

  init(game: Game, settings: any) {
    this.game = game;

    this.creator = settings.creator;
    this.center = this.creator.center;
    this.size = this.creator.size;
    this.vanishMs = settings.vanishMs;

    this.timeElapsed = 0;

    this.initParticles();
  }

  initParticles() {
    var numParticles = math.randInt(10, 15);

    this.particles = [];

    for (var i = 0; i < numParticles; i++) {
      this.particles[i] = new ExplosionParticle(this);
    }
  }

  update(dt: number) {
    this.timeElapsed += dt;

    if (this.timeElapsed > this.vanishMs) {
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
