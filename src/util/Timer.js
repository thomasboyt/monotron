/* @flow */

class Timer {
  expireIn: number;
  _startTime: number;

  constructor(expireIn: number) {
    this.expireIn = expireIn;
    this.reset();
  }

  expired() {
    return Date.now() - this._startTime > this.expireIn;
  }

  reset() {
    this._startTime = Date.now();
  }
}

module.exports = Timer;
