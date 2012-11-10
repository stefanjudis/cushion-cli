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
    extend = require('node.extend');


// extend level commands with general commands
extend(databaseCallbacks, generalCallbacks);


databaseCallbacks.exists = function(error, response) {
  if (error) {
    databaseCallbacks.showError(error);
  } else {
    if (response === true) {
      console.log('Database already exists.');
    } else {
      console.log('Database doesn\'t exist yet.');
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
      console.log('Database created.');
    } else {
      console.log('Database couldn\'t be created');
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
      console.log('Database deleted.\nSwitched to connection level');

      cli.level = 'connection';
      cli.prompt();
    } else {
      console.log('Database couldn\'t be deleted');
    }
  }

  cli.prompt();
};


/**
 * [allDocuments description]
 * @param  {[type]} error   [description]
 * @param  {[type]} info    [description]
 * @param  {[type]} allDocs [description]
 */
databaseCallbacks.allDocuments = function(error, info, allDocs) {
  var columnWidth = 28,
      displayKey;

  if (error) {
    databaseCallbacks.showError(error);
  } else {
    console.log('This databases exists of ' + info.total + ' documents.');
    console.log('Displayed result has an offset of ' + info.offset + '.\n');

    // iterate over allDocs object
    console.log('             id              |       revision hash        ');
    Object.keys(allDocs).forEach(function(key) {
      console.log('    ----------------------------------------------------------');
      displayKey = key;

      if (displayKey.length <= columnWidth) {
        while (displayKey.length < columnWidth) {
          displayKey = displayKey + ' ';
        }
      } else {
        displayKey = displayKey.substr(0, columnWidth);
      }
      console.log(displayKey + ' | ' + allDocs[key]);
    });
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

    keys = Object.keys(rows[0]);

    rows.forEach(function(entry) {
      console.log('----------------------------');

      keys.forEach(function(key) {
        if (key === 'value') {
          console.log('(' + key + ') ->');
          console.log(entry[key]);
        } else {
          console.log('(' + key + ') -> ' + entry[key]);
        }
      });
    });
  }

  cli.prompt();
};


databaseCallbacks.info = databaseCallbacks.simpleCallback;
