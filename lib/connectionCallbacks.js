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
  if (error) {
    this._showError(error);
  } else {
    console.log(response);
  }

  if (typeof cli.runner === 'function'){
    cli.runner();
  }
};

/**
 * [createAdmin description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
connectionCallbacks.createAdmin = function(error, response) {
  if (error) {
    connectionCallbacks._showError(error);
  } else {
    if (response === true) {
      console.log('Admin was created.');
    }
  }

  if (typeof cli.runner === 'function'){
    cli.runner();
  }
};

connectionCallbacks.deleteAdmin = function(error, response) {
  if (error) {
    connectionCallbacks._showError(error);
  } else {
    if (response === true) {
      console.log('Admin was deleted.');
    }
  }

  if (typeof cli.runner === 'function'){
    cli.runner();
  }
};

/**
 * [_showError description]
 * @param   {[type]} error [description]
 * @return  {[type]}       [description]
 * @private
 */
connectionCallbacks._showError = function(error) {
  console.log(
    "Command not working...\n" +
    'Error is: ' + error.error + "\n" +
    'With the reason: ' + error.reason
  );
};

// @TODO looks totally ugly?! could you do it better?
connectionCallbacks.version =
connectionCallbacks.config =
connectionCallbacks.activeTasks =
connectionCallbacks.stats =
connectionCallbacks.restart = connectionCallbacks.simpleCallback;
