import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { LeafletMap } from '../../services/leaflet-map';
import { Island } from '../../services/poi-interfaces';
import { Marker } from '../../services/ea-service';
import { IslandService } from "../../services/island-service";

@inject(IslandService, EventAggregator)
export class IslandMap {
  mapId = 'island-map';
  mapHeight = 300;
  map: LeafletMap;

  constructor(private ds: IslandService, private ea: EventAggregator) {
    ea.subscribe('showMarkers', (msg) => {
      this.renderIsland(msg);
    })
  }

  renderIsland (island: Island) {
    if(this.map) {
      //const description  = '<h3>' + island.name + '</h3><button class="ui button au-target" click.delegate = "seeDetails(island._id)">See more...</button>';
      const description  = '<h3>' + island.name + '</h3><button class="ui button au-target" click.delegate = "seeDetails(island._id)">See more...</button>';
      this.map.addMarker(parseFloat(island.latitude), parseFloat(island.longitude), description);
      //this.map.moveTo(6, parseInt(island.latitude), parseInt(island.longitude));
    }
  }

  async seeDetails(id: string) {
    console.log('displaying details of island no. ' + id);
    const selectedIsland = await this.ds.getIslandData(id);
    await this.ea.publish('showIslandPanel', true);
    this.ea.publish('IslandClicked', selectedIsland);
  }

  attached() {
    const mapConfig = {
      latitude: 53.2734,
      longitude: -7.77832,
      zoom: 6,
      minZoom: 4
    };
    this.map = new LeafletMap(this.mapId, mapConfig, 'Terrain');
    this.map.showZoomControl();
  }
}
