import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    doSearch () {
      const q = this.get('q');
      this.transitionToRoute('items', {
        queryParams: { q }
      });
    }
  }
});
