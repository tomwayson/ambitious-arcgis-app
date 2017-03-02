import Ember from 'ember';

export default Ember.Controller.extend({
  // query parameters used by components
  queryParams: ['start', 'num'],
  start: 1,
  num: 10,

  // NOTE: don't need to pass route name b/c same route
  actions: {
    doSearch (q) {
      this.transitionToRoute({
        // for a new query string, sart on first page
        queryParams: { q , start: 1 }
      });
    }
  }
});
