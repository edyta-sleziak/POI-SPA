import { bindable } from 'aurelia-framework';
import { Island } from '../../services/poi-interfaces';

export class IslandDetails {
  @bindable
  island: Island[];

  constructor () {

  }
}
