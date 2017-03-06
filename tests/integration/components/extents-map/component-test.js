import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('extents-map', 'Integration | Component | extents map', {
  integration: true
});

test('it renders', function(assert) {
  const mapService = this.container.lookup('service:map-service');
  const stub = this.stub(mapService, 'newMap');

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{extents-map}}`);

  // assert.equal(this.$().text().trim(), '');
  assert.ok(stub.calledOnce, 'newMap was called once');
});
