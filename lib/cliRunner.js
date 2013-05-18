'use strict';
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
    cPrompt = require('./prompt/prompt');


// set up all needed commands and callbacks
cli.connectionCommands = require('./commands/connectionCommands');
cli.connectionCallbacks = require('./callbacks/connectionCallbacks');
cli.databaseCommands = require('./commands/databaseCommands');
cli.databaseCallbacks = require('./callbacks/databaseCallbacks');
cli.documentCommands = require('./commands/documentCommands');
cli.documentCallbacks = require('./callbacks/documentCallbacks');
cli.userCommands = require('./commands/userCommands');
cli.userCallbacks = require('./callbacks/userCallbacks');


/**
 * display cushion-cli connection setup prompt
 *
 * @param {function} cb callback  function called after initialization of
 *                                of prompt, by default it is _createConnection
 */
cli.init = function(cb) {
  var callback = cb || this._createConnection;

  cPrompt.setup(this, callback);
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

  if(cli.unsavedChanges) {
    length += 2;
    promptString = clc.blue(cli.level) + ' ✩ ' +
                    clc.yellow(cli.name) + ' ✩ ' +
                    clc.red('* ') + '-> ';
  }

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
cli.createConnection = function(username, password, host, port, newConnection) {
  cli.cushion = new cushion.Connection(
                  host,
                  port,
                  username,
                  password
                );

  //TODO that could be changed to low level request
  cli.cushion.version(function(error) {
    if (error) {
      cli.connectionCallbacks.showError(error);

      cli.init();
    } else {
      cli.level = 'connection';
      cli.name = host;

      cPrompt.rl.on('line', function(command){
        cPrompt.command(cli, command);
      });

      // give option to save connection if it was successful
      if (newConnection) {
        cPrompt._setupSaveConnection(cli.prompt);
      } else {
        cli.prompt();
      }
    }
  });

  return this;
};
