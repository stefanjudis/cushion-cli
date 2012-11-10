/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var databaseCommands = module.exports = {},
    databaseCallbacks = require('../callbacks/databaseCallbacks'),
    generalCommands = require('./generalCommands'),
    cHelp = require('../help/help'),
    cHelper = require('../helper/helper'),
    extend = require('node.extend');


// extend level commands with general commands
extend(databaseCommands, generalCommands);


/**
 * Execute given command.
 *
 * @param  {string} ipnut input given from prompt
 * @param  {Object} cli   general cli object
 */
databaseCommands.command = function(input, cli) {
  var args = input.split(' '),
      command = args[0];

  // avoid errors after exidentally typed space at the end
  if (args[args.length -1] === '') {
    args.pop();
  }

  databaseCommands['_' + command](args, cli);
};


/**
 * Check if given command taken from input exists.
 *
 * @param  {string} input   input given from prompt
 * @return {bool}   _return value representing if command exists
 */
databaseCommands.commandExists = function(input, cli) {
  var command = input.split(' ')[0],
      _return = false;

  if(this['_' + command] !== undefined) {
    _return = true;
  }

  return _return;
};


/**
 * Display all documents for given database.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 */
databaseCommands._allDocuments = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      paramsObject;

  if (argsLength > 0) {
    // @zoddy wants to have an object instead an array - let's transform
    paramsObject = cHelper._createParamsObject(args);

    // make call or show message for invalid params
    if (paramsObject !== undefined) {
      cli.db['allDocuments'](paramsObject, databaseCallbacks['allDocuments']);
    } else {
      console.log('There was invalid parameter input');
      console.log('Look for help with:\n');
      console.log('    $ help allDocuments');

      cli.prompt();
    }
  } else {
    cli.db['allDocuments'](databaseCallbacks['allDocuments']);
  }
};


/**
 * Change back to connection level.
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 *
 * @private
 */
databaseCommands._connection = function(input, cli) {
  cli.db = undefined;
  console.log('Switched to connection level.');

  cli.level = 'connection';

  // TODO that's dirty maybe there is a better way
  cli.name = cli.cushion._options.host;
  cli.prompt();
};


/**
 * Display given view for given database.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
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
    paramsObject = cHelper._createParamsObject(params);

    if (paramsObject !== undefined) {
      args.push(paramsObject, databaseCallbacks['view']);
      cli.db.view.apply(cli.db, args);
    } else {
      console.log('There was invalid parameter input');
      console.log('Look for help with:\n');
      console.log('    $ help view');

      cli.prompt();
    }
  } else {
    console.log(
     'Please, use the \'view\' command with 2 or more arguments.\n' +
     'Look for help with:\n' +
     '    $ help view'
    );

    cli.prompt();
  }
};


/**
 * General function for commands that don't need
 * specific actions, validation or functionality.
 * It's only executing the particular cushion function
 * and the depending callback.
 *
 * @param   {Array}  command Array of ' ' splitted input arguments
 * @param   {Object} cli     general cli object
 *
 * @private
 */
databaseCommands._simpleCommand = function(input, cli) {
  var command = input[0];

  cli.db[command](databaseCallbacks[command]);
};


databaseCommands._exists =
databaseCommands._create =
databaseCommands._destroy =
databaseCommands._info = databaseCommands._simpleCommand;