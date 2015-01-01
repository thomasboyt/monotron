var _ = require('lodash');

var config = require('./webpack.config');

config = _.merge({
  output: {
    publicPath: '/monotron/'
  }
}, config);

module.exports = config;
