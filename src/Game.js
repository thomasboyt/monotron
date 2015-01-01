/* @flow */

var Coquette = require('coquette');
var EnemySpawner = require('./EnemySpawner');
var addRegister = require('./util/addRegister');
var StateMachine = require('javascript-state-machine');

var Player = require('./entities/Player');
var Bullet = require('./entities/Bullet');
var Enemy = require('./entities/Enemy');
var UI = require('./entities/UI');

type AssetMap = {
  images: {
    [key: string]: Image;
  };
  audio: {
    [key:string]: ArrayBuffer;
  };
}

class Game {
  c: Coquette;
  assets: AssetMap;
  width: number;
  height: number;
  score: number;

  player: Player;
  spawner: EnemySpawner;

  constructor(assets: AssetMap) {
    this.assets = assets;

    this.width = 500;
    this.height = 375;

    this.c = window.__coquette__ = new Coquette(this, 'game-canvas', this.width, this.height, 'black');
    this.c.renderer.getCtx().imageSmoothingEnabled = false;
    addRegister(this.c);

    this.fsm = StateMachine.create({
      initial: 'attract',
      events: [
        // { name: 'loaded', from: ['loading'], to: 'attract' },
        { name: 'start', from: ['attract', 'dead'], to: 'playing' },
        { name: 'die', from: 'playing', to: 'dead' }
      ],

      callbacks: {
        onenterplaying: this.start.bind(this),
        ondie: this.die.bind(this)
      }
    });

    var ui = new UI(this, {});

    this.spawner = new EnemySpawner(this);
  }

  update(dt: number) {
    if (this.fsm.is('dead')) {
      if (this.c.inputter.isPressed(this.c.inputter.R)) {
        this.fsm.start(this.fsm);
      }
    }

    if (this.fsm.is('attract')) {
      if (this.c.inputter.isPressed(this.c.inputter.SPACE)) {
        this.fsm.start(this.fsm);
      }
    }
  }

  start() {
    this.score = 0;

    this.player = new Player(this, {
      center: { x: this.width / 2, y: this.height / 2 }
    });

    this.spawner.start();
  }

  clearWorld() {
    var entities = [Player, Enemy, Bullet];

    entities.forEach((type) => {
      var items = this.c.entities.all(type);
      items.forEach((item) => {
        this.c.entities.destroy(item);
      });
    });
  }

  die() {
    this.clearWorld();
    this.spawner.stop();
  }
}

module.exports = Game;
