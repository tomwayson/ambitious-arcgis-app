import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['search-form'],

  // use a copy so that we don't immediately update bound URL parameters
  searchCopy: Ember.computed.reads('q'),

  // allow the consuming template to set the input size ('lg' or 'sm')
  sizeClass: Ember.computed('size', function () {
    const size = this.get('size');
    if (size) {
      return `input-group-${size}`;
    } else {
      return '';
    }
  }),

  actions: {
    doSearch () {
      // calling template passed in an 'onSearch' function,
      // call it and pass the input's value
      if (this.onSearch) {
        this.onSearch(this.get('searchCopy'));
      }
    }
  }
});
