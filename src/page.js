var screenfull = require('screenfull');

document.getElementById('full-screen').onclick = function(e) {
  e.preventDefault();
  screenfull.request();
};
