import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { Island, User, Category } from '../../services/poi-interfaces';
import {IslandService} from "../../services/island-service";

@inject(IslandService)
export class IslandForm {
  @bindable
  name: string;
  category: string;
  latitude: string;
  longitude: string;
  islands: Island[];
  categories: Category[];

  constructor(private ds: IslandService) {
    this.populateCategories();
  }

  async populateCategories() {
    await this.ds.getCategories();
    this.categories = this.ds.categories;
    console.log(this.categories);
  }

  async addNewIsland() {
    const data = await this.ds.quickAddIsland(this.name, this.category, this.latitude, this.longitude);
    this.name = '';
    this.category = '';
    this.latitude = '';
    this.longitude = '';
  }
}
