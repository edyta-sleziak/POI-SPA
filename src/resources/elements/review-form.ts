import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { Island, Review } from '../../services/poi-interfaces';
import { IslandService } from "../../services/island-service";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(IslandService, EventAggregator)
export class ReviewForm {
  @bindable
  island: Island;
  reviewText: string;

  constructor(private ds: IslandService, private ea: EventAggregator) {
    this.getIslandData();
  }

  async getIslandData() {
    const data = await this.ea.subscribe('IslandClicked', response => {
      this.island = response;
    });
  }

  async addReview() {
    await this.ds.addReview(this.reviewText, this.island._id);
    this.reviewText = '';
  }
}
