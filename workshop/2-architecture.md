# Architecture

## Refactor search form into a component
- `ember generate component search-form`
- app/components/search-form/template.hbs

```hbs
<form {{action "doSearch" on="submit"}}>
  <div class="input-group {{sizeClass}}">
    {{input class="form-control" placeholder="search for items" value=searchCopy}}
    <span class="input-group-btn">
      <button class="btn btn-default" type="submit">
        <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
      </button>
    </span>
  </div>
</form>
```

NOTE: `searchCopy` and `sizeClass`

- app/components/search-form/component.js

```js
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
```

- replace `<form>` tag in app/index/template.hbs with:

```hbs
{{search-form q=q onSearch=(action "doSearch") size="lg"}}
```

- replace `doSearch` action in app/index/controller.js

```js
doSearch (q) {
  this.transitionToRoute('items', {
    queryParams: { q }
  });
}
```

App should look/work the same.
