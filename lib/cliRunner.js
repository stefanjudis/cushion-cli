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
    prompt = require('cli-prompt'),
    config = require('./config'),
    connectionCommands = require('./connectionCommands'),
    connectionCallbacks = require('./connectionCallbacks'),
    databaseCommands = require('./databaseCommands'),
    databaseCallbacks = require('./databaseCallbacks'),
    util = require('util');

/**
 * [handleConnectionCommands description]
 * @return {[type]} [description]
 */
cli.handleConnectionCommands = function() {
  prompt(
    clc.blue('Connection -> '),
    (function(val) {
      // check if command for given argument exists
      if (connectionCommands.commandExists(val)) {

        cli.runner = cli.handleConnectionCommands;
        connectionCommands.command(val, this);

      } else if (val.match(/^(quit|exit)$/) !== null) {

        console.log('Bye bye - happy couching');
        process.exit();

        // database gehört in connection commands
      } else {

        console.log(clc.red('This is a unknown command.'));
        cli.handleConnectionCommands();

      }
    }
  ).bind(this));
};

/**
 * [handleDatabaseCommands description]
 * @return {[type]} [description]
 */
cli.handleDatabaseCommands = function() {
  prompt(
    clc.blue('Database ' + clc.yellow(cli.db._name) + ' -> '),
    function(val) {
      if (databaseCallbacks[val] !== undefined) {

        cli.db[val](databaseCallbacks[val]);

      } else if (val === 'connection') {
        console.log(clc.yellow('Switched to connection level.'));

        cli.handleConnectionCommands();
      } else {
        console.log(clc.red('This is a unknown command.'));
        cli.handleDatabaseCommands();
      }*/
    }
  ).bind(this));
};

/**
 * [initPrompt description]
 * @return {[type]} [description]
 */
cli.initPrompt = function() {
  prompt(
    'Where is the couchdb host? ('+ config.host + ') -> ',
    function(val) {
      cli.host = val || config.host;

      prompt(
        'What is the couchdb port? (' + config.port + ') -> ',
        function(val) {
          cli.port = val || config.port;

          prompt(
            'Do you want to login as admin? (y/n) -> ',
            function(val) {
              if (val === 'y') {

                prompt(
                  'What is your username? (' + config.user + ') -> ',
                  function(val) {
                    cli.user = val || config.user;

                    prompt(
                      'What is the password for ' + cli.user + '? (' + config.password + ') -> ',
                      function(val) {
                        cli.password = val || config.password;

                        cli._createConnection(
                          cli.host,
                          cli.port,
                          cli.user,
                          cli.password
                        );
                      }
                    );
                  }
                );
              } else if (val === 'n'){
                cli._createConnection(cli.host, cli.port);
              }
            }
          );
        }
      );
    }
  );
};

/**
 * [_createConnection description]
 * @param   {[type]} host     [description]
 * @param   {[type]} port     [description]
 * @param   {[type]} user     [description]
 * @param   {[type]} password [description]
 * @return  {[type]}          [description]
 * @private
 */
cli._createConnection = function(host, port, user, password) {
  cli.cushion = new cushion.Connection(host, port, user, password);

  cli.cushion.version(function (error, version) {
    if (error) {
      console.log(
        clc.red('Error appeared could not connect to couchdb')
      );
      cli.initPrompt();
    } else {
      cli.handleConnectionCommands();
    }
  });
};

// @TODO Check connection.config