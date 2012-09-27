/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var databaseCommands = module.exports = {},
    databaseCallbacks = require('./databaseCallbacks');


/**
 * [command description]
 * @param  {[type]} typedInput [description]
 * @param  {[type]} cli        [description]
 * @return {[type]}            [description]
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
 * [_simpleCommand description]
 * @param   {[type]} command [description]
 * @param   {[type]} cli     [description]
 * @return  {[type]}         [description]
 * @private
 */
databaseCommands._simpleCommand = function(input, cli) {
  var command = input[0];

  cli.db[command](databaseCallbacks[command]);
};

databaseCommands._exists = databaseCommands._simpleCommand;