'use strict';
/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var userCallbacks = module.exports = {},
    generalCallbacks = require('./generalCallbacks'),
    cli = require('../cliRunner'),
    clc = require('cli-color'),
    extend = require('node.extend');


// extend level commands with general commands
extend(userCallbacks, generalCallbacks);


/**
 * Callback called after addRole command
 *
 * @param  {object|false} error error
 * @param  {bool}         added added
 */
userCallbacks.addRole = function(error, added) {
  if (added) {
    console.log(clc.yellow('\nRole(s) were successfully added.\n'));
  } else {
    userCallbacks.showError(error);
  }

  cli.prompt();
};


/**
 * Callback called after create command
 *
 * @param  {object|false} error   error
 * @param  {bool}         created created
 *
 * @tested
 */
userCallbacks.create = function(error, created) {
  if (error) {
    userCallbacks.showError(error);
  } else {
    if (created) {
      cli.unsavedChanges = false;
      console.log(clc.yellow('\nUser was successfully created.\n'));
    } else {
      cli.unsavedChanges = true;
      userCallbacks.showError(error);
    }
  }

  cli.prompt();
};


/**
 * Callback called after deleteRole command
 *
 * @param  {object|false} error   error
 * @param  {bool}         deleted deleted
 */
userCallbacks.delete = function(error, deleted) {
  if (deleted) {
    console.log(clc.yellow('\nUser was succesfully deleted.\n'));
  } else {
    userCallbacks.showError(error);
  }

  cli.level = 'connection';
  cli.name = cli.cushion.option('host');
  cli.prompt();
};


/**
 * Callback called after deleteRole command
 *
 * @param  {object|false} error   error
 * @param  {bool}         deleted deleted
 */
userCallbacks.deleteRole = function(error, deleted) {
  if (deleted) {
    console.log(clc.yellow('\nRole(s) were successfully deleted.\n'));
  } else {
    userCallbacks.showError(error);
  }

  cli.prompt();
};


/**
 * Callback called after getRoles command
 *
 * @param  {object|false}      error error
 * @param  {bool|object}       roles list of roles
 */
userCallbacks.getRoles = function(error, roles) {
  if (roles) {
    console.log(clc.yellow('\nUser has the following roles:'));
    console.pretty(roles);
  } else {
    userCallbacks.showErrow(error);
  }

  cli.prompt();
};
