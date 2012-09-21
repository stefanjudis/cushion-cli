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

databaseCommands._simpleCommand = function(command, cli) {
  console.log(cli);
  cli.db[command](databaseCallbacks[command]);
};

databaseCommands._exists = databaseCommands._simpleCommand;