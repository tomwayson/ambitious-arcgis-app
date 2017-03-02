import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    doSearch (q) {
      this.transitionToRoute('items', {
        // for a new query string, sart on first page
        queryParams: { q , start: 1 }
      });
    }
  }
});
