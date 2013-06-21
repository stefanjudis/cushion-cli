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
    cPrompt = require('./prompt/prompt'),
    fs = require('fs');


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
 * Init cli runner and call prompt setup when no
 * process argument options are available or create
 * connection directly if they are
 *
 * @param {Object|Function} options object for initialization or callback
 * @param {Function}        cb      callback function called after
 *                                  initialization of prompt,
 *                                  by default it is _createConnection
 *
 * @tested
 */
cli.init = function(options, cb) {
  var callback = (typeof options === 'function') ?
                    options :
                    cb || cli.createConnection;

  cPrompt.init(cli);

  if (typeof options === 'object' && Object.keys(options).length) {
    cli.initWithOptions(options, callback);
  } else {
    cPrompt.setup(this, callback);
  }
};


/**
 * Init cli runner and create connection when
 * process arguments are available
 *
 * @param  {Object}   options  process arguments
 * @param  {Function} callback callback
 *
 * @tested
 */
cli.initWithOptions = function(options, callback) {
  var admin = options.a || options.admin,
      host = options.h || options.host,
      port = options.p || options.port;

  if (options.v || options.version) {
    // TODO encapsulate callback
    fs.readFile(__dirname + '/../package.json', function(error, data) {
      if (error) {
        console.log(error);
      } else {
        try{
          var packageJSON = JSON.parse(data);

          console.log(packageJSON.version);
        } catch(e) {
          console.log(e);
        }
      }

      process.exit();
    })
  } else if (host && port) {
    admin = options.a || options.admin;

    if (admin) {
      cPrompt._promptGetAdminPassword(
        admin,
        [host, port, callback]
      );
    } else {
      cPrompt.showWelcomeScreen(function() {
        callback('', '', options.h, options.p);
      });
    }
  } else {
    console.log(
      clc.red('\nOptions did not match. Starting default setup...\n')
    );

    cli.init();
  }
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
 * Create connection to couchdb and set it to cli object
 *
 * @param  {String}  username      username for couchdb
 * @param  {String}  password      passwort for couchdb
 * @param  {String}  host          host of couchdb
 * @param  {String}  port          port of couchdb
 * @param  {Boolean} newConnection save connection
 *
 * @private
 */
cli.createConnection = function(username, password, host, port, newConnection) {
  cli._setCushion(username, password, host, port);

  //TODO that could be changed to low level request
  cli.cushion.version(function(error) {
    if (error) {
      console.log(
        clc.red('\nCouchDB is not available under ' + host + ':' + port + '.')
      );
      cli.connectionCallbacks.showError(error);
      console.log(clc.green('Restarting cushion with welcome prompt...\n'));

      cli.init();
    } else {
      console.log(
        clc.green('\nYeah! You are now connected to ' + host + ':' + port + '!\n')
      );
      cli.level = 'connection';
      cli.name = host;

      cPrompt.rl.on('line', function(command){
        cPrompt.command(cli, command);
      });

      if (blockSavePrompt) {
        cli.prompt();
      } else {
        cPrompt._setupSaveConnection(cli.prompt);
      }
    }
  });

  return this;
};


/**
 * Set cushion object to cli object
 *
 * @param  {String} username      username for couchdb
 * @param  {String} password      passwort for couchdb
 * @param  {String} host          host of couchdb
 * @param  {String} port          port of couchdb
 *
 * @private
 */
cli._setCushion = function(username, password, host, port) {
  cli.cushion = new cushion.Connection(
                    host,
                    port,
                    username,
                    password
                  );
}
