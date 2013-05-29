'use strict';
/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var userCommands = module.exports = {},
    userCallbacks = require('../callbacks/userCallbacks'),
    generalCommands = require('./generalCommands'),
    cPrompt = require('../prompt/prompt'),
    clc = require('cli-color'),
    extend = require('node.extend');


// extend level commands with general commands
extend(userCommands, generalCommands);


/**
 * Add or delete roles for a given user
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
userCommands._addRole = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length;

  if (argsLength < 1) {
    console.log(
      clc.red('\nPlease define on or more roles.\n')
    );
  } else {
    cli.user.addRole(cli.user.name, args, userCallbacks.addRole);
  }
};


/**
 * Create new User
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 */
userCommands._create = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      password;

  if (argsLength === 0) {
    cPrompt._promptGetUserPassword(
      cli.user.name,
      userCallbacks.create,
      cli.user.create
    );
  } else {
    password = args[0];

    cli.user.create(cli.user.name, password, userCallbacks.create);
  }
};


/**
 * Delete existing user
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 */
userCommands._delete = function(input, cli) {
  cli.user.delete(cli.user.name, userCallbacks.delete);
};


/**
 * General function for commands that don't need
 * specific actions, validation or functionality.
 * It's only executing the particular user function
 * and the depending callback.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 * @tested
 */
userCommands._simpleCommand = function(input, cli) {
  // command is stored at first place in input array
  var command = input[0];

  cli.user[command](cli.user.name, userCallbacks[command]);
};


userCommands._getRoles = userCommands._simpleCommand;

userCommands._deleteRole = userCommands._addRole;
