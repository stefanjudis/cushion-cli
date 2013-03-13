/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var databaseCallbacks = module.exports = {},
    generalCallbacks = require('./generalCallbacks'),
    cli = require('../cliRunner'),
    clc = require('cli-color'),
    extend = require('node.extend');


// extend level commands with general commands
extend(databaseCallbacks, generalCallbacks);


databaseCallbacks.exists = function(error, response) {
  if (error) {
    databaseCallbacks.showError(error);
  } else {
    if (response === true) {
      console.log(clc.yellow('\nDatabase already exists.\n'));
    } else {
      console.log(clc.yellow('\nDatabase doesn\'t exist yet.\n'));
    }
  }

  cli.prompt();
};


/**
 * [create description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
databaseCallbacks.create = function(error, response) {
  if (error) {
    databaseCallbacks.showError(error);
  } else {
    if (response === true) {
      console.log(clc.green('\nDatabase created.\n'));
    } else {
      console.log(clc.red('\nDatabase couldn\'t be created\n'));
    }
  }

  cli.prompt();
};


/**
 * [destroy description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
databaseCallbacks.destroy = function(error, response) {
  if (error) {
    databaseCallbacks.showError(error);
  } else {
    if (response === true) {
      console.log(
        clc.green('\nDatabase deleted.\n') + '\nSwitched to connection level\n'
      );

      cli.level = 'connection';
      cli.name = cli.cushion.option('host');

      cli.prompt();
    } else {
      console.log(clc.red('\nDatabase couldn\'t be deleted\n'));
    }
  }

  cli.prompt();
};


/**
 * Callback for allDesignDocuments command
 *
 * @param  {Array} designs filtered designs
 */
databaseCallbacks.allDesignDocuments = function(designs) {
  console.log(
    'This databases includes of ' + designs.length + ' design documents.'
  );

  console.pretty(designs);

  cli.prompt();
};


/**
 * [allDocuments description]
 * @param  {[type]} error   [description]
 * @param  {[type]} info    [description]
 * @param  {[type]} allDocs [description]
 */
databaseCallbacks.allDocuments = function(error, info, allDocs) {
  if (error) {
    databaseCallbacks.showError(error);
  } else {
    console.log('This databases exists of ' + info.total + ' documents.');
    console.log('Displayed result has an offset of ' + info.offset);
    console.pretty(allDocs);
  }

  cli.prompt();
};


/**
 * [view description]
 * @param  {[type]} error [description]
 * @param  {[type]} info  [description]
 * @param  {[type]} rows  [description]
 * @return {[type]}       [description]
 */
databaseCallbacks.view = function(error, info, rows) {
  var keys,
      row;

  if (error) {
    databaseCallbacks.showError(error);
  } else {
    console.log('This databases exists of ' + info.total + ' documents.');
    console.log('Displayed result has an offset of ' + info.offset + '.\n');
    console.pretty(rows);
  }

  cli.prompt();
};


databaseCallbacks.cleanup =
databaseCallbacks.compact =
databaseCallbacks.ensureFullCommit =
databaseCallbacks.info = databaseCallbacks.simpleCallback;
