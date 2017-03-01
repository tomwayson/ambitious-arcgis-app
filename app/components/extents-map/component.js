import Ember from 'ember';
import config from '../../config/environment';
import coordsToExtent from '../../utils/map/coords-to-extent';

export default Ember.Component.extend({
  classNames: ['elements-map'],

  mapService: Ember.inject.service('map-service'),

  // wait until after the component is added to the DOM before creating the map
  didInsertElement () {
    this._super(...arguments);
    const mapService = this.get('mapService');
    // create a map at this element's DOM node
    mapService.newMap(this.elementId, config.APP.map.options);
    // show item extents once map loads
    mapService.on('load', this, this.showItemsOnMap);
  },

  // whenever items change, update the map
  didUpdateAttrs () {
    this.showItemsOnMap();
  },

  // show new item extents on map
  showItemsOnMap () {
    const { symbol, infoTemplate } = config.APP.map.itemExtents;
    const jsonGraphics = this.get('items').map(item => {
      const geometry = coordsToExtent(item.extent);
      return { geometry, symbol, attributes: item, infoTemplate };
    });
    this.get('mapService').refreshGraphics(jsonGraphics);
  },

  // destroy the map before this component is removed from the DOM
  willDestroyElement () {
    this._super(...arguments);
    const mapService = this.get('mapService');
    mapService.destroyMap();
    mapService.off('load', this, this.showItemsOnMap);
  }
});
