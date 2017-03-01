# Maps

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
    // Specify the type of AMD loader. Either a CDN path or a local loader ('dojo' or 'requirejs')
    // NOTE: not using compact b/c we're loading webmaps and JSAPI will want ALL the modules
    loader: 'https://js.arcgis.com/3.19/',
    // user defined AMD packages to search for in application
    packages: [
      'esri','dojo','dojox','dijit',
      'put-selector','xstyle','dgrid'
    ],
    // Required the AMD configuration file path relative to the project root.
    // The file will be copied to the output directory (./dist) and the configuration file
    // will be loaded before the loader is loaded. The configuration file must define the global variable used by the specific loader.
    // For dojo, the supported global variable name are `dojoConfig`, `djConfig` or `require`.
    // For requirejs, the global variable is called `require`.
    // Please refer to the documentation for the correct use of the configuration object.
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
 .elements-map {
   height: 300px;
   margin-bottom: 20px;
 }
 ```

- `ember serve`
- `ember generate service map-service`
- `ember generate component elements-map`
- replace contents of app/map-service/service.js with

```js
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
```

- replace contents of app/components/extents-map/component.js with:

```js
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
```

- in app/items/template.hbs add `{{extents-map}}` above the table

- go to the items route, you should see a map
