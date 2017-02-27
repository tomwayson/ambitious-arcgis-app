# Building an Application

## Scaffold the application

Open a terminal to the root folder where you keep your projects and enter:
```shell
ember new ambitious-arcgis-app
cd ambitious-arcgis-app
ember serve
```

Open a browser to http://localhost:4200/

Open IDE of choice to ambitious-arcgis-app folder
- open app/styles/app.css and add

```css
@import "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";

body {
  padding-top: 20px;
  padding-bottom: 20px;
}

.navbar {
  margin-bottom: 20px;
}
```
- open app/templates/application.hbs replace `{{welcome-page}}` with:

```hbs
<div class="container">

  <!-- navbar -->
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <span class="navbar-brand">Ambitious ArcGIS App</span>
      </div>
    </div><!--/.container-fluid -->
  </nav>

  <!-- page content -->
  {{outlet}}

</div> <!-- /container -->
```

## Scaffold some routes

About Routes / Controllers / Templates

### Add items route
- set `"usePods": true` in .ember-cli
- `ember generate route items`
- open app/items/route.js and add:

```js
import Ember from 'ember';

export default Ember.Route.extend({
  // changes to these query parameter will cause this route to
  // update the model by calling the "model()" hook again
  queryParams: {
    q: {
      refreshModel: true
    },
    itemType: {
      refreshModel: true,
      as: 'type'
    }
  },

  // the model hook is used to fetch any data based on route parameters
  model (/* params */) {
    // TODO: search for items using the search term and item type
    return {
      total: 0,
      results: []
    };
  }
});
```

- open app/items/template.hbs and add:

```hbs
<h2>Your search for "{{q}}" yielded {{model.total}} {{if itemType itemType "items"}}</h2>
```

- visit http://localhost:4200/items?q=test and http://localhost:4200/items?q=test&type=maps

### Add index route
- `ember generate route index`
- Download https://livingatlas.arcgis.com/assets/img/background-banners/Banner9.jpg and save at /public/assets/images/Banner9.jpg
- open app/styles/app.css and add:

```css
/* index */
.jumbotron-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(./images/Banner9.jpg) center top/cover no-repeat;
}
.jumbotron-hero h1 {
  color:#fff;
  text-shadow: 0 3px 2px rgba(0,0,0,0.75);
  text-align: center;
  padding-bottom: 40px;
  border-bottom: 1px solid #fff;
  margin-bottom: 40px;
}
```

- open app/index/template.hbs and add

```hbs
<!-- Main component for a primary marketing message or call to action -->
<div class="jumbotron jumbotron-hero">
  <h1>Ambitious ArcGIS App</h1>
  <form {{action "doSearch" on="submit"}}>
    <div class="input-group input-group-lg">
      {{input class="form-control" placeholder="search for items" value=q}}
      <span class="input-group-btn">
        <button class="btn btn-default" type="submit">
          <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
        </button>
      </span>
    </div>
  </form>
</div>
```

- open up app/templates/application.hbs and add the following immediately above this line: `</div><!--/.container-fluid -->`:

```hbs
<ul class="nav navbar-nav">
  <li>{{#link-to "index" }}Home{{/link-to}}</li>
  <li>{{#link-to "items" }}Items{{/link-to}}</li>
</ul>
```

- click on the home link and enter search terms
