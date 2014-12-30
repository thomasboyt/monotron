/* @flow */

var Coquette = require('coquette');

var Game = require('./Game');
var AssetPreloader = require('./util/AssetPreloader');

function init() {
  var preloader = new AssetPreloader({
    images: null,
    audio: null
  });

  preloader.load().done(function(assets) {
    // TODO: Use a promises library that doesn't break error handling in browser CJS
    setTimeout(function() {
      new Game(assets);
    }, 0);
  });
}

window.onload = init;
