
# NW.js update sample
This prototype should show how to update desktop (web) apps, that are built with NW.js and node-webkit-updater



Install dependencies

```
$ npm i
```

Install live-server

```
$ npm i -g live-server
```

Start the server that should be used to provide new versions of the current application.
```
$ live-server --port=3000 distribution
```

Build and publish a new version:

```
# Publish the application with given major version
$ gulp publish:vnext --version=3
```

Build and publish a new version

```
# Publish an update with given major version
$ gulp publish:vnext --version=5
```

Start the initial app and execute the auto update.

```
# OSX
$ open initial/app/osx64/app.app
```
