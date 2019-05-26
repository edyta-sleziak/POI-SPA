import { bindable } from 'aurelia-framework';
import { Island, Category } from '../../services/poi-interfaces';
import { IslandService } from "../../services/island-service";
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(IslandService, EventAggregator)
export class IslandEdit {
  @bindable
  island: Island;
  categories: Category[];

  constructor(private ds: IslandService, private ea: EventAggregator) {
    this.ds.getCategories();
    this.categories = this.ds.categories;
    this.getData();
  }

  async getData() {
    const data = await this.ea.subscribe('EditIsland', response => {
      this.island = response;
      console.log(response);
    });
  }

  async saveIslandChanges() {
    console.log(this.island);
    await this.ds.editIsland(this.island);
    const selectedIsland = await this.ds.getIslandData(this.island._id);
    this.ea.publish('IslandClicked', selectedIsland);
    this.island = null;
    this.ea.publish('showEditScreen', false);
  }

  async cancelChanges() {
    this.island = null;
    this.ea.publish('showEditScreen', false);
  }
}
