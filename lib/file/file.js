/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var file = module.exports = {},
    fs = require('fs'),
    defaults = '../config/default.json';


file._writeConnection = function(connection) {
  fs.appendFile(defaults, connection, function(err) {
    if (err) {
      throw err;
    }

    console.log('saved new connection to ' + defaults);
  });
};


file._createConnectionFile = function(connection, callback) {
  fs.writeFile(defaults, '', function(err) {
    if (err) {
      throw err;
    }
    callback(connection);
  });
};


file.addConnection = function(connection) {
  fs.exists(defaults, function(exists) {
    console.log(exists);

    if (!exists) {
      file._createConnectionFile(connection, file.writeConnection);
    } else {
      file._writeConnection(JSON.stringify(connection));
    }
  });
};


file.defaultExists = function(callback) {
  var _return = false;

  fs.exists(defaults, callback);
};


file._connectionExists = function(connection) {

};


file.getConnections = function(callback) {
  fs.readFile(defaults, callback);
};