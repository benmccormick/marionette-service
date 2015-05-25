# Marionette Service
[![Travis build status](http://img.shields.io/travis/benmccormick/marionette-service.svg?style=flat)](https://travis-ci.org/benmccormick/marionette-service)
[![Code Climate](https://codeclimate.com/github/benmccormick/marionette-service/badges/gpa.svg)](https://codeclimate.com/github/benmccormick/marionette-service)
[![Test Coverage](https://codeclimate.com/github/benmccormick/marionette-service/badges/coverage.svg)](https://codeclimate.com/github/benmccormick/marionette-service)

This is a library to add "Service Objects" to Marionette 2.1.x.  Service Objects are an extension of Marionette.Object that
allows declarative interaction with Backbone.Radio messages. Service Objects can respond to any of Radio's three message types; `Events`, `Commands` and `Requests`.  The syntax is similar to the `events` syntax from Backbone Views, and looks like this:

```js
radioEvents: {
  'app start': 'onAppStart',
  'books finish': 'onBooksFinish',
},

radioCommands: {
  'app doFoo': 'executeFoo',
},

radioRequests: {
  'resources bar': 'getBar',
},
```

where each hash value is in the form `'channel eventName' : 'handler'`.  So

```js
radioCommands: {
  'app doFoo': 'executeFoo',
},
```

means that the Service will listen for the `doFoo` command on the `app` channel, and run the 'executeFoo' method.  When using Radio Commands and Requests with Objects, the same rules and restrictions that normal Radio use implies also apply here: a single handler can be associated with a command or request, either through manual use of the comply or reply functions, or through the Service API.

## Installation via Package Manager

### npm

`npm install marionette-service`

### bower

`bower install marionette-service`


## Questions

### Wouldn't this be a good fit for Marionette Core?

There is a [PR](https://github.com/marionettejs/backbone.marionette/pull/2431) to include this feature in Marionette v3.0.0.  This library is
intended as a way to use the feature in 2.1+ apps without having to wait for 3.0.

### Why add a separate Service class instead of shimming the future behavior on Mn.Object?

Marionette 3.0 isn't finalized yet.  APIs may change in the meantime.  I don't want updating to 3.0 to break any existing service code.  If the API does change I will try to track it with this library, but will do so in a semver fashion.  Assuming that the API does remain stable, upgrading to the core code will consist of renaming all `Service` objects to `Object` and removing this dependency.
