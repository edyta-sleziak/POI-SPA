import { inject } from 'aurelia-framework';
import { Island, Category } from '../services/poi-interfaces';
import { IslandService } from '../services/island-service';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(IslandService, EventAggregator)
export class Islands {
  islands: Island[];
  isEditable: boolean;
  isVisible: boolean;

  constructor(private ds: IslandService, private ea: EventAggregator) {
    this.islands = ds.islands;
    const editInfo = this.ea.subscribe('showEditScreen', response => {
      this.isEditable = response;
    });
    const visibilityInfo = this.ea.subscribe('showIslandPanel', response => {
      this.isVisible = response;
    });
  }


}
