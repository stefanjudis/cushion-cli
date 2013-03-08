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

userCallbacks.addRole = function(error, added) {
  if (added) {
    console.log(clc.yellow('\nRole(s) were successfully added.\n'));
  } else {
    userCallbacks.showError(error);
  }

  cli.prompt();
};


userCallbacks.deleteRole = function(error, deleted) {
  if (deleted) {
    console.log(deleted);
    console.log(clc.yellow('\nRole(s) were successfully deleted.\n'));
  } else {
    userCallbacks.showError(error);
  }

  cli.prompt();
};

userCallbacks.getRoles = function(error, roles) {
  if (roles) {
    console.log(clc.yellow('\nUser has the following roles:'));
    console.pretty(roles);
  } else {
    userCallbacks.showErrow(error);
  }

  cli.prompt();
};
