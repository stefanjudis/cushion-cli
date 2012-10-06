/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var databaseCallbacks = module.exports = {};
var cli = require('./cliRunner');


/**
 * [allDocuments description]
 * @param  {[type]} error [description]
 * @param  {[type]} info  [description]
 * @param  {[type]} docs  [description]
 * @return {[type]}       [description]
 */
databaseCallbacks.allDocuments = function(error, info, docs) {
  if (error) {
    console.log(error);
  } else {
    // docs = databases.map(function(database) {
    //               return database._name;
    //             });
    console.log(docs);

    cli.handleDatabaseCommands();
  }
};


databaseCallbacks.exists = function(error, response) {
  if (error) {
    console.log(error);
  } else {
    if (response === true) {
      console.log('Database already exists.');
    } else {
      console.log('Database doesn\'t exist yet.');
    }

    cli.handleDatabaseCommands();
  }
};


/**
 * [create description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
databaseCallbacks.create = function(error, response) {
  if (error) {
    databaseCallbacks.showError(error);
  } else {
    if (response === true) {
      console.log('Database created.');
    } else {
      console.log('Database couldn\'t be created');
    }
  }

  cli.handleDatabaseCommands();
};


/**
 * [destroy description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
databaseCallbacks.destroy = function(error, response) {
  if (error) {
    databaseCallbacks.showError(error);
    cli.handleDatabaseCommands();
  } else {
    if (response === true) {
      console.log('Database deleted.\nSwitched to connection level');

      cli.runner = cli.handleConnectionCommands;
      cli.handleConnectionCommands();
    } else {
      console.log('Database couldn\'t be deleted');
      cli.handleDatabaseCommands();
    }
  }
};


/**
 * [allDocuments description]
 * @param  {[type]} error   [description]
 * @param  {[type]} info    [description]
 * @param  {[type]} allDocs [description]
 */
databaseCallbacks.allDocuments = function(error, info, allDocs) {
  var columnWidth = 28,
      displayKey;

  if (error) {
    databaseCallbacks.showError(error);
  } else {
    console.log('This databases exists of ' + info.total + ' documents.');
    console.log('Displayed result has an offset of ' + info.offset + '.\n');

    // iterate over allDocs object
    console.log('             id              |       revision hash        ');
    Object.keys(allDocs).forEach(function(key) {
      console.log('    ----------------------------------------------------------');
      displayKey = key;

      if (displayKey.length <= columnWidth) {
        while (displayKey.length < columnWidth) {
          displayKey = displayKey + ' ';
        }
      } else {
        displayKey = displayKey.substr(0, columnWidth);
      }
      console.log(displayKey + ' | ' + allDocs[key]);
    });

    cli.handleDatabaseCommands();
  }
};


/**
 * [showError description]
 * @param  {[type]} error [description]
 * @return {[type]}       [description]
 */
databaseCallbacks.showError = function(error) {
  console.log('ERROR: ' + error.error + '\nREASON: ' + error.reason);
};

/**
 * [simpleCallback description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
databaseCallbacks.simpleCallback = function(error, response) {
  console.log(error || response);
  cli.handleDatabaseCommands();
};


databaseCallbacks.info = databaseCallbacks.simpleCallback;