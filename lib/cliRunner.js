/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */
var cli = module.exports = {},
    cushion = require('cushion'),
    clc = require('cli-color'),
    config = require('./config'),
    cPrompt = require('./prompt/prompt');


cli.connectionCommands = require('./connectionCommands');
cli.connectionCallbacks = require('./connectionCallbacks');
cli.databaseCommands = require('./databaseCommands');
cli.databaseCallbacks = require('./databaseCallbacks');


/**
 * display cushion-cli connection setup prompt
 */
cli.init = function() {
  cPrompt.setup(this._createConnection, this);
};


cli.prompt = function() {
  cPrompt._setCompleter(cli);
  cPrompt.rl.setPrompt(clc.blue(cli.level + ' -> '));
  cPrompt.rl.prompt();
};


/**
 * create connection to couchdb and set it to cli-object
 *
 * @param   {object} result result of user input
 *                          including (host, port, name, password)
 * @private
 */
cli._createConnection = function(result) {
  cli.cushion = new cushion.Connection(
                  result.host,
                  result.post,
                  result.name,
                  result.password
                );

  cli.cushion.version(function(error, version) {
    if (error) {
      console.log(error);
      console.log(
        clc.red('Error appeared could not connect to couchdb')
      );

      cli.init();
    } else {
      cli.level = 'connection';

      cli.prompt();

      cPrompt.rl.on('line', function(command){
        cPrompt[cli.level](cli, command);
      });
    }
  });
};

