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
    clc = require('cli-color');


generalCommands._showConnection = function(input, cli) {
  var connection = cli.cushion.option();

  console.log('\nYour current connection is:\n');

  Object.keys(connection).forEach(function(key) {
    console.log(clc.blue(key) + ' -> ' + connection[key]);
  });

  cli.prompt();
};


/**
 * Save current couchdb connection to
 * default file
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
        console.log('Connection "' + name + '" was saved');
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


/**
 * Display user help for connection level.
 * This will call the 'cHelper'-Object to do the work over there.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
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