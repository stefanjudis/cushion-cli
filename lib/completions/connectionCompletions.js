'use strict';
/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var completion = module.exports = {},
    generalCompletion = require('./generalCompletions'),
    cli = require('../cliRunner'),
    extend = require('node.extend');

// extend level completion with general completion
extend(completion, generalCompletion);


/**
 * Get second level autocompletion for
 * firstlevel === 'config'
 *
 * @param  {string}   linePartial given line
 *                                partial to check autocorrection for
 * @param  {string}   level       command level
 * @param  {Function} callback    callback function called by
 *                                node readline module
 */
completion.config = function(linePartial, level, callback) {
  var completions;

  cli.cushion.config(function(error, response) {
    completions = Object.keys(response);

    completion._executeCompletion(completions, linePartial, callback);
  });
};


/**
 * Get second level autocompletion for
 * firstlevel === 'deleteAdmin'
 *
 * @param  {string}   linePartial given line
 *                                partial to check autocorrection for
 * @param  {string}   level       command level
 * @param  {Function} callback    callback function called by
 *                                node readline module
 */
completion.deleteAdmin = function(linePartial, level, callback) {
  var completions;

  cli.cushion.config('admins', function(error, admins) {
    completions = Object.keys(admins);

    completion._executeCompletion(completions, linePartial, callback);
  } );
};


/**
 * Get second level autocompletion for
 * firstlevel === 'deleteConnection'
 *
 * @param  {string}   linePartial given line
 *                                partial to check autocorrection for
 * @param  {string}   level       command level
 * @param  {Function} callback    callback function called by
 *                                node readline module
 */
completion.deleteConnection = function(linePartial, level, callback) {
  var completions;

  completions = Object.keys(cli.connections);

  completion._executeCompletion(completions, linePartial, callback);
};
