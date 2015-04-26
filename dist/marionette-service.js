/**
 * Marionette Service
 *
 * Adds a Service Object to Marionette which allows an Object to
 * receive Backbone.Radio messages in a declarative fashion.
 *
 * @author Ben McCormick
 *
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('underscore'), require('backbone.marionette'), require('backbone.radio')) : typeof define === 'function' && define.amd ? define(['underscore', 'backbone.marionette', 'backbone.radio'], factory) : global.Marionette.Service = factory(global._, global.Mn, global.Radio);
})(this, function (_, Mn, Radio) {
    'use strict';

    var radioAPI = {
        radioEvents: {
            startMethod: 'on',
            stopMethod: 'off'
        },
        radioCommands: {
            startMethod: 'comply',
            stopMethod: 'stopComplying'
        },
        radioRequests: {
            startMethod: 'reply',
            stopMethod: 'stopReplying'
        }
    };

    function proxyRadioHandlers() {
        unproxyRadioHandlers.apply(this);
        _.each(radioAPI, function (commands, radioType) {
            var hash = _.result(this, radioType);
            if (!hash) {
                return;
            }
            _.each(hash, function (handler, radioMessage) {
                handler = normalizeHandler.call(this, handler);
                if (!handler) {
                    return;
                }
                var messageComponents = radioMessage.split(' '),
                    channel = messageComponents[0],
                    messageName = messageComponents[1];
                proxyRadioHandler.call(this, channel, radioType, messageName, handler);
            }, this);
        }, this);
    }

    function proxyRadioHandler(channel, radioType, messageName, handler) {
        var method = radioAPI[radioType].startMethod;
        this._radioChannels = this._radioChannels || [];
        if (!_.contains(this._radioChannels, channel)) {
            this._radioChannels.push(channel);
        }
        Radio[method](channel, messageName, handler, this);
    }

    function unproxyRadioHandlers() {
        _.each(this._radioChannels, function (channel) {
            _.each(radioAPI, function (commands) {
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

    var Service = Mn.Object['extends']({

        constructor: function constructor() {
            Mn.Object.apply(this);
            proxyRadioHandlers.apply(this);
        },

        destroy: function destroy() {
            Mn.Object.destroy.apply(this);
            unproxyRadioHandlers.apply(this);
        }

    });

    var marionette_service = Service;

    return marionette_service;
});
//# sourceMappingURL=./marionette-service.js.map