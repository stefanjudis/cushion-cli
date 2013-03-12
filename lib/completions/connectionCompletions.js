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
    cHelper = require('../helper/helper'),
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
  var completions,
      hits;

  cli.cushion.config(function(error, response) {
    completions = Object.keys(response);

    hits = completions.filter(
      function(c) {
        return c.indexOf(linePartial) === 0;
      }
    );

    callback(null, [hits.length ? hits : completions, linePartial]);
  });
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
  var completions,
      hits;

  completions = Object.keys(cli.connections);

  hits = completions.filter(
    function(c) {
      return c.indexOf(linePartial) === 0;
    }
  );

  callback(null, [hits.length ? hits : completions, linePartial]);
};
