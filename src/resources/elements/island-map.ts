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
    ea.subscribe(Marker, msg => {
      this.renderIsland(msg.island);
    })
  }

  renderIsland (island: Island) {
    if(this.map) {
      const description  = '${island.name}';
      this.map.addMarker(parseInt(island.latitude), parseInt(island.longitude), description);
      this.map.moveTo(12, parseInt(island.latitude), parseInt(island.longitude) );
    }
  }

  attached() {
    const mapConfig = {
      latitude: 53.2734,
      longitude: -7.77832,
      zoom: 5,
      minZoom: 7
    };
    this.map = new LeafletMap(this.mapId, mapConfig, 'Terrain');
    this.map.showZoomControl();
  }
}
