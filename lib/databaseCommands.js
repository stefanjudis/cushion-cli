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
 * [_allDocuments description]
 * @param  {[type]} input [description]
 * @param  {[type]} cli   [description]
 * @private
 */
databaseCommands._allDocuments = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      paramsObject = {},
      paramsValid = true;

  if (argsLength > 0) {
    // @zoddy wants to have an object instead an array - let's transform
    args.forEach(function(value) {
      console.log(value);
      // check for valid input
      if (value.match(/^.*[\=].*$/) !== null) {
        value = value.split('=');

        // set object and avoid "invalid UTF-8 JSON" errors
        paramsObject[value[0]] = value[1].replace(/'/g, '"');
      } else {
        paramsValid = false;
      }
    });

    // make call or show message for invalid params
    if (paramsValid) {
      cli.db['allDocuments'](paramsObject, databaseCallbacks['allDocuments']);
    } else {
      console.log('There was invalid parameter input');
      console.log('Look for help with:\n');
      console.log('    $ help allDocuments');

      cli.handleDatabaseCommands();
    }
  } else {
    cli.db['allDocuments'](databaseCallbacks['allDocuments']);
  }
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
  cHelper.getHelp(this, input, cli);
};


databaseCommands._exists =
databaseCommands._create =
databaseCommands._destroy =
databaseCommands._info = databaseCommands._simpleCommand;