import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    doSearch (q) {
      this.transitionToRoute('items', {
        queryParams: { q }
      });
    }
  }
});
