# Deployment

## surge

http://surge.sh/

https://github.com/kiwiupover/ember-cli-surge

- stop app (`cmd+C`)
- `ember install ember-cli-surge`
- `ember generate surge-domain ambitious-arcgis-app-<something-unique>.surge.sh`
- `ember surge` (you will be prompted to create an account)
- visit ambitious-arcgis-app-&lt;something-unique&gt;.surge.sh

## ember-cli-deploy & s3 (demo)

- `ember install ember-cli-deploy`
- `ember install ember-cli-deploy-s3-pack`
- [I already have an s3 account, have created my buckets, have created the .env file, & .gitignored it!]
- config/deploy.js ==>

```js
/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    's3': {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: 'ambitious-arcgis-app',
      region: 'us-east-1'
    },
    's3-index': {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: 'ambitious-arcgis-app-index',
      region: 'us-east-1'
    }
  };

  return ENV;
};
```

- `ember deploy production`
