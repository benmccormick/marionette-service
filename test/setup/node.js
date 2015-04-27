global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));
var Backbone = require('backbone');//jshint ignore:line
Backbone.$ = require('jquery');//jshint ignore:line
var Marionette = require('backbone.marionette'); //jshint ignore:line

require('./setup')();
