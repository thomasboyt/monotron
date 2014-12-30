/* @flow */

var Coquette = require('coquette');
var Player = require('./entities/Player');
var addRegister = require('./util/addRegister');

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

  constructor(assets: AssetMap) {
    this.assets = assets;

    this.width = 500;
    this.height = 375;

    this.c = window.__coquette__ = new Coquette(this, 'game-canvas', this.width, this.height, 'black');
    this.c.renderer.getCtx().imageSmoothingEnabled = false;
    addRegister(this.c);

    var player = new Player(this, {
      center: { x:256, y:110 },
      color: '#f07'
    });
  }
}

module.exports = Game;
