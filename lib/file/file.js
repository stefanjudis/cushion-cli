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
    home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
    defaultsPath = home + '/.cushion/',
    defaultsFile = 'defaults.json',
    defaults = defaultsPath + defaultsFile,
    packageJSON = path.resolve(__dirname, '../../package.json');


/**
 * check if defaults.json for saving default
 * connections exists
 *
 * @param  {Function} callback callback for fs exists command
 *
 * tested
 */
file.defaultExists = function(callback) {
  fs.exists(defaults, callback);
};


/**
 * Get connection from defaults.json
 *
 * @param  {Function} callback callback for fs readFile command
 *
 * @tested
 */
file.getConnections = function(callback) {
  fs.readFile(defaults, callback);
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
 * Read project package.json file
 *
 * @param  {Function} callback callback for fs readFile command
 *
 * @tested
 */
file.readPackageJSON = function(callback) {
  fs.readFile(packageJSON, callback);
};


/**
 * set connections to file object and check for
 * default directary existance
 *
 * writing connection happen inside of the callback
 *
 * @param  {Object}   connections object for saved connection
 * @param  {Function} callback    callback used in writeFile
 *
 * @tested
 */
file._writeConnections = function(connections, callback) {
  file.connections = connections;
  file.writeConnectionsCallback = callback;

  fs.exists(defaultsPath, file._writeConnectionsExistsCallback);
};


/**
 * write connections is directory ~/.cushion exists
 * if not create directory and write afterwards
 *
 * @param  {Boolean} exists ~/.cushion already exists
 *
 * @tested
 */
file._writeConnectionsExistsCallback = function(exists) {
  var connectionsString = JSON.stringify(file.connections);

  if (exists) {
    fs.writeFile(defaults, connectionsString, file.writeConnectionsCallback);
  } else {
    fs.mkdir(defaultsPath, '0755', function() {
      fs.writeFile(defaults, connectionsString, file.writeConnectionsCallback);
    })
  }
};
