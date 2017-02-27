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

## Add search form to items page
- `ember generate controller items`
- in app/items/controller.js, add

```js
actions: {
  doSearch (q) {
    // NOTE: don't need to pass route name b/c same route
    this.transitionToRoute('items', {
      queryParams: { q }
    });
  }
}
```

- in app/styles/app.css add:

```css
/* items */
.search-form-inline {
  margin-top: 20px;
}
```

- in app/items/template.hbs replace all with:

```hbs
<div class="row">
  <div class="col-md-9">
    <h2>Your search for "{{q}}" yielded {{model.total}} {{if itemType itemType "items"}}</h2>
  </div>
  <div class="col-md-3">
    {{search-form q=q onSearch=(action "doSearch") class="search-form-inline"}}
  </div>
</div>
```

### Bonus: Component tests test/integration/components/search-form/component-test.js

```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-form', 'Integration | Component | search form', {
  integration: true
});

test('it renders', function(assert) {
  // fail if onSearch callback was not called
  assert.expect(3);

  // Set any properties with this.set('myProperty', 'value');
  this.set('q', 'some initial search text');

  // Handle any actions with this.on('myAction', function(val) { ... });
  this.on('doSearch', (q) => {
    assert.equal(q, 'test', 'updated value was passed up');
  });

  // render component to the page
  this.render(hbs`{{search-form q=q onSearch=(action "doSearch")}}`);

  // inital dom state
  assert.equal(this.$('input').val().trim(), this.get('q'), 'initial value is set');
  assert.equal(this.$('.input-group-lg').length, 0, 'no size by default');

  // change the value and click the search button
  this.$('input').val('test').blur();
  // NOTE: this will trigger onSearch action and above assertion
  this.$('button').click();
});

test('can set size', function (assert) {
  // render component to the page
  this.render(hbs`{{search-form size="lg"}}`);
  assert.equal(this.$('.input-group-lg').length, 1, 'set proper size');
});
```

- `ember t`
