/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var generalCommands = module.exports = {},
    cHelp = require('../help/help');

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