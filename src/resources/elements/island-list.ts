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
  }

  async seeDetails(id: string) {
    console.log('displaying details of island no. ' + id);
    const selectedIsland = await this.ds.getIslandData(id);
    this.ea.publish('IslandClicked', selectedIsland);
  }
}
