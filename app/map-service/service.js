import Ember from 'ember';
import Map from 'esri/map';
import Graphic from 'esri/graphic';

// NOTE: using Evented mixin to relay map events
export default Ember.Service.extend(Ember.Evented, {
  // create a new map object at an element
  newMap(element, options) {
    // hold on to the reference for later operations
    this._map = new Map(element, options);
    // and relay the map's load event to caller
    const loadHandler = this._map.on('load', () => {
      loadHandler.remove();
      // not a full-screen map, let user scroll down the page
      this._map.disableScrollWheelZoom();
      // let the rest of the app know that the map is available
      this.trigger('load');
    });
  },

  // clear and add graphics to the map
  refreshGraphics (jsonGraphics) {
    const map = this._map;
    if (!map || !map.loaded) {
      return;
    }
    // clear any existing graphics
    map.graphics.clear();
    // convert json to graphics and add to map's graphic layer
    if (!jsonGraphics || jsonGraphics.length === 0) {
      return;
    }
    jsonGraphics.forEach(jsonGraphic => {
      map.graphics.add(new Graphic(jsonGraphic));
    });
  },

  // destroy the map if it was already created
  destroyMap() {
    if (this._map) {
      this._map.destroy();
      delete this._map;
    }
  }
});
