/* @flow */

var Game = require('../Game');
var Entity = require('./Entity');

class UI extends Entity {
  game: Game;

  init(game: Game, settings: any) {
    this.game = game;
  }

  drawPlaying(ctx: any) {
    // Score
    ctx.textAlign = 'right';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(this.game.score, this.game.width - 10, 20);

    // Debug
    // ctx.fillText(this.game.spawner.getSpawnDelay(), this.game.width - 10, this.game.height - 20);
  }

  drawDead(ctx: any) {
    ctx.textAlign = 'center';

    ctx.font = 'bold 72px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('GAME OVER', 250, 200);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('your final score: ' + this.game.score, 250, 300);
    ctx.fillText('press R to restart', 250, 350);
  }

  drawAttract(ctx: any) {
    ctx.textAlign = "center";

    ctx.font = "bold 72px sans-serif";
    ctx.fillText("monotron", 250, 250);

    ctx.font = "bold 42px sans-serif";
    ctx.fillText("Press [space] to start", 250, 300);
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
