'use strict';
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
    defaults = path.resolve(__dirname, '../config/defaults.json'),
    packageJSON = path.resolve(__dirname, '../../package.json');


file.defaultExists = function(callback) {
  fs.exists(defaults, callback);
};


file.getConnections = function(callback) {
  fs.readFile(defaults, callback);
};


file.readPackageJSON = function(callback) {
  fs.readFile(packageJSON, callback);
};


/**
 * Read cushion version number in package.json
 *
 * @param  {Function} callback callback called with version number
 */
file.getCushionVersionNumber = function(callback) {
  file.readPackageJSON(function(error, data) {
    var npmConfig;

    if (error) {
      callback(error);
    } else {
      npmConfig = JSON.parse(data);

      callback(null, npmConfig.version);
    }
  });
};


/**
 * write connections to default.json
 *
 * @param  {Object}   connections object for saved connection
 * @param  {Function} callback    callback used in writeFile
 *
 * @tested
 */
file._writeConnections = function(connections, callback) {
  var connectionsString = JSON.stringify(connections);
  fs.writeFile(defaults, connectionsString, callback);
};
