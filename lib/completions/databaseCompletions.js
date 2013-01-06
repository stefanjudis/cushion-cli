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

completion.document = function(linePartial, level, callback) {
  var completions,
      hits;

  cli.db.allDocuments(function(error, info, allDocs) {
    completions = Object.keys(allDocs);

    hits = completions.filter(
      function(c) {
        return c.indexOf(linePartial) === 0;
      }
    );

    callback(null, [hits.length ? hits : completions, linePartial]);
  });
};
