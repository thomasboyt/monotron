var _ = require('lodash');

var config = require('./webpack.config');

config = _.merge({
  output: {
    publicPath: '/my-game-path/'
  }
}, config);

module.exports = config;
