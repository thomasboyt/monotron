/* @flow */

var Game = require('../Game');
var Entity = require('./Entity');
var Timer = require('../util/Timer');

var getFont = (fmt) => fmt + ' Hyperspace';

var BLINK_TIMER_MS = 800;

class UI extends Entity {
  game: Game;
  blinkTimer: Timer;
  blinkOn: boolean;

  init(game: Game, settings: any) {
    this.game = game;

    this.zindex = -1;

    this.blinkTimer = new Timer(BLINK_TIMER_MS);
    this.blinkOn = true;
  }

  update(dt: number) {
    if (this.blinkTimer.expired()) {
      this.blinkTimer.reset();

      this.blinkOn = !this.blinkOn;
    }
  }

  drawPlaying(ctx: any) {
    // Score
    ctx.textAlign = 'right';
    ctx.font = getFont('normal 24px');
    ctx.fillText(this.game.score, this.game.width - 50, 50);

    // Bombs
    ctx.textAlign = 'left';
    ctx.fillText('Bombs:' + this.game.player.bombs, 50, 50);
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

  drawBg(ctx: any) {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, this.game.width, this.game.height);
  }

  draw(ctx: any) {
    this.drawBg(ctx);

    var fsm = this.game.fsm;

    ctx.fillStyle = '#fff';

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
