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
