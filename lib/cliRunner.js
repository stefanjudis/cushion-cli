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
    // config = require('./config'),
    cPrompt = require('./prompt/prompt'),
    cFile = require('./file/file');


// set up all needed commands and callbacks
cli.connectionCommands = require('./commands/connectionCommands');
cli.connectionCallbacks = require('./callbacks/connectionCallbacks');
cli.databaseCommands = require('./commands/databaseCommands');
cli.databaseCallbacks = require('./callbacks/databaseCallbacks');
cli.documentCommands = require('./commands/documentCommands');
cli.documentCallbacks = require('./callbacks/documentCallbacks');
cli.generalCommands = require('./commands/generalCommands');


/**
 * display cushion-cli connection setup prompt
 */
cli.init = function() {
  cPrompt.setup(this, this._createConnection);
};


/**
 * Show and set new prompt to get new input.
 * Completer will be set new again depending
 * on particular level.
 */
cli.prompt = function() {
  cPrompt._setCompleter(cli);
  cPrompt.rl.setPrompt(
    clc.blue(
      cli.level + clc.yellow(' ✩ ' + cli.name + ' ✩') + ' -> ')
    );
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

  //TODO that could be changed to low level request
  cli.cushion.version(function(error, version) {
    if (error) {
      cli.connectionCallbacks._showError(error);

      cli.init();
    } else {
      cli.level = 'connection';
      cli.name = result.host;

      cli.prompt();

      cPrompt.rl.on('line', function(command){
        cPrompt[cli.level](cli, command);
      });
    }
  });
};