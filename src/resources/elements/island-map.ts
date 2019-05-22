import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { LeafletMap } from '../../services/leaflet-map';
import { Island } from '../../services/poi-interfaces';
import { Marker } from '../../services/ea-service';

@inject(EventAggregator)
export class IslandMap {
  mapId = 'island-map';
  mapHeight = 300;
  map: LeafletMap;

  constructor(private ea: EventAggregator) {
    ea.subscribe('showMarkers', (msg) => {
      this.renderIsland(msg);
    })
  }

  renderIsland (island: Island) {
    if(this.map) {
      const description  = island.name;
      this.map.addMarker(parseFloat(island.latitude), parseFloat(island.longitude), description);
      //this.map.moveTo(6, parseInt(island.latitude), parseInt(island.longitude));
    }
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
