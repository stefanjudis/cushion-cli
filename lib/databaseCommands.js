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
      paramsObject;

  if (argsLength > 0) {
    // @zoddy wants to have an object instead an array - let's transform
    paramsObject = this._createParamsObject(args);

    // make call or show message for invalid params
    if (paramsObject !== undefined) {
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
 * [_view description]
 * @param  {[type]} input [description]
 * @param  {[type]} cli   [description]
 * @private
 */
databaseCommands._view = function(input, cli) {
  var design = input[1],
      view = input[2],
      args = input.slice(1, 3),
      argsLength = args.length,
      params = input.slice(3, input.length),
      paramsObject;

  // check query params for view
  if (argsLength > 1) {
    paramsObject = this._createParamsObject(params);

    if (paramsObject !== undefined) {
      args.push(paramsObject, databaseCallbacks['view']);
      cli.db.view.apply(cli.db, args);
    } else {
      console.log('There was invalid parameter input');
      console.log('Look for help with:\n');
      console.log('    $ help view');

      cli.handleDatabaseCommands();
    }

  } else {
    console.log(
     'Please, use the \'view\' command with 2 or more arguments.\n' +
     'Look for help with:\n' +
     '    $ help view'
    );

    cli.handleDatabaseCommands();
  }
};

/**
 * [_createParamsObject description]
 * @param  {[type]} paramsArray [description]
 * @return {[type]}             [description]
 */
databaseCommands._createParamsObject = function(paramsArray) {
  paramsObject = {};

  paramsArray.forEach(function(value) {
    // check for valid input
    if (value.match(/^.*[\=].*$/) !== null) {
      value = value.split('=');

      // set object and avoid "invalid UTF-8 JSON" errors
      paramsObject[value[0]] = value[1].replace(/'/g, '"');
    } else {
      paramsObject = undefined;
      return;
    }
  });

  return paramsObject;
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