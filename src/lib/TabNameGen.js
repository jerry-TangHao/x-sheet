import { SheetUtils } from '../utils/SheetUtils';

export class TabNameGen {
  static #extract = /sheet(\d+)/;

  #sequence;

  #include;

  constructor() {
    this.#include = [];
    this.#sequence = 0;
  }

  #nextName() {
    const name = `sheet${++this.#sequence}`;
    this.#include.push(name);
    return name;
  }

  clear() {
    this.#include = [];
    this.#sequence = 0;
  }

  genName(name) {
    if (TabNameGen.#extract.test(name)) {
      const extract = name.match(TabNameGen.#extract);
      const sequence = parseInt(extract[1], 10);
      if (sequence > this.#sequence) {
        this.#sequence = sequence;
      }
    }
    if (SheetUtils.isDef(name)) {
      if (this.#include.indexOf(name) > -1) {
        return this.#nextName();
      }
      return name;
    }
    return this.#nextName();
  }

  removeName(name) {
    const index = this.#include.indexOf(name);
    if (index > -1) {
      this.#include.splice(index, 1);
    }
  }

}
