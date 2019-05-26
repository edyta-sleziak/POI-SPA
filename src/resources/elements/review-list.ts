import { bindable } from 'aurelia-framework';
import { Review } from '../../services/poi-interfaces';
import { IslandService } from "../../services/island-service";
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(IslandService, EventAggregator)
export class ReviewList {
  @bindable
  reviews: Review[];

  constructor(private ds: IslandService, private ea: EventAggregator) {
    this.getData();
  }

  async getData() {
    this.ea.subscribe('IslandClicked', response => {
      this.reviews = this.ds.reviews;
    });
  }

}
