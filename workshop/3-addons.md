# Addons

http://www.ember-bootstrap.com/#/getting-started

## Add ember-bootstrap
- stop app (`cmd+C`)
- `ember install ember-bootstrap`
- in app/app.css remove `@import "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";`
- `ember serve` and visit `localhost:4200` and verify that app looks the same
- in app/templates/application.hbs replace navbar with:

```hbs
{{#bs-navbar fluid=true as |navbar|}}
    <div class="navbar-header">
        {{#navbar.toggle}}
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        {{/navbar.toggle}}
       {{#link-to "index" class="navbar-brand"}}Ambitious ArcGIS App{{/link-to}}
    </div>
    {{#navbar.content}}
        {{#navbar.nav as |nav|}}
            {{#nav.item}}{{#link-to "index"}}Home{{/link-to}}{{/nav.item}}
            {{#nav.item}}{{#link-to "items" }}Items{{/link-to}}{{/nav.item}}
        {{/navbar.nav}}
    {{/navbar.content}}
{{/bs-navbar}}
```

## Add ember-arcgis-portal-services

- stop app (`cmd+C`)
- `ember install ember-network`
- follow instructions here: https://github.com/dbouwman/torii-provider-arcgis#usage
- `ember install ember-arcgis-portal-services`
- in config/environment.js add:

```js
torii: {
  sessionServiceName: 'session',
  providers: {
   'arcgis-oauth-bearer': {
      portalUrl: 'https://www.arcgis.com'
    }
  }
}
```

- `ember serve` and visit `localhost:4200`
- in app/items/route.js inject `itemsService` and replace `model()` hook:

```js
  // from ember-arcgis-portal-services
  itemsService: Ember.inject.service('items-service'),

  // the model hook is used to fetch any data based on route parameters
  model (params) {
    const itemsService = this.get('itemsService');
    const q = params.q;
    return itemsService.search({ q });
  }
```
