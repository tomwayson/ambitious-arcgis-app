import mapCoordsToExtent from 'ambitious-arcgis-app/utils/map/coords-to-extent';
import { module, test } from 'qunit';

module('Unit | Utility | map/coords to extent');

test('it works', function(assert) {
  const coords = [[-53.2316, -79.8433], [180, 79.8433]];
  let result = mapCoordsToExtent(coords);
  assert.deepEqual(result, {
    xmin: -53.2316,
    ymin: -79.8433,
    xmax: 180,
    ymax: 79.8433,
    spatialReference:{
      wkid:4326
    }
  });
});

test('it handles invalid coords', function(assert) {
  let result = mapCoordsToExtent([]);
  assert.equal(result, undefined);
});
