'use strict';
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


/**
 * Callback for content command
 *
 * @param  {Object} error    given error
 * @param  {Object} document document
 */
documentCallbacks.content = function(error, document) {
  if (typeof document.id === 'function') {
    console.log(clc.yellow('\nProperty set.\n'));
  } else {
    console.pretty(document);
  }

  cli.prompt();
};


/**
 * Callback for load command
 *
 * @param  {Object} error    given error
 * @param  {Object} document document
 */
documentCallbacks.load = function(error, document) {
  if (error) {
    documentCallbacks.showError(error);
  } else {
    cli.doc = document;
    console.log(clc.yellow('\nDocument loaded.\n'));
  }

  cli.prompt();
};


/**
 * Callback for save command
 *
 * @param  {Object} error    given error
 * @param  {Object} document document
 */
documentCallbacks.save = function(error, document) {
  if (error) {
    documentCallbacks.showError(error);
  } else {
    if (cli.name === '...') {
      cli.name = document._id.substr(0, 8);
    }

    console.log(clc.yellow('\nDocument saved.\n'));
    cli.prompt();
  }
};

documentCallbacks.info = documentCallbacks.simpleCallback;
