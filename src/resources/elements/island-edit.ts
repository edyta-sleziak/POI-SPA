import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { RawIsland, User, Island } from '../../services/poi-interfaces';
import { EventAggregator } from 'aurelia-event-aggregator';
import { IslandService } from "../../services/island-service";

@inject(IslandService, EventAggregator)
export class IslandEdit {
  @bindable
  island: Island;
  user: User;
  isEditable: boolean;

  constructor(private ds: IslandService, private ea: EventAggregator) {
    const data = this.ea.subscribe('EditIsland', response => {
      this.island = response;
    });
  }

  async saveIslandChanges() {
    console.log(this.island)
    await this.ds.editIsland(this.island);
    const selectedIsland = await this.ds.getIslandData(this.island._id);
    this.ea.publish('IslandClicked', selectedIsland);
    this.island = null;
    this.isEditable = false;
  }
  async cancelChanges() {
    this.island = null;
    this.isEditable = false;
  }
}
