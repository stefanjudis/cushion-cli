/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var completion = module.exports = {},
    cli = require('../cliRunner'),
    cHelper = require('../helper/helper');

/**
 * Get second level autocompletion for
 * firstlevel === 'database'
 *
 * @param  {string}   linePartial given line
 *                                partial to check autocorrection for
 * @param  {string}   level       command level
 * @param  {Function} callback    callback function called by
 *                                node readline module
 */
completion.database = function(linePartial, level, callback) {
  var completions,
      hits;

  cli.cushion.listDatabases(function(error, response) {
    completions = response.map(function(c) {
      return c._name;
    });

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
 * firstlevel === 'help'
 *
 * @param  {string}   linePartial given line
 *                                partial to check autocorrection for
 * @param  {string}   level       command level
 * @param  {Function} callback    callback function called by
 *                                node readline module
 */
completion.help = function(linePartial, level, callback) {
  var completions = cHelper._getAllCommands(cli[level + 'Commands']),
      hits;

  hits = completions.filter(
    function(c) {
      return c.indexOf(linePartial) === 0;
    }
  );

  callback(null, [hits.length ? hits : completions, linePartial]);
};
