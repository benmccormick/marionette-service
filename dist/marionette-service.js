/**
 * Marionette Service
 *
 * Adds a Service Object to Marionette which allows an Object to
 * receive Backbone.Radio messages in a declarative fashion.
 *
 * @author Ben McCormick
 *
 */
/* global define:false, require:false, module:false */
(function(global, factory) {
  'use strict';
  if(typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('backbone'), require('backbone.radio'), require('underscore')); //jshint ignore:line
  } else if(typeof define === 'function' && define.amd) {
   define(['backbone', 'backbone.radio', 'underscore'], factory);
  } else {
   factory(global.Backbone, global.Backbone.Radio, global._);
  }
})(this, function (Backbone, Radio, _) {
  //Proxy Radio message handling to enable declarative interactions with radio channels
  var radioAPI = {
      radioEvents : {
          startMethod: 'on',
          stopMethod: 'off'
      },

      radioRequests : {
          startMethod: 'reply',
          stopMethod: 'stopReplying'
      }
  };

  function proxyRadioHandlers() {
      unproxyRadioHandlers.apply(this);
      _.forEach(radioAPI, function(commands, radioType) {
          var hash = _.result(this, radioType);
          if (!hash) {
              return;
          }
          _.forEach(hash, function(handler, radioMessage) {
              handler = normalizeHandler.call(this, handler);
              if (!handler) {
                return;
              }
              var messageComponents = radioMessage.split(' '),
                channel = messageComponents[0],
                messageName = messageComponents[1];
              proxyRadioHandler.call(this,channel, radioType, messageName, handler);
          }, this);
      }, this);
  }

  function proxyRadioHandler(channel, radioType, messageName, handler) {
      var method = radioAPI[radioType].startMethod;
      this._radioChannels = this._radioChannels || [];
      if(!_.includes(this._radioChannels, channel)) {
          this._radioChannels.push(channel);
      }
      Radio[method](channel, messageName, handler, this);
  }

  function unproxyRadioHandlers() {
      _.forEach(this._radioChannels, function(channel) {
          _.forEach(radioAPI,function(commands) {
              Radio[commands.stopMethod](channel, null, null, this);
          }, this);
      }, this);
  }

  function normalizeHandler(handler) {
      if (!_.isFunction(handler)) {
          handler = this[handler];
      }
      return handler;
  }

  var Service = Backbone.Model.extend({

      constructor: function() {
          Backbone.Model.apply(this, [].slice.call(arguments));
          proxyRadioHandlers.apply(this);
      },

      destroy: function() {
          Backbone.Model.prototype.destroy.apply(this);
          unproxyRadioHandlers.apply(this);
      }

  });
  Backbone.Service = Service;
  return Service;
});
