/* @flow */

require('../assets/game.css');
require('script!./vendor/glfx.js');

var Coquette = require('coquette');

var installGlfxRenderer = require('./util/glfxRenderer');
installGlfxRenderer();

var Game = require('./Game');
var AssetPreloader = require('./util/AssetPreloader');

function init() {
  var audioContext = new AudioContext();

  var preloader = new AssetPreloader({
    images: null,
    audio: {
      'enemy_explosion': require('../assets/sound/enemy_explosion.wav'),
      'player_explosion': require('../assets/sound/player_explosion.wav'),
      'shoot': require('../assets/sound/shoot.wav')
    }
  }, audioContext);

  preloader.load().done(function(assets) {
    setTimeout(function() {
      new Game(assets, audioContext);
    }, 0);
  });
}

window.onload = init;
