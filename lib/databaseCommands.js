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
      this._simpleCommand();
  }
};

databaseCommands.commandExists = function(input) {

};

databaseCommands.simpleCommand = function(command, cli) {

};