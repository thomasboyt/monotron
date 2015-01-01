/* @flow */

var Game = require('../Game');
var Entity = require('./Entity');

var getFont = (fmt) => fmt + ' Hyperspace';

var BLINK_TIMER_MS = 800;

class UI extends Entity {
  game: Game;
  lastBlink: number;
  blinkOn: boolean;

  init(game: Game, settings: any) {
    this.game = game;
    this.lastBlink = 0;
    this.blinkOn = false;
  }

  update(dt: number) {
    var now = Date.now();

    if (now - this.lastBlink < BLINK_TIMER_MS) {
      return;
    }

    this.blinkOn = !this.blinkOn;
    this.lastBlink = now;
  }

  drawPlaying(ctx: any) {
    // Score
    ctx.textAlign = 'right';
    ctx.font = getFont('normal 20px');
    ctx.fillText(this.game.score, this.game.width - 10, 20);
  }

  drawDead(ctx: any) {
    ctx.textAlign = 'center';

    ctx.font = getFont('normal 72px');
    ctx.fillStyle = '#fff';
    ctx.fillText('Game Over', 250, 150);

    ctx.fillStyle = '#fff';
    ctx.font = getFont('normal 32px');
    ctx.fillText('your final score:', 250, 220);
    ctx.fillText(this.game.score, 250, 260);

    if (this.blinkOn) {
      ctx.fillText('press R to restart', 250, 310);
    }
  }

  drawAttract(ctx: any) {
    ctx.textAlign = "center";

    ctx.font = getFont('normal 64px');
    ctx.fillText("Monotron", 250, 180);

    if (this.blinkOn) {
      ctx.font = getFont('normal 32px');
      ctx.fillText("Push Space", 250, 240);
    }
  }

  draw(ctx: any) {
    var fsm = this.game.fsm;

    ctx.fillStyle = '#fff';

    // playing HUD
    if (fsm.is('playing')) {
      this.drawPlaying(ctx);
    } else if (fsm.is('dead')) {
      this.drawDead(ctx);
    } else if (fsm.is('attract')) {
      this.drawAttract(ctx);
    }

  }
}

module.exports = UI;
