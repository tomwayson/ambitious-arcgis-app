# Authentication

We already installed `torii-provider-arcgis`, but now we will actually configure it.

## Register your app with ArcGIS.com

Sign in at `developers.arcgis.com` and click "Register a New Application".

Give your app a name, tags and a description and click the "Register" button.

The app item will be created in your ArcGIS Org, and the browser will now show information - including the `Client Id`. Copy that, but leave the browser tab open.

In your editor, open `/config/environment.js` and go into the `torii` section and add your key

```
torii: {
  sessionServiceName: 'session',
  providers: {
   'arcgis-oauth-bearer': {
      apiKey: 'YOURCLIENTKEY',
      portalUrl: 'https://www.arcgis.com'
    }
  }
}
```

Now, move to the Authentication tab, and scroll to the bottom. Add `http://localhost` as a redirect uri.

## Adding Sign-In to Our app

First, lets add the markup to the template

```html
<ul class="nav navbar-nav navbar-right">
  {{#if session.isAuthenticated}}
  <li><a href="#" {{action 'signout'}}>Sign Out</a></li>
  {{else}}
  {{#active-link}}<a href="#" {{action 'signin'}}>Sign In</a>{{/active-link}}
  {{/if}}
</ul>
```

Now we need to add the `signin` and `signout` actions to the application route.

Lets generate the route.

```
ember g route Application
```

Since the template already exists, the generator will ask us if we want to overwrite to skip that file - let's skip it. It should generate a `/app/application/route.js` file.

Let's start by just wiring things up...

```
// application/route.js
...
actions: {
  signin () {
    Ember.debug(' do sign in');
  },
  signout () {
    Ember.debug(' do sign out');
  }
}
...
```

Now lets run ember and see how things work. `ember s`, open `http://localhost:4200` in your browser, and open dev tools.

You should see your "Sign In" link in the nav bar. Clicking on it, should add messages to the console.

## Hooking up Sign In
The `torii-provider-arcgis` hides pretty much all the details, but we do need to drop some code into the `signin` action...

```
// application/route.js
...
actions: {
  signin () {
    this.get('session').open('arcgis-oauth-bearer')
      .then((authorization) => {
        Ember.debug('AUTH SUCCESS: ', authorization);
        //transition to some secured route or... so whatever is needed
        this.transitionTo('index');
      })
      .catch((err)=>{
        Ember.debug('AUTH ERROR: ', err);
      });
  },
  signout () {
    Ember.debug(' do sign out');
  }
}
...
```

Now, clicking the "Sign In" link should open a pop-up window. Sign In with valid credentials, and you should see the "Sign Out" link appear, and some debug messages in the console...

```
DEBUG: session.open is returning with data...
vendor.js:16263 DEBUG: torii:adapter:arcgis-oauth-bearer:open got response from portal/self & assigning to session
vendor.js:16263 DEBUG: AUTH SUCCESS:
```

## Hooking up Sign Out
Signing out for apps not on `*arcgis.com` is very straight forward - we just ask torii to close the session.

```
// application/route.js
...
actions: {
  signin () {
    this.get('session').open('arcgis-oauth-bearer')
      .then((authorization) => {
        Ember.debug('AUTH SUCCESS: ', authorization);
        //transition to some secured route or... so whatever is needed
        this.transitionTo('index');
      })
      .catch((err)=>{
        Ember.debug('AUTH ERROR: ', err);
      });
  },
  signout () {
    this.get('session').close();
  }
}
...
```

## Making it Better...

At this point we have basic authentication working and our session has all our ArcGIS Online information and we can call the API etc.

But... the user experience is weak. So lets show the current user in the header and move Sign Out into a dropdown.

### Add Bootstrap JS
To use a dropdown in bootstrap we need the bootstrap javascript. To keep things simple we will pull this from a CDN, but for a production app, you would pull it into the app, and bundle in just the pieces you need.

Open `/app/index.html`, and below the script tag that brings in `ambitious-arcgis-app.js`, add this license

```
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" crossorigin="anonymous"></script>
```

Now, open up `/app/application/template.hbs` and replace the code between `{{#if session.isAuthenticated}}` and `{{else}}` as shown below.

```
{{#if session.isAuthenticated}}
<li class="dropdown">
  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{session.currentUser.fullName}} <span class="caret"></span></a>
  <ul class="dropdown-menu">
    <li><a href="#" {{action 'signout'}}>Sign Out</a></li>
  </ul>
</li>
{{else}}
```

The `session` service is injected into all templates, so we can directly use that in the template `{{session.currentUser.fullName}}` shows... yep, the user's full name.

## Persisting Session
At this point you've likelt gotten sick of having to sign in every time the app refreshs, so lets fix that.

By default, `torii` stores the credentials in `localStorage`, let's look at that. In devtools, on the "Application" tab, click on Local Storage on the left, and click on `http://localhost:4200`. If you are signed in, you will see a key called `torii-provider-arcgis`, with a json object as the value.

So - that is persisted. What we need to do is have Ember read that during it's boot cycle.

The first hook we have in the application life-cycle is the `beforeModel()` hook on the application route. So let's open up `/app/application/route.js` and add that hook...

```
beforeModel () {
  Ember.debug('ApplicationRoute:beforeModel');
}
```

Press save, and the app will re-load and we will see that message in the console.

Since `beforeModel` is a really useful place to run initialization, we don't dump a lot of code directly in this hook. Instead, we will call a helper function.

```
beforeModel () {
  return this._initSession();
},

_initSession () {
  return this.get('session').fetch()
    .then(() => {
      Ember.debug('User has been automatically logged in... ');
    })
    .catch((err) => {
      // we want to catch this, otherwise Ember will redirect to an error route!
      Ember.debug('No cookie was found, user is anonymous... ');
    });
},
```

#### Before Model and Promise Rejection
The call to `session.fetch()` returns a promise, which makes sense because it's an asycn call. The promise will resolve with the authorization payload, or reject because the user is not signed in. Normally, we can force Ember to redirect to an `error` route by rejecting a promise in the `beforeModel` hook. But in this case, we don't want to do that - thus we have a `.catch()`.

# Wrap Up
At this point you should have an app that allows a user to sign in with ArcGIS.com credentials, shows their name in the UI, and allows them to sign out. If the close the browser or refresh the page while signed in, the app will load their saved token information from localStorage and automatically sign them in.
