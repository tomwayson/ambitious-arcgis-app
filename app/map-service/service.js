import Ember from 'ember';
import Map from 'esri/map';

export default Ember.Service.extend({
  // create a new map object at an element and hold on to the reference
  newMap(element, options) {
    this._map = new Map(element, options);
  },

  // destroy the map if it was already created
  destroyMap() {
    if (this._map) {
      this._map.destroy();
    }
  }
});
