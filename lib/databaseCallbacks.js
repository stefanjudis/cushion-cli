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
      console.log('Database already exists');
    } else {
      console.log('Database doesn\'t exist yet');
    }
  }
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


