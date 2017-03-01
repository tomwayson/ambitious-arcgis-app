import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['elements-map'],

  mapService: Ember.inject.service('map-service'),

  // wait until after the component is added to the DOM before creating the map
  didInsertElement () {
    this._super(...arguments);
    const mapService = this.get('mapService');

    // create a map at this element's DOM node
    mapService.newMap(this.elementId, {
      basemap: 'gray'
    });

    // show item extents on map
    mapService.showItemsOnMap(this.get('items'));
  },

  didUpdateAttrs () {
    // show new item extents on map
    this.get('mapService').showItemsOnMap(this.get('items'));
  },

  // destroy the map before this component is removed from the DOM
  willDestroyElement () {
    this.get('mapService').destroyMap();
  }
});
