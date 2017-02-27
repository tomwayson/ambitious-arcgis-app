import Ember from 'ember';

export default Ember.Controller.extend({
  // NOTE: don't need to pass route name b/c same route
  actions: {
    doSearch (q) {
      this.transitionToRoute({
        queryParams: { q }
      });
    }
  }
});
