/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var helper = module.exports = {};


/**
 * [getHelp description]
 * @param  {[type]} object [description]
 * @param  {[type]} cli    [description]
 */
helper.getHelp = function(object, cli) {
  var commands;

  commands = Object.keys(object).filter(
              function(command) {
                return (command[0] === '_' && command !== '_simpleCommand');
              }
            ).sort().join('\n').replace(/_/g, '');

  console.log('Got into trouble?');
  console.log('Available commands are for ' + object.name + ' - level are:');
  console.log(commands);

  cli.runner();
};