/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var connectionCallbacks = module.exports = {};
var cli = require('../cliRunner');


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
    connectionCallbacks._showError(error);
  } else {
    console.log(response);
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
    connectionCallbacks._showError(error);
  } else {
    if (response === true) {
      console.log('Admin was created.');
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
    connectionCallbacks._showError(error);
  } else {
    if (response === true) {
      console.log('Admin was deleted.');
    }
  }

  cli.prompt();
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
connectionCallbacks.log =
connectionCallbacks.restart = connectionCallbacks.simpleCallback;
