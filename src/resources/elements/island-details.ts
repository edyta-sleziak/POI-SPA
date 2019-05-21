import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { Island, User } from '../../services/poi-interfaces';
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
    //await this.ds.editIsland(this.island);
    console.log('Island updated');
  }

  async deleteIsland() {
    //await this.ds.deleteIsland(this.island);
    console.log('deleting island');
  }
}
