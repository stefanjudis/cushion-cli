/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var connectionCommands = module.exports = {};
    connectionCallbacks = require('./connectionCallbacks');


/**
 * [simpleCommand description]
 * @return {[type]} [description]
 */
connectionCommands.command = function(input, cli) {
  var input = input.split(' '),
      command = input[0],
      args = input.slice(1, input.length);

  switch (command) {
    case 'createAdmin':
      this._createAdmin(args, cli);
      break;
    case 'deleteAdmin':
      this._deleteAdmin(args, cli);
      break;
    default:
      this._simpleCommand(args, cli);
  }
};

connectionCommands.commandExists = function(input) {
  var command = input.split(' ')[0],
      _return;

  if(this['_' + command] !== undefined) {
    _return = true;
  } else {
    _return = false;
  }

  return _return;
};


connectionCommands._createAdmin = function(args, cli) {

  if (args.length === 0) {

  } else if (args.length === 2) {
    cli.cushion.createAdmin(args[0], args[1], connectionCallbacks.createAdmin);
  }

};

connectionCommands._deleteAdmin = function(args) {

};

connectionCommands._simpleCommand = function(args) {

};