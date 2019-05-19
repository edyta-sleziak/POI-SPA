import { inject } from 'aurelia-framework';
import { Island, User } from '../services/poi-interfaces';
import { IslandService } from '../services/island-service';

@inject(IslandService)
export class IslandView {
  islands: Island[];
  users: User[];

  constructor(private ds: IslandService) {
    this.islands = ds.islands;
    //this.users = ds.users;
  }
}
