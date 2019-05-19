import { inject } from 'aurelia-framework';
import { Island } from '../services/poi-interfaces';
import { IslandService } from '../services/island-service';

@inject(IslandService)
export class Islands {
  islands: Island[];

  constructor(private ds: IslandService) {
    this.islands = ds.islands;
  }
}
