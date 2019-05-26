import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { Island, Category, User } from '../../services/poi-interfaces';
import { IslandService } from "../../services/island-service";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(IslandService, EventAggregator)
export class IslandDetails {
  @bindable
  island: Island;

  constructor(private ds: IslandService, private ea: EventAggregator) {
    this.getIslandData();
  }

  async getIslandData() {
    const data = await this.ea.subscribe('IslandClicked', response => {
      this.island = response;
    });
  }

  async updateIslandDetails() {
    const selectedIsland = await this.ds.getIslandData(this.island._id);
    const isEditable = true;
    await this.ea.publish('showEditScreen', true);
    this.ea.publish('EditIsland', selectedIsland);
    console.log('Request to edit island ' + selectedIsland.name);

  }

  async deleteIsland() {
    await this.ds.deleteIsland(this.island._id);
    await this.ea.publish('showEditScreen', false);
    this.island = null;
    this.ea.publish('showIslandPanel', false);
  }
}
