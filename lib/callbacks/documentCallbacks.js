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
 * @param  {Object|null} error    given error
 * @param  {Object}      document document
 *
 * @tested
 */
documentCallbacks.content = function(error, document) {
  if (error) {
    documentCallbacks.showError(error);
  } else {
    if (document === undefined) {
      console.log(clc.red('\nThis property does not exist in this document.\n'));
    } else if (typeof document.id === 'function') {
      console.log(clc.yellow('\nProperty set.\n'));

      cli.unsavedChanges = true;
    } else {
      console.pretty(document);
    }

    cli.prompt();
  }
};


/**
 * Callback for load command
 *
 * @param  {Object|null} error    given error
 * @param  {Object}      document document
 *
 * @tested
 */
documentCallbacks.load = function(error, document) {
  if (error) {
    if (error.error === 'not_found') {
      cli.unsavedChanges = true;

      console.log(
        clc.red(
          '\nDocument doesn\'t exist yet.\n' +
          'Don\'t forget to save it later on.'
        )
      );
    } else {
      documentCallbacks.showError(error);
    }
  } else {
    cli.doc = document;

    cli.unsavedChanges = false;

    console.log(clc.green('\nDocument loaded.'));
  }

  console.log(clc.yellow('\nSwitched to document level.\n'));

  cli.prompt();
};


/**
 * Callback for save command
 *
 * @param  {Object|null} error    given error
 * @param  {Object}      document document
 *
 * @tested
 */
documentCallbacks.save = function(error, document) {
  if (error) {
    documentCallbacks.showError(error);
  } else {
    if (cli.name === '...') {
      cli.name = document._id.substr(0, 8);
    }
    cli.doc = document;

    console.log(clc.yellow('\nDocument saved.\n'));

    cli.unsavedChanges = false;

    cli.prompt();
  }
};

documentCallbacks.info = documentCallbacks.simpleCallback;
