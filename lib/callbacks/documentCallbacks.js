/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var documentCallbacks = module.exports = {},
    generalCallbacks = require('./generalCallbacks'),
    cli = require('../cliRunner'),
    clc = require('cli-color');
    extend = require('node.extend');

// extend level commands with general commands
extend(documentCallbacks, generalCallbacks);


documentCallbacks.load = function(error, document) {
  if (error) {
    documentCallbacks.showError(error);
  } else {
    cli.doc = document;

    console.log(clc.yellow('\nDocument loaded.\n'));
  }

  cli.prompt();
};




// = documentCallbacks.simpleCallback;