import Ember from 'ember';
import Map from 'esri/map';
import Graphic from 'esri/graphic';
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import Extent from 'esri/geometry/Extent';
import SpatialReference from 'esri/SpatialReference';

function extentFromCoordinateArray (coords) {
  if (coords && coords.length === 2) {
    return new Extent(
      coords[0][0],
      coords[0][1],
      coords[1][0],
      coords[1][1],
      new SpatialReference({ wkid: 4326 })
    );
  }
}

// NOTE: extend Ember's Evented to relay map events
export default Ember.Service.extend(Ember.Evented, {
  // create a new map object at an element
  // and hold on to the reference for later operations
  newMap(element, options) {
    this._map = new Map(element, options);
    const loadHandler = this._map.on('load', () => {
      loadHandler.remove();
      // not a full-screen map, let user scroll down page
      this._map.disableScrollWheelZoom();
      // let the rest of the app know that the map is available
      this.trigger('load');
    });
  },

  // show the items on the map
  showItemsOnMap (items) {
    const map = this._map;
    if (!map) {
      return;
    }

    // clear any existing graphics
    map.graphics.clear();

    // convert items to graphics and add to map's graphic layer
    if (!items || items.length === 0) {
      return;
    }
    items.forEach(item => {
      const graphic = this.itemToGraphic(item);
      map.graphics.add(graphic);
    });
  },

  itemToGraphic (item) {
    const symbol = new SimpleFillSymbol();
    const geometry = extentFromCoordinateArray(item.extent);
    return new Graphic(geometry, symbol);
  },

  // destroy the map if it was already created
  destroyMap() {
    if (this._map) {
      this._map.destroy();
    }
  }
});
