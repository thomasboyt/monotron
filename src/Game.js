/* @flow */

var Coquette = require('coquette');
var EnemySpawner = require('./EnemySpawner');
var AudioManager = require('./util/AudioManager');
var addRegister = require('./util/addRegister');
var StateMachine = require('javascript-state-machine');

var AssetPreloader = require('./util/AssetPreloader');
var assets = require('./assets');
var config = require('./config');

var Player = require('./entities/Player');
var Bullet = require('./entities/Bullet');
var Powerup = require('./entities/Powerup');
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

/*
 * Holds session-specific game state that should get cleared when you restart the game
 */
class Session {
  score: number;
  isNewHighScore: boolean;

  constructor() {
    this.score = 0;
    this.isNewHighScore = false;
  }
}

class Game {
  c: Coquette;
  assets: AssetMap;
  audioManager: AudioManager;
  preloader: AssetPreloader;
  session: Session;

  width: number;
  height: number;

  player: Player;
  spawner: EnemySpawner;

  highScore: number;

  constructor() {
    this.audioManager = new AudioManager();

    this.width = 500;
    this.height = 375;

    this.config = config;

    this.c = window.__coquette__ = new Coquette(this, 'game-canvas', this.width, this.height, 'black');
    this.c.renderer.getCtx().imageSmoothingEnabled = false;
    this.c.renderer.initGlfx();
    addRegister(this.c);

    this.fsm = StateMachine.create({
      initial: 'loading',
      events: [
        { name: 'loaded', from: ['loading'], to: 'attract' },
        { name: 'start', from: ['attract', 'dead'], to: 'playing' },
        { name: 'die', from: 'playing', to: 'dead' }
      ],

      callbacks: {
        onloaded: this.loaded.bind(this),
        onenterplaying: this.start.bind(this),
        ondie: this.die.bind(this)
      }
    });

    var score = localStorage.getItem('monotronHighScore');
    this.highScore = score !== null ? parseInt(score, 10) : 0;

    this.preloader = new AssetPreloader(assets, this.audioManager.ctx);
    new UI(this, {});

    this.preloader.load().done((assets) => {
      this.fsm.loaded(assets);
    });
  }

  loaded(evt: string, before: string, after: string, assets: AssetMap) {
    console.log(arguments);
    this.assets = assets;
    this.audioManager.setAudioMap(assets.audio);
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
        setTimeout(() => {
          // Timeout prevents space from trigger twice & bomb being activated
          this.fsm.start(this.fsm);
        }, 0);
      }
    }

    if (this.c.inputter.isPressed(this.c.inputter.M)) {
      this.audioManager.toggleMute();
    }
  }

  start() {
    this.session = new Session();

    this.player = new Player(this, {
      center: { x: this.width / 2, y: this.height / 2 }
    });

    this.spawner.start();
  }

  clearWorld() {
    var entities = [Player, Enemy, Bullet, Powerup];

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

    if (this.session.score > this.highScore) {
      this.highScore = this.session.score;
      this.session.isNewHighScore = true;
      localStorage.setItem('monotronHighScore', ''+this.session.score);
    }
  }
}

module.exports = Game;
