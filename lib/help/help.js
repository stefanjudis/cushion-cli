/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var help = module.exports = {},
    messages = require('./messages'),
    cHelper = require('../helper/helper'),
    clc = require('cli-color');

// extend console for lazyness
console.pretty = function(json) {
  console.log(clc.yellow('\nResponse:\n') + pretty(json) + '\n');
};


/**
 * Get help messages.
 *
 * @param  {object} object Level object to look for commands
 * @param  {Array}  input  Array with given prompt input
 * @param  {object} cli    General cli object
 */
help.getHelp = function(object, input, cli) {
  var args = input.slice(1, input.length);

  if (args.length === 0) {
    this._generalHelp(object, cli);
  } else {
    this._specificHelp(args, cli);
  }
};

/**
 * Display general help messages.
 *
 * @param  {object} object Level object to look for commands
 * @param  {object} cli    General cli object
  *@private
 */
help._generalHelp = function(object, cli) {
  console.log(messages['general']);

  console.pretty(cHelper._getAllCommands(object));

  cli.prompt();
};


/**
 * Display specific help messages
 *
 * @param  {Array}  args Array including specific help argument
 * @param  {object} cli  General cli object
 * @private
 */
help._specificHelp = function(args, cli) {
  if (messages[args[0]]) {
    console.log(messages[args[0]]);
  } else {
    console.log('Help for \'' + args[0] + '\' does not exist.');
  }

  cli.prompt();
};