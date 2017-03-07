import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('extents-map', 'Integration | Component | extents map', {
  integration: true
});

test('it renders', function(assert) {
  // stub newMap to prevent map from being created
  const mapService = this.container.lookup('service:map-service');
  const stub = this.stub(mapService, 'newMap', () => {
    // simulate the map having been loaded
    mapService.trigger('load');
  });
  // capture the extents passed in, and don't add the to (non-existent) map
  const refreshGraphicsStub = this.stub(mapService, 'refreshGraphics');
  // dummy items we'll use for testing
  const items = [{
      "title": "Mandatory Water Restrictions",
      "snippet": "This map shows the area where there are active mandatory water restrictions placed by WSSC",
      "extent": [
          [-78.3657, 38.191],
          [-75.8993, 39.6927]
      ]
  }, {
      "title": "Broward County Water Services",
      "snippet": "A map of the Water Control Districts, Water Service Areas, and Sewer Service Areas Contacts",
      "extent": []
  }];

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('items', items);

  this.render(hbs`{{extents-map items=items}}`);

  // update the items to triggr a second call to refreshGraphics
  this.set('items', [{
      "title": "Canterbury Land and Water Regional Plan",
      "snippet": "Canterbury Land and Water Regional Plan map layers.",
      "extent": [
          [170.1402, -44.3006],
          [173.8127, -42.7658]
      ]
  }]);

  // get the extents that were passed into refreshGraphics
  const initialExtents = refreshGraphicsStub.getCall(0).args[0];
  const updatedExtents = refreshGraphicsStub.getCall(1).args[0];

  // assertions
  assert.ok(stub.calledOnce, 'newMap was called once');
  assert.equal(initialExtents.length, 2, 'got expected initial extents');
  assert.equal(updatedExtents.length, 1, 'got expected updated extents');
});
