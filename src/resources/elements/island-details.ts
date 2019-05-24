import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { Island, User, RawIsland } from '../../services/poi-interfaces';
import { IslandService } from "../../services/island-service";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(IslandService, EventAggregator)
export class IslandDetails {
  @bindable
  island: Island;
  user: User;

  constructor(private ds: IslandService, private ea: EventAggregator) {
    this.getIslandData();
  }

  async getIslandData() {
    const data = this.ea.subscribe('IslandClicked', response => {
      this.island = response;
    });
  }

  async updateIslandDetails() {
    const selectedIsland = await this.ds.getIslandData(this.island._id);
    const isEditable = true;
    this.ea.publish('EditIsland', selectedIsland);
    this.ea.publish('showEditScreen', true);
    console.log('Request to edit island ' + selectedIsland.name);

  }

  async deleteIsland() {
    await this.ds.deleteIsland(this.island._id);
    this.ea.publish('showEditScreen', false);
    this.island = null;
    this.ea.publish('showIslandPanel', false);
  }
}
