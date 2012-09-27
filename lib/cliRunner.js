/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */
var cli = module.exports = {},
    cushion = require('cushion'),
    clc = require('cli-color'),
    config = require('./config'),
    cPrompt = require('./prompt/prompt'),
    util = require('util'); // delete it later


cli.connectionCommands = require('./connectionCommands');
cli.connectionCallbacks = require('./connectionCallbacks');
cli.databaseCommands = require('./databaseCommands'),
cli.databaseCallbacks = require('./databaseCallbacks'),


/**
 * [handleConnectionCommands description]
 * @return {[type]} [description]
 */
cli.handleConnectionCommands = function() {
  cPrompt.connection(this);
};


/**
 * [handleDatabaseCommands description]
 * @return {[type]} [description]
 */
cli.handleDatabaseCommands = function() {
  cPrompt.database(this);
};


/**
 * [initPrompt description]
 * @return {[type]} [description]
 */
cli.init = function() {
  cPrompt.setup(this._createConnection);
};

/**
 * [_createConnection description]
 * @param   {[type]} host     [description]
 * @param   {[type]} port     [description]
 * @param   {[type]} user     [description]
 * @param   {[type]} password [description]
 * @return  {[type]}          [description]
 * @private
 */
cli._createConnection = function(result) {
  cli.cushion = new cushion.Connection(
                  result.host,
                  result.post,
                  result.name,
                  result.password
                );

  cli.cushion.version(function(error, version) {
    if (error) {
      console.log(
        clc.red('Error appeared could not connect to couchdb')
      );

      cli.init();
    } else {
      cli.handleConnectionCommands();
    }
  });
};


