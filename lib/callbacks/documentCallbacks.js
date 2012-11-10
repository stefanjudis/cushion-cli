/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var documentCallbacks = module.exports = {},
    generalCallbacks = require('./generalCallbacks'),
    cli = require('../cliRunner'),
    extend = require('node.extend');

// extend level commands with general commands
extend(documentCallbacks, generalCallbacks);


documentCallbacks.load = documentCallbacks.simpleCallback;