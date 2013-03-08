/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var generalCommands = module.exports = {},
    cHelp = require('../help/help'),
    cPrompt = require('../prompt/prompt'),
    clc = require('cli-color');


/**
 * Execute given command.
 *
 * @param  {String} input input given from prompt
 * @param  {Object} cli   general cli object
 */
generalCommands.command = function(input, cli) {
  var args = input.split(' '),
      command = args[0];

  // avoid errors after accidentally typed space at the end
  if (args[args.length -1] === '') {
    args.pop();
  }

  this['_' + command](args, cli);
};


/**
 * Check if given command taken from input exists.
 *
 * @param  {String} input   input given from prompt
 * @return {bool}   _return value representing if command exists
 */
generalCommands.commandExists = function(input, cli) {
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
 */
generalCommands['_..'] = function(input, cli) {
  var switches = {
    'document': 'database',
    'database': 'connection',
    'connection': 'connection'
  };

  this['_' + switches[cli.level]](input, cli);

  cli.prompt();
};


/**
 * Change back to connection level.
 *
 * @param   {Array}  input Array of ' ' splitted input arguments
 * @param   {Object} cli   general cli object
 *
 * @private
 */
generalCommands._connection = function(input, cli) {
  cli.db = undefined;
  console.log(clc.yellow('\nSwitched to connection level.\n'));

  cli.level = 'connection';

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
 */
generalCommands._database = function(input, cli) {
  var args = input.slice(1, input.length),
      name = args[0];

  if (name) {
    cli.db = cli.cushion.database(name);
  }

  if (cli.level === 'connection' && cli.db === undefined) {
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

  cli.prompt();
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
 * Stop cushion and do something else
 */
generalCommands._exit = function() {
  console.log('Bye bye - happy couching');
  process.exit();
};
