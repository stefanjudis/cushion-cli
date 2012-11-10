/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var documentCommands = module.exports = {},
    documentCallbacks = require('../callbacks/documentCallbacks'),
    generalCommands = require('./generalCommands'),
    clc = require('cli-color'),
    extend = require('node.extend');


// extend level commands with general commands
extend(documentCommands, generalCommands);


documentCommands._database = function(input, cli) {
  console.log(clc.yellow('\n Switched to database level.\n'));

  cli.level = 'database';

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
documentCommands._simpleCommand = function(input, cli) {
  // command is stored at first place in input array
  var command = input[0];

  cli.doc[command](documentCallbacks[command]);
};


documentCommands._load = documentCommands._simpleCommand;