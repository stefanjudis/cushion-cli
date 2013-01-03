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
  var unformattedPromptString = cli.level + ' ✩ ' + cli.name + ' ✩ -> ',
      length = unformattedPromptString.length,
      promptString = clc.blue(cli.level) + ' ✩ ' + clc.yellow(cli.name) + ' ✩ -> ';

  cPrompt._setCompleter(cli);
  cPrompt.rl.setPrompt(promptString, length);
  cPrompt.rl.prompt();
};


/**
 * create connection to couchdb and set it to cli-object
 *
 * @param   {object} result result of user input
 *                          including (host, port, name, password)
 * @private
 */
cli.createConnection = function(username, password, host, port) {
  cli.cushion = new cushion.Connection(
                  host,
                  port,
                  username,
                  password
                );

  //TODO that could be changed to low level request
  cli.cushion.version(function(error, version) {
    if (error) {
      cli.connectionCallbacks.showError(error);

      cli.init();
    } else {
      cli.level = 'connection';
      cli.name = host;

      cli.prompt();

      cPrompt.rl.on('line', function(command){
        cPrompt.command(cli, command);
      });
    }
  });
};
