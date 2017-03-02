/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var env = EmberApp.env() || 'development';

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    fingerprint: {
      enabled: env === 'production',
      prepend: 'http://ambitious-arcgis-app.s3-website-us-east-1.amazonaws.com/'
    },
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

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
