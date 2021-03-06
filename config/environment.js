/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ambitious-arcgis-app',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
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
    },

    torii: {
      sessionServiceName: 'session',
      providers: {
       'arcgis-oauth-bearer': {
          apiKey: 'zIk2rdJoN5veTL4x',
          portalUrl: 'https://www.arcgis.com'
        }
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.torii.providers['arcgis-oauth-bearer'].apiKey = 'YOUR-CLIENT-ID-TIED-TO-YOUR-REDIRECT-URI'
  }

  return ENV;
};
