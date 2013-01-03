/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var connectionCallbacks = module.exports = {},
    generalCallbacks = require('./generalCallbacks'),
    cli = require('../cliRunner'),
    clc = require('cli-color'),
    extend = require('node.extend');


// extend level commands with general commands
extend(connectionCallbacks, generalCallbacks);

/**
 * Callback for listDatabases command
 *
 * @param  {Object} error     Given error
 * @param  {Object} databases included databases
 */
connectionCallbacks.listDatabases = function(error, databases) {
  if (error) {
    connectionCallbacks.showError(error);
  } else {
    databases = databases.map(function(database) {
      return database._name;
    });

    console.log(clc.yellow('\nCouchDB includes the following databases:'));
    console.pretty(databases);
  }

  cli.prompt();
};

/**
 * [simpleCallback description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
connectionCallbacks.simpleCallback = function(error, response) {
  if (error) {
    connectionCallbacks.showError(error);
  } else {
    console.pretty(response);
  }

  cli.prompt();
};

/**
 * [createAdmin description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
connectionCallbacks.createAdmin = function(error, response) {
  if (error) {
    connectionCallbacks.showError(error);
  } else {
    if (response === true) {
      console.log(clc.yellow('Admin was created.'));
      console.pretty(response);
    }
  }

  cli.prompt();
};

/**
 * [deleteAdmin description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
connectionCallbacks.deleteAdmin = function(error, response) {
  if (error) {
    connectionCallbacks.showError(error);
  } else {
    if (response === true) {
      console.log(clc.yellow('Admin was deleted.'));
    }
  }

  cli.prompt();
};


connectionCallbacks.version =
connectionCallbacks.config =
connectionCallbacks.activeTasks =
connectionCallbacks.stats =
connectionCallbacks.log =
connectionCallbacks.restart = connectionCallbacks.simpleCallback;
