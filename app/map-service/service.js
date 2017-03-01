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

export default Ember.Service.extend({
  // create a new map object at an element and hold on to the reference
  newMap(element, options) {
    this._map = new Map(element, options);
  },

  // show the items on the map
  showItemsOnMap (items) {
    const map = this._map;
    if (!map) {
      return;
    }

    if (map.loaded) {
      this._showItemsOnMap(items);
    } else {
      const loadHandler = map.on('load', () => {
        Ember.run.next(this, '_showItemsOnMap', items);
        loadHandler.remove();
      });
    }
  },

  _showItemsOnMap (items) {
    const map = this._map;

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
