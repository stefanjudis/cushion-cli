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
    clc = require('cli-color'),
    extend = require('node.extend');

// extend level commands with general commands
extend(documentCallbacks, generalCallbacks);


documentCallbacks.load = function(error, document) {
  if (error) {
    documentCallbacks.showError(error);
  } else {
    cli.doc = document;
    console.log(cli.doc);
    console.log(clc.yellow('\nDocument loaded.\n'));
  }

  cli.prompt();
};


documentCallbacks.save = function(error, document) {
  if (cli.doc._id === undefined) {
    cli.doc._id = document_id;
  }


  cli.prompt();
};

documentCallbacks.info = documentCallbacks.simpleCallback;
