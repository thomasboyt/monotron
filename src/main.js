// This file is purposely not type-checked!
// Flow does not like Webpack's non-module requires, nor AudioContext

require('../assets/game.css');
require('script!./vendor/glfx.js');

var installGlfxRenderer = require('./util/glfxRenderer');
installGlfxRenderer();

var Game = require('./Game');

function init() {
  require('./page');

  new Game();
}

window.onload = init;
