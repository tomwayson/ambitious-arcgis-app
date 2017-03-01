import { test } from 'qunit';
import moduleForAcceptance from 'ambitious-arcgis-app/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | smoke test');

test('smoke-test', function(assert) {
  visit('/');

  andThen(function () {
    assert.equal(currentURL(), '/');
  });

  fillIn('form .input-group input', 'water');
  click('form .input-group button');

  andThen(function () {
    assert.equal(currentURL(), '/items?q=water');
    assert.equal(find('table tbody tr').length, 10);
    assert.ok(find('nav.item-list-pager li').length);
  });
});
