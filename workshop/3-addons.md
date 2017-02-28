# Addons

https://github.com/alexspeller/ember-cli-active-link-wrapper

## Add ember-cli-active-link-wrapper
- stop app (`cmd+C`)
- `ember install ember-cli-active-link-wrapper`
- in app/application/template.hbs replace the ul.nav.navbar-nav with:

```hbs
<ul class="nav navbar-nav">
  {{#active-link}}
    {{link-to "Home" "index"}}
  {{/active-link}}
  {{#active-link}}
    {{link-to "Items" "items"}}
  {{/active-link}}
</ul>
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

- remove fake implementation of itemsService:
`ember destroy service items-service`

- `ember serve` and visit `localhost:4200`
