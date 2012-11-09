/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var file = module.exports = {},
    fs = require('fs'),
    path = require('path'),
    defaults = path.resolve(__dirname, '../config/defaults.json');


file._writeConnections = function(connections, callback) {
  var connectionsString = JSON.stringify(connections);

  fs.writeFile(defaults, connectionsString, callback);
};


file.defaultExists = function(callback) {
  fs.exists(defaults, callback);
};


file.getConnections = function(callback) {
  fs.readFile(defaults, callback);
};