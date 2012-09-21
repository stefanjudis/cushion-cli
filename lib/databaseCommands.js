/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var databaseCommands = module.exports = {},
    databaseCallbacks = require('./databaseCallbacks'),
    prompt = require('cli-prompt');

/**
 * [command description]
 * @param  {[type]} typedInput [description]
 * @param  {[type]} cli        [description]
 * @return {[type]}            [description]
 */
databaseCommands.command = function(typedInput, cli) {
  var input = typedInput.split(' '),
      command = input[0],
      args = input.slice(1, input.length);

  switch (command) {
    case 'test':
      break;
    default:
      this._simpleCommand(command, cli);
  }
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
databaseCommands._simpleCommand = function(command, cli) {
  console.log(cli);
  cli.db[command](databaseCallbacks[command]);
};

databaseCommands._exists = databaseCommands._simpleCommand;