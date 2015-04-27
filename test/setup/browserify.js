var Backbone = require('backbone');//jshint ignore:line
Backbone.$ = require('jquery');//jshint ignore:line
var Marionette = require('backbone.marionette'); //jshint ignore:line

var config = require('../../package.json').libraryOptions;

global.mocha.setup('bdd');
global.onload = function() {
  global.mocha.checkLeaks();
  global.mocha.globals(config.mochaGlobals);
  global.mocha.run();
  require('./setup')();
};
