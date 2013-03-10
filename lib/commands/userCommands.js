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
 */
userCommands._addRole =
userCommands._deleteRole = function(input, cli) {
  var command = input[0],
      args = input.slice(1, input.length),
      argsLength = args.length;

  if (argsLength < 1) {
    console.log(
      clc.red('\nPlease define on or more roles.\n')
    );
  } else {
    cli.user[command](cli.user.name, args, userCallbacks[command]);
  }
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
 */
userCommands._simpleCommand = function(input, cli) {
  // command is stored at first place in input array
  var command = input[0];

  cli.user[command](cli.user.name, userCallbacks[command]);
};


userCommands._getRoles = userCommands._simpleCommand;