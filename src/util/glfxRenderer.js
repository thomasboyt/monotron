/* @flow */
/* global fx */

// Credit: http://www.zachstronaut.com/posts/2012/08/17/webgl-fake-crt-html5.html

var Coquette = require('coquette');

/**
 * Add padding around the initial game canvas so that the bulge'd canvas doesn't go outside the
 * edge of the final canvas
 */
function addPadding(src, dest) {
  var buf = 20;

  dest.width = src.width + buf * 2;
  dest.height = src.height + buf * 2;

  var ctx = dest.getContext('2d');
  ctx.drawImage(src, buf, buf);
  ctx.translate(0.5, 0.5);

  // Add outline around canvas
  var outlineWidth = 4;
  var ohw = outlineWidth / 2;

  ctx.strokeStyle = 'white';
  ctx.lineWidth = outlineWidth;

  ctx.strokeRect(buf - ohw, buf - ohw, src.width + ohw, src.height + ohw);

  return dest;
}

/**
 * Monkey-patch the Coquette Renderer to add custom Glfx-related rendering
 */
function installGlfxRenderer() {

  var Renderer = Coquette.Renderer;

  Renderer.prototype._originalUpdate = Renderer.prototype.update;

  /**
   * Create padding and glfx canvases, remove original canvas from page, insert glfx canvas in its
   * place
   */
  Renderer.prototype.initGlfx = function() {
    var source = this.getCtx().canvas;

    this.glCanvas = fx.canvas();

    source.parentNode.insertBefore(this.glCanvas, source);
    source.style.display = 'none';
    this.glCanvas.id = source.id;
    source.id = 'old-' + source.id;

    this.padCanvas = document.createElement('canvas');
  };

  /**
   * Render original canvas through padding canvas and gl canvas
   */
  Renderer.prototype.update = function(interval) {
    this._originalUpdate(interval);
    var source = this.getCtx().canvas;
    var padded = addPadding(source, this.padCanvas);
    var texture = this.glCanvas.texture(padded);

    this.glCanvas.draw(texture)
      .bulgePinch(source.width / 2, source.height / 2, source.width * 0.8, 0.12)
      .vignette(0.25, 0.5)
      .update();
  };
}

module.exports = installGlfxRenderer;
