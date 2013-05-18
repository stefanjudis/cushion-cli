'use strict';
/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var cli = require('../cliRunner'),
    completion = module.exports = {},
    generalCompletion = require('./generalCompletions'),
    extend = require('node.extend');

// extend level completion with general completion
extend(completion, generalCompletion);


/**
 * Get second level autocompletion for
 * firstlevel === 'deleteRole'
 *
 * @param  {string}   linePartial given line
 *                                partial to check autocorrection for
 * @param  {string}   level       command level
 * @param  {Function} callback    callback function called by
 *                                node readline module
 *
 * @tested
 */
completion.deleteRole = function(linePartial, level, callback) {
  var completions,
      hits;

  cli.user.getRoles(cli.user.name, function(error, response) {
    completions = response;

    hits = completions.filter(
      function(c) {
        return c.indexOf(linePartial) === 0;
      }
    );

    callback(null, [hits.length ? hits: completions, linePartial]);
  });
}
