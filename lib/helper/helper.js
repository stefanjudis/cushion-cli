/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var helper = module.exports = {},
    messages = require('./messages');



/**
 * [getHelp description]
 * @param  {[type]} object [description]
 * @param  {[type]} cli    [description]
 */
helper.getHelp = function(object, input, cli) {
  var args = input.slice(1, input.length),
      commands;

  if (args.length === 0) {
    this._generalHelp(object, cli);
  } else {
    this._specificHelp(args, cli);
  }
};


helper._generalHelp = function(object, cli) {
  commands = Object.keys(object).filter(
              function(command) {
                return (command[0] === '_' && command !== '_simpleCommand');
              }
            ).sort().join('\n').replace(/_/g, '');

  console.log(messages['general']);
  console.log(commands);

  cli.runner();
};


helper._specificHelp = function(args, cli) {
  console.log(messages[args[0]]);

  cli.runner();
};