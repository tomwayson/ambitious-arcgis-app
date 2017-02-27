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
