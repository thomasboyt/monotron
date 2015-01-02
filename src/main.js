// This file is purposely not type-checked!
// Flow does not like Webpack's non-module requires, nor AudioContext

require('../assets/game.css');
require('script!./vendor/glfx.js');
var assets = require('./assets');

var Coquette = require('coquette');

var installGlfxRenderer = require('./util/glfxRenderer');
installGlfxRenderer();

var Game = require('./Game');
var AssetPreloader = require('./util/AssetPreloader');

function init() {
  require('./page');

  var audioContext = new AudioContext();

  var preloader = new AssetPreloader(assets, audioContext);

  preloader.load().done(function(assets) {
    setTimeout(function() {
      new Game(assets, audioContext);
    }, 0);
  });
}

window.onload = init;
