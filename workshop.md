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
