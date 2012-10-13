/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var databaseCommands = module.exports = {},
    databaseCallbacks = require('./databaseCallbacks'),
    cHelp = require('./help/help');


/**
 * Execute given command.
 *
 * @param  {string} ipnut input given from prompt
 * @param  {Object} cli   general cli object
 */
databaseCommands.command = function(input, cli) {
  var args = input.split(' '),
      command = args[0];

  databaseCommands['_' + command](args, cli);
};


/**
 * Check if given command taken from input exists.
 *
 * @param  {string} input   input given from prompt
 * @return {bool}   _return value representing if command exists
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
 * Change back to connection level.
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 * @private
 */
databaseCommands._connection = function(input, cli) {
  cli.db = undefined;
  console.log('Switched to connection level.');

  cli.level = 'connection';
  cli.prompt();
};


databaseCommands.allCommands = function() {
  var commands = Object.keys(this).filter(
    function(command) {
      return (command[0] === '_' && command !== '_simpleCommand');
    }
  ).map(function(command) {
    return command.replace(/_/g, '');
  });

  return commands;
};


/**
 * Display all documents for given database.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
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

      cli.runner();
    }
  } else {
    cli.db['allDocuments'](databaseCallbacks['allDocuments']);
  }
};


/**
 * Display given view for given database.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
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
    // @zoddy wants to have an object instead an array - let's transform
    paramsObject = this._createParamsObject(params);

    if (paramsObject !== undefined) {
      args.push(paramsObject, databaseCallbacks['view']);
      cli.db.view.apply(cli.db, args);
    } else {
      console.log('There was invalid parameter input');
      console.log('Look for help with:\n');
      console.log('    $ help view');

      cli.runner();
    }
  } else {
    console.log(
     'Please, use the \'view\' command with 2 or more arguments.\n' +
     'Look for help with:\n' +
     '    $ help view'
    );

    cli.runner();
  }
};

/**
 * Helper function to create an object out of an array with parameters.
 * Return value will set to undefined if validation for couchdb
 * query parameters failes.
 *
 * @param  {Array}             paramsArray  Array with given parameters
 * @return {Object|undefinded} paramsObject Object with given parameters
 * @private
 */
databaseCommands._createParamsObject = function(paramsArray) {
  var paramsObject = {};

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
 * General function for commands that don't need
 * specific actions, validation or functionality.
 * It's only executing the particular cushion function
 * and the depending callback.
 *
 * @param   {Array}  command Array of ' ' splitted input arguments
 * @param   {Object} cli     general cli object
 * @private
 */
databaseCommands._simpleCommand = function(input, cli) {
  var command = input[0];

  cli.db[command](databaseCallbacks[command]);
};


/**
 * Display user help for database level.
 * This will call the 'cHelper'-Object to do the work over there.
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 * @private
 */
databaseCommands._help = function(input, cli) {
  cHelp.getHelp(this, input, cli);
};


databaseCommands._exists =
databaseCommands._create =
databaseCommands._destroy =
databaseCommands._info = databaseCommands._simpleCommand;