/* @flow */

type Coordinates = {
  x: number;
  y: number;
};

function calcVector(magnitude: number, rad: number): Coordinates {
  var x = magnitude * Math.cos(rad);
  var y = magnitude * Math.sin(rad);
  return { x: x, y: y };
}

/*
 * Return a number between min and max inclusive
 */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  calcVector: calcVector,
  randInt: randInt
};
