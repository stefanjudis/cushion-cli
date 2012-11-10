/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var connectionCommands = module.exports = {},
    connectionCallbacks = require('../callbacks/connectionCallbacks'),
    generalCommands = require('./generalCommands'),
    cPrompt = require('../prompt/prompt'),
    extend = require('node.extend');


// extend level commands with general commands
extend(connectionCommands, generalCommands);


/**
 * Execute given command.
 *
 * @param  {String} input input given from prompt
 * @param  {Object} cli   general cli object
 */
connectionCommands.command = function(input, cli) {
  var args = input.split(' '),
      command = args[0];

  // avoid errors after exidentally typed space at the end
  if (args[args.length -1] === '') {
    args.pop();
  }

  connectionCommands['_' + command](args, cli);

};


/**
 * Check if given command taken from input exists.
 *
 * @param  {String} input   input given from prompt
 * @return {bool}   _return value representing if command exists
 */
connectionCommands.commandExists = function(input, cli) {
  var command = input.split(' ')[0],
      _return = false;

  if(this['_' + command] !== undefined) {
    _return = true;
  }

  return _return;
};


/**
 * Create admin command.
 * either execute cushion command if name and password
 * are given or start prompt to get these information
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 *
 * @private
 */
connectionCommands._createAdmin = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      name,
      password;

  // @TODO what is about this switch case?
  switch (argsLength) {
    case 0:
      cPrompt._createAdmin(cli);

      break;
    case 2:
      name = args[0];
      password = args[1];

      cli.cushion.createAdmin(
        name,
        password,
        connectionCallbacks.createAdmin
      );

      break;
    default:
      console.log(
        'Use the \'createAdmin\' command without or with two arguments (user, password)'
      );
  }
};


/**
 * delete admin command
 * either execute cushion command if name is given
 * or start prompt to get this information
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 *
 * @private
 */
connectionCommands._deleteAdmin = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      name;

  // @TODO what's about this switch statement? avoidable?
  switch (argsLength) {
    case 0:
      cPrompt._deleteAdmin(cli);

      break;
    case 1:
      name = args[0];
      cli.cushion.deleteAdmin(
        name,
        connectionCallbacks.deleteAdmin
      );
      break;
    default:
      console.log(
        'Use the \'deleteAdmin\' command without or with one argument.'
      );
  }
};


/**
 * Get config of couchdb.
 *
 * @param  {Array} input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
  *@private
 */
connectionCommands._config = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length;

  if (argsLength < 4) {
    // push callback to args for usage of apply
    args.push(connectionCallbacks.config);
    cli.cushion.config.apply(cli.cushion, args);
  } else {
    console.log(
     'Please, use the \'config\' command with 0, 1, 2 or 3 arguments.\n' +
     'Look for help with:\n' +
     '    $ help config'
    );
  }
};


/**
 * Get logs of couchdb.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 */
connectionCommands._log = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length;

  if (argsLength < 2) {
    args.push(connectionCallbacks.log);
    cli.cushion.log.apply(cli.cushion, args);
  } else {
    console.log(
     'Please, use the \'log\' command without or with one argument.'
    );
  }
};


/**
 * Switch to database with given name from prompt.
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 *
 * @private
 */
connectionCommands._database = function(input, cli) {
  var command = input[0],
      name = input[1];

  if (name) {
    cli.db = cli.cushion.database(name);
    console.log('Switched to database ' + name);

    cli.level = 'database';
    cli.name = name;
  } else {
    console.log('You must define a name for particular database.');
  }

  cli.prompt();
};


/**
 * General function for commands that don't need
 * specific actions, validation or functionality.
 * It's only executing the particular cushion function
 * and the depending callback.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 */
connectionCommands._simpleCommand = function(input, cli) {
  // command is stored at first place in input array
  var command = input[0];

  cli.cushion[command](connectionCallbacks[command]);
};


connectionCommands._version =
connectionCommands._activeTasks =
connectionCommands._listDatabases =
connectionCommands._stats =
connectionCommands._restart = connectionCommands._simpleCommand;