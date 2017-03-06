# Maps

## Adding a basic map using ember-cli-amd

- `ember install ember-cli-amd`
- configure as per https://github.com/Esri/ember-cli-amd#usage
- add config/dojo-config.js with:

```js
window.dojoConfig = {
  async: true
};
```

- open ember-cli-build.js and replace `var app = new EmberApp...` with:

```js
var app = new EmberApp(defaults, {
  amd : {
    // only need basic mapping capabilities, so use compact
    loader: 'https://js.arcgis.com/3.19compact/',
    // user defined AMD packages to search for in application
    packages: [
      'esri','dojo','dojox','dijit',
      'put-selector','xstyle','dgrid'
    ],
    configPath: 'config/dojo-config.js'
  }
});
```

- in app/styes/app.css
 - add the following between the bootstrap and app styles:
```css
/* esri styles */
@import url('https://js.arcgis.com/3.19/esri/css/esri.css');
```
 - and add the following at the end:

 ```css
 /* map */
 .extents-map {
   height: 300px;
   margin-bottom: 20px;
 }
 ```

- `ember serve`
- `ember generate service map-service`
- `ember generate component extents-map`
- `rm app/components/extents-map/template.hbs`
- replace contents of app/map-service/service.js with

```js
import Ember from 'ember';
import Map from 'esri/map';

export default Ember.Service.extend({
  // create a new map object at an element
  newMap(element, options) {
    // hold on to the reference for later operations
    this._map = new Map(element, options);
  },

  // destroy the map if it was already created
  destroyMap() {
    if (this._map) {
      this._map.destroy();
      delete this._map;
    }
  }
});
```

- replace contents of app/components/extents-map/component.js with:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['extents-map'],

  mapService: Ember.inject.service('map-service'),

  // wait until after the component is added to the DOM before creating the map
  didInsertElement () {
    this._super(...arguments);
    // create a map at this element's DOM node
    const mapService = this.get('mapService');
    mapService.newMap(this.elementId, { basemap: 'gray' });
  },

  // destroy the map before this component is removed from the DOM
  willDestroyElement () {
    this._super(...arguments);
    const mapService = this.get('mapService');
    mapService.destroyMap();
  }
});
```

- in app/items/template.hbs add `{{extents-map}}` above the table

- go to the items route, you should see a map

### Bonus - map component test

Goal: stub the map service so we don't create a map when testing

- `ember install ember-sinon-qunit`
- run `ember test - s` and filter for "integration"
- open network tab of test browser and filter for "arcgisonline.com"
- in tests/integration/component/extents-map/component-test.js replace `import { moduleForComponent, test } from 'ember-qunit';` with:

```js
import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
```

- replace the contents of the 'it renders' test with:

```js
// stub the newMap() function so that a map is not constructed
const mapService = this.container.lookup('service:map-service');
const stub = this.stub(mapService, 'newMap');

// Set any properties with this.set('myProperty', 'value');
// Handle any actions with this.on('myAction', function(val) { ... });

this.render(hbs`{{extents-map}}`);

// assert.equal(this.$().text().trim(), '');
assert.ok(stub.calledOnce, 'newMap was called once');
```

- network tab should no longer show "arcgisonline.com" requests

## Showing item extents on the map

### Logic
Once the map has loaded, and whenever map component's items are updated:
- clear map graphics
- loop through items, and for each
 - create a `new Graphic()` from the item
 - add the graphic to the map

2 sets of async state: Application (Ember) and map:
- each has own lifecyle (event)
- up to developer to keep 2 sets of state in sync.

Converting item to a  [Graphic](https://developers.arcgis.com/javascript/3/jsapi/graphic-amd.html#graphic2):
- get `geometry` by converting item `extent` from coordinate array to extent JSON
- get `attributes` from item `title` and `snippet`
- get `infoTemplate` and `symbol` from config

### Add configuration parameters
- stop app (`cmd+C`)
- in config/environment.js add this to `APP`:

```js
map: {
  options: {
    basemap: 'gray',
    smartNavigation: false
  },
  itemExtents: {
    symbol: {
      color: [51, 122, 183, 64],
      outline: {
        color: [51, 122, 183, 255],
        width: 1,
        type: 'esriSLS',
        style: 'esriSLSSolid'
      },
      type: 'esriSFS',
      style: 'esriSFSSolid'
    },
    infoTemplate: {
      title: '${title}',
      content: '${snippet}'
    }
  }
}
```

### Add a utility function to transform extent

- `ember generate util map/coords-to-extent`

- run tests w/ `ember test -s`

- in tests/unit/utils/map/coords-to-extent.js replace `test` with:

```js
test('it works', function(assert) {
  const coords = [[-53.2316, -79.8433], [180, 79.8433]];
  let result = mapCoordsToExtent(coords);
  assert.deepEqual(result, {
    xmin: -53.2316,
    ymin: -79.8433,
    xmax: 180,
    ymax: 79.8433,
    spatialReference:{
      wkid:4326
    }
  });
});

test('it handles invalid coords', function(assert) {
  let result = mapCoordsToExtent([]);
  assert.equal(result, undefined);
});
```

- replace app/utils/map/coords-to-extent.js content with:

```js
// expect [[-53.2316, -79.8433], [180, 79.8433]] or []
export default function mapCoordsToExtent (coords) {
  if (coords && coords.length === 2) {
    return {
      xmin: coords[0][0],
      ymin: coords[0][1],
      xmax: coords[1][0],
      ymax: coords[1][1],
      spatialReference:{
        wkid:4326
      }
    };
  }
}
```

 - stop tests and run `ember s`

### Update the map service

- in app/map-service/service.js add:

```
import Graphic from 'esri/graphic';

// NOTE: using Evented mixin to relay map events
export default Ember.Service.extend(Ember.Evented, {
```

- then to the bottom of `newMap` add:

```js
// and relay the map's load event to caller
const loadHandler = this._map.on('load', () => {
  loadHandler.remove();
  // not a full-screen map, let user scroll down the page
  this._map.disableScrollWheelZoom();
  // let the rest of the app know that the map is available
  this.trigger('load');
});
```

- then add this method:

```js
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
```

### Update map component

- in app/components/extents-map/component.js add these `import` statements

```js
import config from '../../config/environment';
import coordsToExtent from '../../utils/map/coords-to-extent';
```

- then add this method:

```js
// show new item extents on map
showItemsOnMap () {
  const { symbol, infoTemplate } = config.APP.map.itemExtents;
  const jsonGraphics = this.get('items').map(item => {
    const geometry = coordsToExtent(item.extent);
    return { geometry, symbol, attributes: item, infoTemplate };
  });
  this.get('mapService').refreshGraphics(jsonGraphics);
},
```

- then update contents of `didInsertElement()` to:

```js
this._super(...arguments);
const mapService = this.get('mapService');
// create a map at this element's DOM node
mapService.newMap(this.elementId, config.APP.map.options);
// show item extents once map loads
mapService.on('load', this, this.showItemsOnMap);
```

- in app/items/template.hbs update the `extents-map` invocation to `{{extents-map items=model.results}}`

- visit the items route and see the extents on the map
- but they don't update when you change the query, or page, so
- back in app/components/extents-map/component.js add this method:

```js
// whenever items change, update the map
didUpdateAttrs () {
  this.showItemsOnMap();
},
```

- see the extents on the map change when you change query/page
