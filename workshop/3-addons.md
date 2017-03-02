# Addons

http://www.ember-bootstrap.com/ has most bootstrap components, but we only need active class for links, so we'll use https://github.com/alexspeller/ember-cli-active-link-wrapper

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
- search enter search terms and see real results!

Only getting 10 though, so let's add paging

## Add paging components from ember-arcgis-opendata-components
- stop app (`cmd+C`)
- `ember install ember-arcgis-opendata-components`
- in app/items/route.js
 - add these query paramters above the `q` param:

```js
// paging query params
start: { refreshModel: true },
num: { refreshModel: true },
```

 - then update query() call as follows:

```js
return itemsService.search({ q, num: params.num, start: params.start });
```

- in app/items/controller.js add this to the top of the controller:

```js
// query parameters used by components
queryParams: ['start', 'num'],
start: 1,
num: 10,
```

- then below in `transitionToRoute()` update the query as follows:

```js
// for a new query string, sart on first page
queryParams: { q , start: 1 }
```

- do the same in app/index/controller.js

- in app/items/template.hbs add this below the table:

```hbs
{{item-list-pager model=model num=num}}
```

- return to the app and start paging through records
