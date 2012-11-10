/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var generalCommands = module.exports = {},
    cHelp = require('../help/help'),
    cFile = require('../file/file'),
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
 * Show options of current connection
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 */
generalCommands._showConnection = function(input, cli) {
  var connection = cli.cushion.option();

  console.log('\nYour current connection is:\n');

  Object.keys(connection).forEach(function(key) {
    console.log(clc.yellow(key) + ' -> ' + connection[key]);
  });

  cli.prompt();
};


generalCommands._showConnections = function(input, cli) {
  cPrompt._showConnections(cli.prompt);
};

/**
 * Save current couchdb connection to default file
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 */
generalCommands._saveConnection = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      connection,
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
    console.log('Please enter name of connection as second parameter.');

    cli.prompt();
  }
};


generalCommands._deleteConnection = function(input, cli) {
  cPrompt._showConnections(cPrompt._setupDeleteSavedConnection);
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