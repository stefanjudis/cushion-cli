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


completion.content = function(linePartial, level, callback) {
  var completions = Object.keys(cli.doc._body),
      hits;

  hits = completions.filter(
    function(c) {
      return c.indexOf(linePartial) === 0;
    }
  );

  callback(null, [hits.length ? hits : completions, linePartial]);
};
