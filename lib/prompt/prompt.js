/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var cPrompt = module.exports = {},
    cHelper = require('../helper/helper'),
    prompt = require('prompt'),
    readline = require('readline');


/**
 * display prompt and
 * gets connection information to establish it
 *
 * @param  {Function} callback callback called after user input
 */
cPrompt.setup = function(callback, cli) {
  var promptResult = {};

  // avoid double initialising on stdin streams
  // after failed cPrompt.setup
  if (!cPrompt.rl) {
    cPrompt.rl = readline.createInterface({
                  input: process.stdin,
                  output: process.stdout
                });
  }

  // TODO AVOID DEEP NESTING
  cPrompt.rl.question('First of all. Do you want to login as admin? (yes|no) ', function(adminLogin) {
    promptResult.adminLogin = adminLogin || 'no';

    cPrompt.rl.question('What is the host? (127.0.0.1) ', function(host) {
      promptResult.host = host || '127.0.0.1';

      cPrompt.rl.question('What is the port? (5984)', function(port) {
        promptResult.port = port || '5984';

        if (promptResult.adminLogin.match(/^[yY]*?(es)?$/)) {
          cPrompt._setupAdmin(promptResult, callback);
        } else {
          callback(promptResult);
        }
      });
    });
  });
};


/**
 * [_setCompleter description]
 * @param {[type]} cli [description]
 */
cPrompt._setCompleter = function(cli) {
  var completer = function(line) {
        var completions = cHelper._getAllCommands(cli[cli.level + 'Commands']);
        var hits = completions.filter(
          function(c) {
            return c.indexOf(line) === 0;
          }
        );
        // show all completions if none found
        return [hits.length ? hits : completions, line];
      };

  // TODO c&p from readline module? why do i have to do that?
  cPrompt.rl.completer = completer.length === 2 ? completer : function(v, callback) {
    callback(null, completer(v));
  };
};

/**
 * display prompt and
 * get connection information like admin name and admin password
 * and call callback afterwards
 *
 * @param   {object}   result   object with inputted connection information
 * @param   {Function} callback callback called after user input
 * @private
 */
cPrompt._setupAdmin = function(result, callback) {
  cPrompt.rl.question('What is the name of new admin? ', function(name) {
    result.name = name;

    cPrompt.rl.question('What is the password for ' + result.name + ' ? ', function(password) {
      result.password = password;

      callback(result);
    });
  });
};


/**
 * display prompt and
 * get information like admin name and admin passwort
 * and create admin afterwards
 *
 * @param   {object} cli general cli object
 * @private
 */
cPrompt._createAdmin = function(cli) {
  var result = {};

  cPrompt.rl.question('What is the name of new admin? ', function(name) {
    result.name = name;

    cPrompt.rl.question('What is the password for ' + result.name + '? ', function(password) {
      result.password = password;
        cli.cushion.createAdmin(
          result.name,
          result.password,
          cli.connectionCallbacks.createAdmin
        );
    });
  });
};


/**
 * display prompt and get name of
 * admin who should be deleted
 *
 * @param   {object} cli general cli object
 * @private
 */
cPrompt._deleteAdmin = function(cli) {
  cPrompt.rl.question('What is the name of admin? ', function(name) {
    cli.cushion.deleteAdmin(
      name,
      cli.connectionCallbacks.deleteAdmin
    );
  });
};


/**
 * display errors a nicer way and
 * start setup again
 *
 * @private
 */
cPrompt._handleError = function() {
  console.log(
    'There was a problem with the prompt.\n' +
    'Let\'s start all over again...'
  );

  cPrompt.setup();
};


/**
 * Main function for connection loop
 * Get command and execute it at connectionCommands.js
 *
 * @param  {object} cli general cli object
 */
cPrompt.connection = function(cli, command) {
  if (cli.connectionCommands.commandExists(command, cli)) {

    cli.level = 'connection';
    cli.connectionCommands.command(command, cli);

  } else {

    console.log('This is a unknown command.');
    cli.prompt();
  }
};


/**
 * Main function for database loop
 * Get command and execute it at databaseCommands.js
 *
 * @param  {object} cli general cli object
 */
cPrompt.database = function(cli, command) {
  if (cli.databaseCommands.commandExists(command, cli)) {

    cli.level = 'database';
    cli.databaseCommands.command(command, cli);

  } else {

    console.log('This is a unknown command.');
    cli.prompt();
  }
};