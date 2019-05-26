import { bindable } from 'aurelia-framework';
import { Island } from '../../services/poi-interfaces';
import { IslandService } from "../../services/island-service";
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(IslandService, EventAggregator)
export class IslandList {
  @bindable
  islands: Island[];

  constructor(private ds: IslandService, private ea: EventAggregator) {
    ds.getIslands();
  }

  async seeDetails(id: string) {
    console.log('displaying details of island no. ' + id);
    const selectedIsland = await this.ds.getIslandData(id);
    const category = await this.ds.getCategoryById(selectedIsland.category);
    selectedIsland.categoryName = category.name;
    selectedIsland.addedByName = await this.ds.getUserNameById(selectedIsland.addedBy);
    //selectedIsland.createdDate = 'TODO'; //TODO
    selectedIsland.modifiedByName = await this.ds.getUserNameById(selectedIsland.modifiedBy);
    //selectedIsland.lastModifiedDate = 'TODO'; //TODO
    await this.ea.publish('showIslandPanel', true);
    this.ea.publish('IslandClicked', selectedIsland);
  }
}
