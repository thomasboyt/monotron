/* @flow */

var Game = require('../Game');
var Entity = require('./Entity');
var Timer = require('../util/Timer');

var getFont = (fmt) => fmt + ' Hyperspace';

var BLINK_TIMER_MS = 800;

// http://stackoverflow.com/a/2998822/1212864
function pad(num, size) {
  var s = num + "";
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}

class UI extends Entity {
  game: Game;
  blinkTimer: Timer;
  instructionsTimer: Timer;
  blinkOn: boolean;

  init(game: Game, settings: any) {
    this.game = game;

    this.zindex = -1;

    this.blinkTimer = new Timer(BLINK_TIMER_MS);
    this.blinkOn = true;
  }

  showInstructions() {
    this.instructionsTimer = new Timer(this.game.config.startDelayMs);
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
    ctx.fillText(pad(this.game.session.score, 4), this.game.width - 50, 50);

    // Bombs
    ctx.textAlign = 'left';
    ctx.fillText('Bombs:' + this.game.player.bombs, 50, 50);

    this.drawInstructions(ctx);
  }

  drawInstructions(ctx: any) {
    if (!this.instructionsTimer.expired()) {
      ctx.textAlign = 'center';

      var offset = 250;
      ctx.fillText('WASD TO MOVE', 250, offset + 0);
      ctx.fillText('IJKL TO SHOOT', 250, offset + 30);
      ctx.fillText('SPACE FOR BOMB', 250, offset + 60);
    }
  }

  drawDead(ctx: any) {
    ctx.fillStyle = '#fff';

    ctx.textAlign = 'center';
    ctx.font = getFont('normal 72px');
    ctx.fillText('Game Over', 250, 150);

    ctx.font = getFont('normal 32px');

    var score = pad(this.game.session.score, 4);

    ctx.textAlign = 'left';
    ctx.fillText('score', 150, 220);
    ctx.textAlign = 'right';
    ctx.fillText(score, 350, 220);

    if (this.game.session.isNewHighScore) {
      ctx.textAlign = 'center';
      ctx.fillText('new best', 250, 260);
    } else {
      var best = pad(this.game.highScore, 4);

      ctx.textAlign = 'left';
      ctx.fillText('best', 150, 260);
      ctx.textAlign = 'right';
      ctx.fillText(best, 350, 260);
    }

    ctx.textAlign = 'center';
    ctx.font = getFont('normal 32px');
    if (this.blinkOn) {
      ctx.fillText('press R to restart', 250, 330);
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

  drawLoading(ctx: any) {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';

    ctx.font = '24px Hyperspace';
    ctx.textAlign = 'left';
    ctx.fillText('loading...', 25, 300);

    // progress bar
    var width = 450;
    var height = 20;

    var numTotal = this.game.preloader.numTotal;
    var numLoaded = this.game.preloader.numLoaded;

    var fillPercent = numLoaded / numTotal;
    var barWidth = width * fillPercent;

    ctx.strokeRect(25, 320, width, height);
    ctx.fillRect(25, 320, barWidth, height);
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
    } else if (fsm.is('loading')) {
      this.drawLoading(ctx);
    }

  }
}

module.exports = UI;
