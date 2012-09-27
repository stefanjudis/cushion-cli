/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var databaseCommands = module.exports = {},
    databaseCallbacks = require('./databaseCallbacks'),
    cHelper = require('./helper/helper');

databaseCommands.name = 'database';


/**
 * [command description]
 * @param  {[type]} typedInput [description]
 * @param  {[type]} cli        [description]
 */
databaseCommands.command = function(input, cli) {
  var args = input.split(' '),
      command = args[0];

  databaseCommands['_' + command](args, cli);

};


/**
 * [commandExists description]
 * @param  {[type]} input [description]
 * @return {[type]}       [description]
 */
databaseCommands.commandExists = function(input) {
  var command = input.split(' ')[0],
      _return;

  if(this['_' + command] !== undefined) {
    _return = true;
  } else {
    _return = false;
  }

  return _return;
};


/**
 * [_connection description]
 * @param   {[type]} input [description]
 * @param   {[type]} cli   [description]
 * @private
 */
databaseCommands._connection = function(input, cli) {
  cli.db = undefined;
  console.log('Switched to connection level.');

  cli.runner = cli.handleConnectionCommands;
  cli.handleConnectionCommands();
};


/**
 * [_simpleCommand description]
 * @param   {[type]} command [description]
 * @param   {[type]} cli     [description]
 * @private
 */
databaseCommands._simpleCommand = function(input, cli) {
  var command = input[0];

  cli.db[command](databaseCallbacks[command]);
};


/**
 * [_help description]
 * @param   {[type]} input [description]
 * @param   {[type]} cli   [description]
 * @private
 */
databaseCommands._help = function(input, cli) {
  cHelper.getHelp(this, cli);
};


databaseCommands._exists =
databaseCommands._create =
databaseCommands._destroy =
databaseCommands._info = databaseCommands._simpleCommand;