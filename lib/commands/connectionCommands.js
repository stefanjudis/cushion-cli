'use strict';
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
    cFile = require('../file/file'),
    clc = require('cli-color'),
    extend = require('node.extend');


// extend level commands with general commands
extend(connectionCommands, generalCommands);


/**
 * Get config of couchdb.
 *
 * @param  {Array} input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
  *@private
  *@tested
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
 * Create admin command.
 * either execute cushion command if name and password
 * are given or start prompt to get these information
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 *
 * @private
 * @tested
 */
connectionCommands._createAdmin = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      name,
      password;

  // @TODO what is about this switch case?
  switch (argsLength) {
  case 0:
    cPrompt._promptGetAdmin(
      connectionCallbacks.createAdmin,
      cli.cushion.createAdmin
    );

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
 * @tested
 */
connectionCommands._deleteAdmin = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      name;

  // @TODO what's about this switch statement? avoidable?
  switch (argsLength) {
  case 0:
    cPrompt._promptDeleteAdmin(cli);

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
 * delete saved couchdb connection
 *
 * possible inputs:
 *   ->input[1] === undefined    -> starts prompt dialog
 *   ->input[1] === '1'          -> delete connection by index
 *   ->input[1] === 'connection' -> delete connection by name
 *
 * @param  {[Array} input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
connectionCommands._deleteConnection = function(input, cli) {
  var connectionNames = input.slice(1);

  if (input.length > 1) {
    this.__deleteConnection(connectionNames, cli);
  } else {
    cPrompt._showConnections(cPrompt._setupDeleteSavedConnection);
  }
};


/**
 * Delete connection when input was typeof string
 *
 * @param  {Array}  connectionNames connectionNames
 * @param  {Object} cli             general cli object
 *
 * @private
 * @tested
 */
connectionCommands.__deleteConnection = function(connectionNames, cli) {
  connectionNames.forEach(function(connectionName, index) {
    if (+connectionName !== +connectionName) {
      connectionCommands.__deleteConnectionWithName(connectionName, cli);
    } else {
      connectionCommands.__deleteConnectionWithIndex(+connectionName, index, cli);
    }
  });

  this.__deleteConnectionWrite(connectionNames.join(', '), cli);
};


/**
 * Delete connection when input was typeof string
 * but it was parsible to a number
 *
 * @param  {Number} connectionName connectionName
 * @param  {Object} cli            general cli object
 *
 * @private
 * @tested
 */
connectionCommands.__deleteConnectionWithIndex = function(connectionIndex, index, cli) {
  // mapping to displayed number starting at 1
  connectionIndex = --connectionIndex;

  var connectionName = Object.keys(cli.connections)[connectionIndex - index];

  if (connectionName) {
    connectionCommands.__deleteConnectionWithName(connectionName, cli);
  } else {
    console.log(
      '\nConnection with index ' +
      clc.red(connectionIndex) +
      ' does not exist.\n'
    );
  }
};


/**
 * Delete connection when input was typeof string
 * representing the connection name
 *
 * @param  {String} connectionName connectionName
 * @param  {Object} cli            general cli object
 *
 * @private
 * @tested
 */
connectionCommands.__deleteConnectionWithName = function(connectionName, cli) {
  // check if connection exists
  if (cli.connections.hasOwnProperty(connectionName)) {
    // delete it
    delete cli.connections[connectionName];
  } else {
    console.log(
      '\nConnection with name ' +
      clc.red(connectionName) +
      ' does not exist.\n'
    );
  }
};


/**
 * Write new connections to file after
 * a particular one was deleted
 *
 * @param  {String} name name of deleted connection
 * @param  {Object} cli            general cli object
 *
 * @private
 */
connectionCommands.__deleteConnectionWrite = function(name, cli) {
  cFile._writeConnections(cli.connections, function(error) {
    if (!error) {
      console.log(
        '\nConnection(s) ' + clc.yellow(name) + ' deleted.\n'
      );
    } else {
      console.log('\nSomething went wrong. Sorry.\n');
    }

    cli.prompt();
  });
}


/**
 * List all set up admins
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
connectionCommands._listAdmins = function(input, cli) {
  cli.cushion.config('admins', connectionCallbacks.listAdmins);
};


/**
 * Get logs of couchdb.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
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
 * Save current couchdb connection to default file
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
connectionCommands._saveConnection = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      options = cli.cushion.option(),
      name = args[0];

  // make sure there is an object to store the connection
  cli.connections = cli.connections || {};

  if (argsLength > 0) {

    cli.connections[name] = options;

    cFile._writeConnections(cli.connections, function(error) {
      if (!error) {
        console.log('\nConnection ' + clc.yellow(name) + ' was saved.\n');
      } else {
        console.log('An error occured.');
        console.log(error);
      }

      cli.prompt();
    });
  } else {
    // TODO don't want to provide dialog for that?
    console.log(
      clc.red('What should be the name of the saved connection?\n\n') +
      'Please enter ' + clc.blue('name') + ' of connection as second parameter.'
    );

    cli.prompt();
  }
};


/**
 * Show options of current connection
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
connectionCommands._showConnection = function(input, cli) {
  var connection = cli.cushion.option();

  console.log('\nYour current connection is:');

  console.pretty(connection);

  cli.prompt();
};


// TODO show connections should maybe go in HERE
connectionCommands._showConnections = function(input, cli) {
  cPrompt._showConnections(cli.prompt);
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
 * @tested
 */
connectionCommands._simpleCommand = function(input, cli) {
  // command is stored at first place in input array
  var command = input[0];

  cli.cushion[command](connectionCallbacks[command]);
};


/**
 * Create uuids.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
connectionCommands._uuids = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length;

  if (argsLength < 2) {
    args.push(connectionCallbacks.log);
    cli.cushion.uuids.apply(cli.cushion, args);
  } else {
    console.log(
     'Please, use the \'uuids\' command without or with one argument.'
    );
  }
};


connectionCommands._activeTasks =
connectionCommands._restart =
connectionCommands._stats =
connectionCommands._version = connectionCommands._simpleCommand;
