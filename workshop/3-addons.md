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
