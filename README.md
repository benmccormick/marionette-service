# Marionette Service
[![Travis build status](http://img.shields.io/travis/benmccormick/marionette-service.svg?style=flat)](https://travis-ci.org/benmccormick/marionette-service)
[![Code Climate](https://codeclimate.com/github/benmccormick/marionette-service/badges/gpa.svg)](https://codeclimate.com/github/benmccormick/marionette-service)
[![Test Coverage](https://codeclimate.com/github/benmccormick/marionette-service/badges/coverage.svg)](https://codeclimate.com/github/benmccormick/marionette-service)


### CHANGE FOR 1.0.0

*With the 1.0.0 release, this library has been updated to be based off of Backbone.Model rather than Marionette to minimize the dependencies, and allow for the user of service objects without pulling in all of Marionette.*


This is a library to add "Service Objects" to Marionette 2.1+.  Service Objects are an extension of Backbone.Model that
allows declarative interaction with Backbone.Radio messages. Service Objects can respond to both of Radio's message types; `Events` and `Requests`.  The syntax is similar to the `events` syntax from Backbone Views, and looks like this:

```js
radioEvents: {
  'app start': 'onAppStart',
  'books finish': 'onBooksFinish',
},


radioRequests: {
  'resources bar': 'getBar',
},
```

where each hash value is in the form `'channel eventName' : 'handler'`.  So

```js
radioRequests: {
  'app doFoo': 'executeFoo',
},
```

means that the Service will listen for the `doFoo` command on the `app` channel, and run the 'executeFoo' method.  When using Radio Requests with Objects, the same rules and restrictions that normal Radio use implies also apply here: a single handler can be associated with a request, either through manual use of the reply functions, or through the Service API.

## Installation via Package Manager

### npm

`npm install marionette-service`

### bower

`bower install marionette-service`


## Questions

### Wouldn't this be a good fit for Marionette Core?

This feature will be included as part of Marionette.Object  in Marionette v3.0.0.  This library is
intended as a way to use the feature in 2.1+ apps without having to wait for 3.0.

### Why add a separate Service class instead of shimming the future behavior on Mn.Object?

Marionette 3.0 isn't finalized yet.  APIs may change in the meantime.  I don't want updating to 3.0 to break any existing service code.  If the API does change I will try to track it with this library, but will do so in a semver fashion.  Assuming that the API does remain stable, upgrading to the core code will consist of renaming all `Service` objects to `Object` and removing this dependency.
