import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['elements-map'],

  mapService: Ember.inject.service('map-service'),

  // wait until after the component is added to the DOM before creating the map
  didInsertElement () {
    this._super(...arguments);

    // create a map at this element's DOM node
    this.get('mapService').newMap(this.elementId, {
      basemap: 'gray'
    });
  },

  // destroy the map before this component is removed from the DOM
  willDestroyElement () {
    this.get('mapService').destroyMap();
  }
});
