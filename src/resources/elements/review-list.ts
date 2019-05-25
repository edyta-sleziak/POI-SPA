import { bindable } from 'aurelia-framework';
import { Island , Review} from '../../services/poi-interfaces';
import { IslandService } from "../../services/island-service";
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(IslandService, EventAggregator)
export class IslandList {
  @bindable
  reviews: Review[];
  island: Island;

  constructor(private ds: IslandService, private ea: EventAggregator) {
    this.ea.subscribe('IslandClicked', response => {
      this.island = response;
    });
    this.getData();

  }

  async getData() {
    const data = await this.ds.getReviews(this.island._id);
    this.reviews = data;
  }

}
