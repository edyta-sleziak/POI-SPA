import { bindable } from 'aurelia-framework';
import { Island } from '../../services/poi-interfaces';

export class IslandList {
  @bindable
  islands: Island[];
}
