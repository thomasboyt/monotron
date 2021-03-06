/* @flow */

var q = require('q');
var _ = require('lodash');

type AssetMap = {
  images: {
    [key:string]: Image
  };
  audio: {
    [key:string]: ArrayBuffer
  };
}

type AssetCfg = {
  images: ?{
    [key:string]: string
  };
  audio: ?{
    [key:string]: string
  };
}

class AssetPreloader {
  assets: AssetMap;
  numTotal: number;
  numLoaded: number;
  audioCtx: any;

  _images: ?{
    [key:string]: string
  };
  _audio: ?{
    [key:string]: string
  };

  constructor (assetCfg : AssetCfg, audioCtx: any) {
    /* jshint loopfunc: true */

    this.assets = {
      'images': {},
      'audio': {}
    };

    this.audioCtx = audioCtx;

    this._images = assetCfg.images;
    this._audio = assetCfg.audio;

    this.numTotal = _.keys(this._images).length + _.keys(this._audio).length;
    this.numLoaded = 0;
  }

  load() : Promise {
    var dfd = q.defer();

    var onAssetLoaded = () => {
      this.numLoaded += 1;

      if ( this.numTotal === this.numLoaded ) {
        dfd.resolve(this.assets);
      }
    };

    if (this._images === null && this._audio === null) {
      // no assets, resolve immediately
      dfd.resolve(this.assets);
    }

    _.each(this._images, (src, name) => {
      var img = new Image();
      img.onload = onAssetLoaded;
      img.src = src;

      this.assets.images[name] = img;
    });

    _.each(this._audio, (src, name) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', src, true);
      xhr.responseType = 'arraybuffer';

      xhr.onload = () => {
        this.audioCtx.decodeAudioData(xhr.response, (buf) => {
          this.assets.audio[name] = buf;
          onAssetLoaded();
        });
      };

      xhr.send();
    });

    return dfd.promise;
  }

}

module.exports = AssetPreloader;
