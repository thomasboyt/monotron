var screenfull = require('screenfull');

document.addEventListener(screenfull.raw.fullscreenchange, function() {
  var canvas = document.querySelector('#game-canvas');
  var what = document.querySelector('.what');

  if (screenfull.isFullscreen) {
    what.style.display = 'none';

    var scale = {
      x: window.innerWidth / canvas.width,
      y: window.innerHeight / canvas.height
    };

    if (scale.x < scale.y) {
      scale = scale.x + ', ' + scale.x;
    } else {
      scale = scale.y + ', ' + scale.y;
    }

    canvas.setAttribute('style', '-ms-transform-origin: center top;' +
                        '-webkit-transform-origin: center top;' +
                        '-moz-transform-origin: center top;' +
                        '-o-transform-origin: center top; transform-origin: center top;' +
                        '-ms-transform: scale(' + scale + ');' +
                        '-webkit-transform: scale3d(' + scale + ', 1);' +
                        '-moz-transform: scale(' + scale + ');' +
                        '-o-transform: scale(' + scale + ');' +
                        'transform: scale(' + scale + ');');


  } else {
    what.style.display = 'block';
    canvas.setAttribute('style', '');
  }
});

document.getElementById('full-screen').onclick = function(e) {
  e.preventDefault();
  screenfull.request();
};
