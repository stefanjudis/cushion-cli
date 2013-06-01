'use strict';
/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var databaseCommands = module.exports = {},
    databaseCallbacks = require('../callbacks/databaseCallbacks'),
    generalCommands = require('./generalCommands'),
    cHelper = require('../helper/helper'),
    extend = require('node.extend');


// extend level commands with general commands
extend(databaseCommands, generalCommands);


/**
 * Display all design documents for given database.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
databaseCommands._allDesignDocuments = function(input, cli) {
  cli.db.allDocuments(this.__filterDesigns);
};


/**
 * Display all documents for given database.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
databaseCommands._allDocuments = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      paramsObject;

  if (argsLength > 0) {
    // @zoddy wants to have an object instead an array - let's transform
    paramsObject = cHelper._createParamsObject(args);

    // make call or show message for invalid params
    if (paramsObject !== undefined) {
      cli.db.allDocuments(paramsObject, databaseCallbacks.allDocuments);
    } else {
      console.log('There was invalid parameter input');
      console.log('Look for help with:\n');
      console.log('    $ help allDocuments');

      cli.prompt();
    }
  } else {
    cli.db.allDocuments(databaseCallbacks.allDocuments);
  }
};


/**
 * Display all view for given design document of given database.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
databaseCommands._allViews = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      design = args[0];

  if (argsLength) {
    cli.db.document('_design/' + design).load(databaseCallbacks.designLoaded);
  } else {
    console.log(
     '\nPlease use the \'allViews\' command with 1 argument.\n' +
     'Look for help with:\n' +
     '    $ help allViews\n'
    );

    cli.prompt();
  }
};


/**
 * Switch to document level
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
databaseCommands._document = function(input, cli) {
  var args = input.slice(1, input.length),
      id = args[0];

  this.__setDocumentAndSwitchLevel(cli, id);
};


/**
 * Callback function to filter out
 * designs out of all documents object
 *
 * @param  {Object|null} error error object or null
 * @param  {Object}      info  info about documents
 * @param  {Object}      docs  all documents object
 *
 * @private
 * @tested
 */
databaseCommands.__filterDesigns = function(error, info, docs) {
  var designDocs;

  if (error) {
    databaseCallbacks.showError(error);
  } else {
    designDocs = Object.keys(docs).filter(function(key) {
      return key.match(/^_design\/.*$/);
    }).map( function(design) {
      return design.replace(/^_design\//, '');
    });

    databaseCallbacks.allDesignDocuments(designDocs);
  }
};


/**
 * Set the particular document and switch cushion level
 *
 * @param  {Object             cli general cli object
 * @param  {string|undefined}  id  id of new object
 *
 * @private
 * @tested
 */
databaseCommands.__setDocumentAndSwitchLevel = function(cli, id) {
  // that can be done better with arguments call but I'm lazy
  if (id) {
    cli.doc = cli.db.document(id);
    cli.name = id;
  } else {
    cli.doc = cli.db.document();
    cli.name = '...';
  }

  cli.doc.load(cli.documentCallbacks.load);
};


/**
 * Display temporary view for given database.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
databaseCommands._tmpView = function(input, cli) {
  var args = input.slice(1, input.length),
      map = args.shift(),
      newArgs = [map],
      paramsObject,
      reduce;

  // if only mapping function was set
  // args is empty at this point
  if (args.length <= 0 && !map) {
    console.log(
     '\nPlease use the \'tmpView\' command at least with 1 argument.\n' +
     'Look for help with:\n' +
     '    $ help tmpView\n'
    );

    cli.prompt();

    return;
  }

  if (args.length && args[args.length - 1].match(/function/g)) {
    reduce = args.pop();
  }

  // TODO what happens if there is a parse error????
  // define case for return undefined
  paramsObject = cHelper._createParamsObject(args);

  if (paramsObject && Object.keys(paramsObject).length) {
    newArgs.push(paramsObject);
  } else {
    if (paramsObject === undefined) {
      console.log('There was invalid parameter input');
      console.log('Look for help with:\n');
      console.log('    $ help view');

      cli.prompt();

      return;
    }
  }

  if (reduce) {
    newArgs.push(reduce);
  }

  newArgs.push(databaseCallbacks.view);

  cli.db.temporaryView.apply(cli.db, newArgs);
};


/**
 * Display given view for given database.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
databaseCommands._view = function(input, cli) {
  var args = input.slice(1, 3),
      argsLength = args.length,
      params = input.slice(3, input.length),
      paramsObject;

  // check query params for view
  if (argsLength > 1) {
    // @zoddy wants to have an object instead an array - let's transform
    paramsObject = cHelper._createParamsObject(params);

    if (paramsObject !== undefined) {
      args.push(paramsObject, databaseCallbacks.view);
      cli.db.view.apply(cli.db, args);
    } else {
      console.log('There was invalid parameter input');
      console.log('Look for help with:\n');
      console.log('    $ help view');

      cli.prompt();
    }
  } else {
    console.log(
     'Please, use the \'view\' command with 2 or more arguments.\n' +
     'Look for help with:\n' +
     '    $ help view'
    );

    cli.prompt();
  }
};


/**
 * General function for commands that don't need
 * specific actions, validation or functionality.
 * It's only executing the particular cushion function
 * and the depending callback.
 *
 * @param   {Array}  command Array of ' ' splitted input arguments
 * @param   {Object} cli     general cli object
 *
 * @private
 * @tested
 */
databaseCommands._simpleCommand = function(input, cli) {
  var command = input[0];

  cli.db[command](databaseCallbacks[command]);
};


databaseCommands._cleanup =
databaseCommands._compact =
databaseCommands._create =
databaseCommands._destroy =
databaseCommands._ensureFullCommit =
databaseCommands._exists =
databaseCommands._info = databaseCommands._simpleCommand;
