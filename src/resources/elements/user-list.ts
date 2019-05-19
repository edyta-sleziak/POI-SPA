import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { User, Island, Category } from '../../services/poi-interfaces';
import {IslandService} from "../../services/island-service";

@inject(IslandService)
export class UserList {
  @bindable
  user: User;
  islands: Island[];

  constructor(private ds: IslandService) {
    this.getData();
  }

  async getData() {
    const user = await this.ds.getLoggedUserData();
    this.user = user;
    const islands = await this.ds.getUsersIslands(user._id);
    this.islands = islands;
  }
}
