/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var documentCommands = module.exports = {},
    documentCallback = require('../callbacks/documentCallbacks'),
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