'use strict';
/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var generalCommands = module.exports = {},
    cHelp = require('../help/help'),
    clc = require('cli-color'),
    connectionCallbacks = require('../callbacks/connectionCallbacks');


/**
 * Execute given command.
 *
 * @param  {String} input input given from prompt
 * @param  {Object} cli   general cli object
 */
generalCommands.command = function(input, cli) {
  var args = [''],
      argPointer = 0,
      doubleQuote = false,
      singleQuote = false;

  input.trim().split('').forEach(function(character, position, line) {
    if (character === ' ' && doubleQuote === false && singleQuote === false) {
      args[++argPointer] = '';
    } else if (
      character === '\'' &&
      line[position - 1] !== '\\' &&
      singleQuote === false
    ) {
      doubleQuote = !doubleQuote;
    } else if (
      character === '\'' &&
      line[position - 1] !== '\\' &&
      doubleQuote === false
    ) {
      singleQuote = !singleQuote;
    } else {
      if (
        character !== '\\' ||
        (character === '\\' && line[position + 1] === '\\')
      ) {
        args[argPointer] += character;
      }
    }
  });

  this['_' + args[0]](args, cli);
};

/**
 * Check if given command taken from input exists.
 * All commands starting with '_' should be marked as
 * existent. These commands should not be called
 * directly but by calling command function.
 *
 * @param  {String} input   input given from prompt
 * @param  {Object} cli   general cli object
 * @return {bool}   return value representing if command exists
 *
 * @public
 * @tested
 */
generalCommands.commandExists = function(input) {
  var command = input.split(' ')[0],
      _return = false;

  if(this['_' + command] !== undefined) {
    _return = true;
  }

  return _return;
};


/**
 * Change to parent level
 * e.g. on document level, type ".." and you will switch to database level
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 *
 * @private
 * @tested
 */
generalCommands['_..'] = function(input, cli) {
  var switches = {
    'connection': 'connection',
    'database': 'connection',
    'document': 'database',
    'user': 'connection'
  };

  this['_' + switches[cli.level]](input, cli);
};


/**
 * Change back to connection level.
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 *
 * @private
 * @tested
 */
generalCommands._connection = function(input, cli) {
  cli.db = undefined;
  console.log(clc.yellow('\nSwitched to connection level.\n'));

  cli.level = 'connection';
  cli.unsavedChanges = false;
  cli.name = cli.cushion.option('host');

  cli.prompt();
};


/**
 * Switch to database with given name from prompt.
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 *
 * @private
 * @tested
 */
generalCommands._database = function(input, cli) {
  var args = input.slice(1, input.length),
      name = args[0];

  if (name) {
    cli.db = cli.cushion.database(name);
  }

  if (cli.level !== 'document' && cli.db === undefined) {
    console.log(
      clc.red(
        '\nPlease define a name of particular database.\n'
      )
    );
  } else {
    console.log(clc.yellow('\nSwitched to database ') + clc.blue(name) + '\n');
    cli.level = 'database';
    cli.name = cli.db.name();
  }

  cli.db.exists(cli.databaseCallbacks.exists);
};


/**
 * Stop cushion and do something else
 *
 * @private
 */
generalCommands._exit = function() {
  console.log('Bye bye - happy couching');
  process.exit();
};


/**
 * Display user help for connection level.
 * This will call the 'cHelper'-Object to do the work over there.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 */
generalCommands._help = function(input, cli) {
  cHelp.getHelp(cli[cli.level + 'Commands'], input, cli);
};


/**
 * Display existing databases
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
generalCommands._listDatabases = function(input, cli) {
  cli.cushion.listDatabases(connectionCallbacks.listDatabases);
};


/**
 * Display existing users
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
generalCommands._listUsers = function(input, cli) {
  var userNames;

  cli.cushion.database('_users').allDocuments(function(error, info, allDocs) {
    console.log(
      clc.yellow('\nFollowing users exist:')
    );

    userNames = Object.keys(allDocs).map(function(c) {
      if (c.match(/^org.couchdb.user:.*$/)) {
        return c.replace(/org.couchdb.user:/, '');
      }
    }).filter(function(c) {
      return c;
    });

    console.pretty(userNames);

    cli.prompt();
  });
};


/**
 * Switch to user with given name from prompt.
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 *
 * @private
 * @tested
 */
generalCommands._user = function(input, cli) {
  var args = input.slice(1, input.length),
      name = args[0];

  if (name) {
    cli.user = cli.cushion.user();
    cli.user.name = name;

    cli.level = 'user';
    cli.name = name;

    console.log(
      clc.yellow('\nSwitched to user ') + clc.blue(name) + '\n'
    );

    cli.cushion.database('_users').allDocuments(
      (cli[cli.level + 'Callbacks'].users).bind(name)
    );
  } else {
    console.log(
      clc.red(
        '\nPlease define name for particular user.\n'
      )
    );

    cli.prompt();
  }

};

