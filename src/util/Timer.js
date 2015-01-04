/* @flow */

class Timer {
  expireIn: ?number;
  _startTime: number;

  constructor(expireIn?: number) {
    if (expireIn === undefined) {
      this.expireIn = null;
    } else {
      this.expireIn = expireIn;
    }

    this.reset();
  }

  expired(): boolean {
    if (this.expireIn === null) {
      return false;
    } else {
      return this.elapsed() > this.expireIn;
    }
  }

  elapsed(): number {
    return Date.now() - this._startTime;
  }

  reset(): void {
    this._startTime = Date.now();
  }
}

module.exports = Timer;
