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
 * firstlevel === 'document'
 *
 * @param  {string}   linePartial given line
 *                                partial to check autocorrection for
 * @param  {string}   level       command level
 * @param  {Function} callback    callback function called by
 *                                node readline module
 */
completion.document = function(linePartial, level, callback) {
  var completions;

  cli.db.allDocuments(function(error, info, allDocs) {
    completions = Object.keys(allDocs);

    completion._executeCompletion(completions, linePartial, callback);
  });
};


/**
 * Get second level autocompletion for
 * firstlevel === 'allViews'
 *
 * @param  {string}   linePartial given line
 *                                partial to check autocorrection for
 * @param  {string}   level       command level
 * @param  {Function} callback    callback function called by
 *                                node readline module
 */
completion.allViews = function(linePartial, level, callback) {
  var completions;

  cli.db.allDocuments(function(error, info, docs) {
    completions = Object.keys(docs).filter(function(key) {
      return key.match(/^_design\/.*$/);
    }).map( function(design) {
      return design.replace(/^_design\//, '');
    });

    completion._executeCompletion(completions, linePartial, callback);
  });
};
