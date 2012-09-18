/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var connectionCallbacks = module.exports = {};
var cli = require('./cliRunner');

/**
 * [database description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
connectionCallbacks.database = function(name) {
  cli.cushion = cli.cushion.database(name);

  if(typeof cli.runner === 'function') {
    cli.runner();
  }
};

/**
 * [listDatabases description]
 * @param  {[type]} error     [description]
 * @param  {[type]} databases [description]
 * @return {[type]}           [description]
 */
connectionCallbacks.listDatabases = function(error, databases) {
  if (error) {
    console.log(error);
  } else {
    databases = databases.map(function(database) {
                  return database._name;
                });
    console.log(databases.join('\n'));

    if (typeof cli.runner === 'function') {
      cli.runner();
    }
  }
};

/**
 * [simpleCallback description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
connectionCallbacks.simpleCallback = function(error, response) {
  console.log(error || response);

  if (typeof cli.runner === 'function'){
    cli.runner();
  }
};

connectionCallbacks.version = connectionCallbacks.simpleCallback;
connectionCallbacks.config = connectionCallbacks.simpleCallback;
connectionCallbacks.createAdmin = connectionCallbacks.simpleCallback;
connectionCallbacks.deleteAdmin = connectionCallbacks.simpleCallback;
