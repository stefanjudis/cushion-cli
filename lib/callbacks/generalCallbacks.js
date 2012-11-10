/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var generalCallbacks = module.exports = {},
    cli = require('../cliRunner');

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
