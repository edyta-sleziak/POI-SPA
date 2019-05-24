import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { Island, User, Category } from '../../services/poi-interfaces';
import {IslandService} from "../../services/island-service";

@inject(IslandService)
export class IslandForm {
  name: string;
  category: Category;
  latitude: string;
  longitude: string;
  @bindable
  islands: Island[];

  constructor (private ds: IslandService) {}

  async addNewIsland() {
    await this.ds.quickAddIsland(this.name, this.category, this.latitude, this.longitude);
    this.name = '';
    this.category = null;
    this.latitude = '';
    this.longitude = '';
  }
}
