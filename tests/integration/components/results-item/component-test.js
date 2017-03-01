import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('results-item', 'Integration | Component | results item', {
  integration: true
});

test('it renders', function(assert) {

  const model = Ember.Object.create({
    title: 'This is the title',
    type: 'Web Map',
    owner: 'username'
  });
  this.set('model', model);

  this.render(hbs`{{results-item model=model}}`);
  assert.equal(this.$('tr td').length, 3, 'renders a tr with 3 tds');
  assert.equal(this.$('tr td:first').text(), 'This is the title', 'renders the title');
  assert.equal(this.$('tr td:nth-child(2)').text(), 'Web Map', 'renders the type');
  assert.equal(this.$('tr td:nth-child(3)').text(), 'username', 'renders the owner');
});
