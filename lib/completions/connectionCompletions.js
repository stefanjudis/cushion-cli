/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var completion = module.exports = {},
    cli = require('../cliRunner');

completion.database = function(linePartial, callback) {
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
