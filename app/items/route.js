import Ember from 'ember';

export default Ember.Route.extend({
  // from ember-arcgis-portal-services
  itemsService: Ember.inject.service('items-service'),

  // changes to these query parameter will cause this route to
  // update the model by calling the "model()" hook again
  queryParams: {
    // paging query params
    start: { refreshModel: true },
    num: { refreshModel: true },
    q: { refreshModel: true }
  },

  // the model hook is used to fetch any data based on route parameters
  model (params) {
    const itemsService = this.get('itemsService');
    const q = params.q || '*';
    return itemsService.search({ q, num: params.num, start: params.start });
  }
});
