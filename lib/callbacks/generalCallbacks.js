/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var generalCallbacks = module.exports = {},
    cli = require('../cliRunner'),
    clc = require('cli-color');

/**
 * [simpleCallback description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
generalCallbacks.simpleCallback = function(error, response) {
  console.log(error || response);
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
    'Error is: ' + error.error + "\n" +
    'With the reason: ' + error.reason + '\n'
  );
};
