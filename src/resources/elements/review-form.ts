import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { Island, Review } from '../../services/poi-interfaces';
import { IslandService } from "../../services/island-service";

@inject(IslandService)
export class ReviewForm {
  reviewTest: string;
  @bindable
  islands: Island[];
  review: Review[];

  constructor (private ds: IslandService) {}

  async addReview() {
    await this.ds.addReview(this.reviewTest);
  }
}
