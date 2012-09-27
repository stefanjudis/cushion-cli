/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var cPrompt = module.exports = {},
    prompt = require('prompt'),
    //messages = require('./messages');
    schema = {
      properties: {
        command: {
          pattern: /^[a-zA-Z0-9\s\-\_]+$/,
          message: 'Name must be only letters, numbers, spaces or dashes',
          required: true
        }
      }
    };


/**
 * [setup description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
cPrompt.setup = function(callback) {
  prompt.message = 'Cushion'.blue;

  prompt.get(
    {
      properties: {
        admin: {
          message: 'First of all. Do you want to login as admin?',
          validator: /y[es]*|n[o]?/,
          warning: 'Must respond y[es] or n[o]',
          default: 'no'
        },
        host: {
          message: 'What is the host?',
          default: '127.0.0.1',
        },
        port: {
          message: 'What is the port?',
          default: '5984'
        }
      }
    }, function(error, result) {
      if (!error) {
        if (result.admin.match(/y[es]*/)) {
          cPrompt._setupAdmin(result, callback);

        } else {
          callback(result);
        }
      } else {
        cPrompt._showError();
      }
    }
  );
};


/**
 * [_setupAdmin description]
 * @param   {[type]}   result   [description]
 * @param   {Function} callback [description]
 * @return  {[type]}            [description]
 * @private
 */
cPrompt._setupAdmin = function(result, callback) {
  prompt.get(
    {
      properties: {
        name: {
          message: 'What is the admin name?'
        },
        password: {
          message: 'What is the password',
          hidden: true
        }
      }
    },
    function(error, adminData) {
      if (!error) {
        result.name = adminData.name;
        result.password = adminData.password;

        callback(result);
      } else {
        cPrompt._showError();
      }
    }
  );
};


/**
 * [_createAdmin description]
 * @param   {[type]} cli [description]
 * @return  {[type]}     [description]
 * @private
 */
cPrompt._createAdmin = function(cli) {
  prompt.get(
    {
      properties: {
        name: {
          message: 'What is the admin name?'
        },
        password: {
          message: 'What is the password',
          hidden: true
        }
      }
    },
    function(error, result) {
      if (!error) {
        cli.cushion.createAdmin(
          result.name,
          result.password,
          cli.connectionCallbacks.createAdmin
        );
      } else {
        cPrompt._showError();
      }
    }
  );
};


/**
 * [_deleteAdmin description]
 * @param   {[type]} cli [description]
 * @return  {[type]}     [description]
 * @private
 */
cPrompt._deleteAdmin = function(cli) {
  prompt.get(
    {
      properties: {
        name: {
          'message': 'What is the admin name?'
        }
      }
    },
    function(error, result) {
      if (!error) {
        cli.cushion.deleteAdmin(
          result.name,
          cli.connectionCallbacks.deleteAdmin
        );
      } else {
        cPrompt._showError();
      }
    }
  );
};


/**
 * [_showError description]
 * @return  {[type]} [description]
 * @private
 */
cPrompt._showError = function() {
  console.log(
    'There was a problem with the prompt.\n' +
    'Let\'s start all over again...'
  );

  cPrompt.setup();
};


/**
 * [connection description]
 * @param  {[type]} cli [description]
 * @return {[type]}     [description]
 */
cPrompt.connection = function(cli) {
  prompt.delimiter = ' <> '.red;
  prompt.message = 'Connection'.blue;
  prompt.start();

  prompt.get(schema, function (err, result) {
    if (!err) {
      var command = result.command;

      if (cli.connectionCommands.commandExists(command)) {

        cli.runner = cli.handleConnectionCommands;
        cli.connectionCommands.command(command, cli);

      } else if (command.match(/^(quit|exit)$/) !== null) {

        console.log('Bye bye - happy couching');
        process.exit();

      } else {

        console.log('This is a unknown command.');
        cli.handleConnectionCommands();

      }
    }
  });
};


/**
 * [database description]
 * @param  {[type]} cli [description]
 * @return {[type]}     [description]
 */
cPrompt.database = function(cli) {
  var message = 'Database ' + cli.db._name;

  prompt.delimiter = ' <> '.red;
  prompt.message =  message.blue;

  prompt.get(schema, function (err, result) {
    if (!err) {
      var command = result.command;

      if (cli.databaseCommands.commandExists(command)) {

        cli.runner = cli.handleDatabaseCommands;
        cli.databaseCommands.command(command, cli);

      } else if (command.match(/^(quit|exit)$/) !== null) {

        console.log('Bye bye - happy couching');
        process.exit();

      } else {

        console.log('This is a unknown command.');
        cli.handleDatabaseCommands();
      }
    }
  });
};