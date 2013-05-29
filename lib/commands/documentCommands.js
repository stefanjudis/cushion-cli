'use strict';
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


/**
 * Content function to receive or set information
 * stored in document._body
 *
 * Handling for 3 different input types:
 *
 * input.length === 1:
 *   show complete document body
 * input.length === 2:
 *   show specific key of document body
 * input.length === 3:
 *   set specific key of document body
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
documentCommands._content = function(input, cli) {
  var args = input.slice(1, input.length),
      response;

  response = cli.doc.body.apply(cli.doc, args);

  // TODO only repsonse object????
  if (typeof response === 'object' && Object.keys(response).length === 0) {
    console.log(
      clc.red(
        'The response is empty.\n' +
        'Maybe you forgot to \'load\' the document before?'
      )
    );

    cli.prompt();

    return;
  }

  documentCallbacks.content(
    false,
    response
  );

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
documentCommands._simpleCommand = function(input, cli) {
  // command is stored at first place in input array
  var command = input[0];

  cli.doc[command](documentCallbacks[command]);
};



documentCommands._load =
documentCommands._info =
documentCommands._save = documentCommands._simpleCommand;
