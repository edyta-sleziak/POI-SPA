import { Island } from "./poi-interfaces";

export class Marker {
  island : Island;
  total : number;
  clickedIsland : Island;

  // constructor (total: number, island: Island, clickedIsland : Island) {
  //   this.total = total;
  //   this.island = island;
  //   this.clickedIsland = clickedIsland;
  // }

  constructor(island : Island) {
    this.island = island;

  }


}
