'use strict';
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


/**
 * Callback of exists cushion call
 * that changes unsavedChanges to true
 * if database exists and to false if it
 * does not exist
 *
 * @param  {object|false} error  cushion error
 * @param  {bool}         exists existance of database
 *
 * @tested
 */
databaseCallbacks.exists = function(error, exists) {
  if (error) {
    databaseCallbacks.showError(error);
  } else {
    if(exists) {
      cli.unsavedChanges = false;
    } else {
      cli.unsavedChanges = true;
    }
  }

  cli.prompt()
};


/**
 * callback of create database command
 * that shows needed output and changes unsavedChanges
 * status depending on successful database
 * creation
 *
 * @param  {object|false} error    cushion error
 * @param  {bool}         response result of database creation
 *
 *
 */
databaseCallbacks.create = function(error, response) {
  if (error) {
    databaseCallbacks.showError(error);
  } else {
    if (response === true) {
      cli.unsavedChanges = false;
      console.log(clc.green('\nDatabase created.\n'));
    } else {
      cli.unsavedChanges = true;
      console.log(clc.red('\nDatabase couldn\'t be created\n'));
    }
  }

  cli.prompt();
};


/**
 * [destroy description]
 * @param  {Object} error    [description]
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
 * @param  {Object} error   [description]
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
 * Callback for allViews command
 *
 * @param  {Array} views filtered views
 */
databaseCallbacks.allViews = function(views) {
  console.log(
    'This design document includes of ' + views.length + ' views.'
  );

  console.pretty(views);

  cli.prompt();
};


/**
 * Callback for loaded design
 * called in allViews command
 *
 * @param  {Object} error    [description]
 * @param  {Object} document [description]
 */
databaseCallbacks.designLoaded = function(error, document) {
  var views;

  if (error) {
    databaseCallbacks.showError(error);

    cli.prompt();
  } else {
    views = Object.keys(document.body('views'));

    databaseCallbacks.allViews(views);
  }
};

/**
 * [view description]
 * @param  {Object} error [description]
 * @param  {[type]} info  [description]
 * @param  {[type]} rows  [description]
 */
databaseCallbacks.view = function(error, info, rows) {

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
