import { Island } from "./poi-interfaces";

export class Marker {
  island : Island;
  total : number;
  constructor (total: number, island: Island) {
    this.total = total;
    this.island = island;
  }
}
