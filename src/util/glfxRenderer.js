/* @flow */
/* global fx */

// Credit: http://www.zachstronaut.com/posts/2012/08/17/webgl-fake-crt-html5.html

var Coquette = require('coquette');

function installGlfxRenderer() {

  var Renderer = Coquette.Renderer;

  Renderer.prototype._originalUpdate = Renderer.prototype.update;

  Renderer.prototype.initGlfx = function() {
    var source = this.getCtx().canvas;
    this.glCanvas = fx.canvas();

    source.parentNode.insertBefore(this.glCanvas, source);
    source.style.display = 'none';
    this.glCanvas.id = source.id;
    source.id = 'old-' + source.id;
  };

  Renderer.prototype.update = function(interval) {
    this._originalUpdate(interval);
    var source = this.getCtx().canvas;
    var texture = this.glCanvas.texture(source);

    this.glCanvas.draw(texture)
      .bulgePinch(source.width / 2, source.height / 2, source.width * 0.8, 0.12)
      .vignette(0.25, 0.5)
      .update();
  };
}

module.exports = installGlfxRenderer;
