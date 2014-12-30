/*
 * @flow
 * A base Entity class defining the interface for Coquette entities to implement.
 */

var Game = require('../Game');
var Coquette = require('coquette');

type Coordinates = {
  x: number;
  y: number;
};

class Entity {
  center: Coordinates;
  size: Coordinates;
  angle: number;
  zIndex: number;

  // TODO: Should be some kinda enum w/ Coquette.Collider.RECTANGLE | Coquette.Collider.CIRCLE
  // (at worst, this could be a number once an interface is declared for Coquette, since those
  // two constants are just 0 and 1)
  boundingBox: any;

  /*
   * Public interface
   */
  init(game: Game, settings: Object): void {}
  draw(ctx: any): void {}
  update(dt: number): void {}
  collision(other: Entity): void {}

  constructor(game: Game, settings: Object): void {
    this.init(game, settings);
    game.c.entities.register(this);
  }
}

module.exports = Entity;
