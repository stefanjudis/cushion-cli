'use strict';
/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var generalCallbacks = module.exports = {},
    cli = require('../cliRunner'),
    clc = require('cli-color'),
    pretty = require('prettyjson').render;

// extend console for lazyness
console.pretty = function(json) {
  console.log(clc.yellow('\nResponse:\n') + pretty(json) + '\n');
};

/**
 * [simpleCallback description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
generalCallbacks.simpleCallback = function(error, response) {
  if (error) {
    generalCallbacks.showError(error);
  } else {
    console.pretty(response);
  }

  cli.prompt();
};


/**
 * [_showError description]
 * @param   {[type]} error [description]
 * @return  {[type]}       [description]
 * @private
 */
generalCallbacks.showError = function(error) {
  console.log(clc.red(
    '\nCommand not working...\n') +
    'Error is: ' + error.error + '\n' +
    'With the reason: ' + error.reason + '\n'
  );
};


/**
 * Callback for allDocuments call in
 * generalCommand 'user' with the purpose
 * to check if the user already exists to set
 * unsavedChanges or not
 *
 * IMPORTANT!!!
 * It's called with context of user name
 *
 * @param  {object|false} error   error objcet from cushion
 * @param  {object}       info    info object from cushion
 * @param  {Array}        allDocs allDocuments
 */
generalCallbacks.users = function(error, info, allDocs){
  var userNames,
      name;

  if (error) {
    generalCallbacks.showError(error);
  } else {
    userNames = Object.keys(allDocs);
    name = this;

    userNames = userNames.filter(function(user) {
      return user === 'org.couchdb.user:' + name;
    });

    if (userNames.length) {
      cli.unsavedChanges = false;
    } else {
      cli.unsavedChanges = true;
    }
  }

  cli.prompt();
};
