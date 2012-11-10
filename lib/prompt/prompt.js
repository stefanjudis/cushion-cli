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
    readline = require('readline'),
    cFile = require('../file/file');


/**
 * display prompt and
 * gets connection information to establish it
 *
 * @param  {Function} callback callback called after user input
 */
cPrompt.setup = function(cli) {
  // avoid double initialising on stdin streams
  // after failed cPrompt.setup
  if (!cPrompt.rl) {
    cPrompt.rl = readline.createInterface({
                  input: process.stdin,
                  output: process.stdout
                });
  }

  // set cli to cPrompt to use it later
  this.cli = cli;

  cPrompt._showWelcomeScreen();
  // check if there is an existing
  // default connection file
  cFile.defaultExists(cPrompt._defaultsCallback);
  // cPrompt._setupConnection(cli, callback);
};


cPrompt._defaultsCallback = function(exists) {
  if (exists) {
    cFile.getConnections(cPrompt.showConnections);
  } else {
    cPrompt._setupConnection();
  }
};


cPrompt.showConnections = function(err, data) {
  var i = 1;

  // set parsed connections into cli object
  cPrompt.cli.connections = JSON.parse(data);

  if (err) {
    console.log(data);
    console.log('There was an error at reading default connections.');
  } else {
    console.log('Default connection file found.');
    console.log('You have the following saved connections:\n');

    Object.keys(cPrompt.cli.connections).forEach(function(connection) {
      var connectionObject = cPrompt.cli.connections[connection];
      console.log(
        '(' + i + ') ' + connection + ' -> ' + connectionObject.host
      );

      ++i;
    });

    console.log('\nPress ENTER to create a new connection.\n');

    cPrompt.rl.question('Please choose one connection by entering the number: ', function(number) {
      var inputNumber = parseInt(number, 10) - 1;
          inputConnectionName = Object.keys(cPrompt.cli.connections)[inputNumber],
          inputConnection = cPrompt.cli.connections[inputConnectionName];

      // check for empty input representing
      // that a new connection should be set up
      if (isNaN(inputNumber)) {
        cPrompt._setupConnection();
      } else {
        if (inputConnection) {
          console.log('yeah');
          cPrompt.cli.createConnection(inputConnection);
        } else {
          console.log('Unfortunately your input doesn\'t match a connection');
          cPrompt.showConnections(false, data);
        }
      }
    });
  }
};

cPrompt._setupDefaults = function(cli, callback) {

};


cPrompt._setupConnection = function() {
  var result = {};

  // TODO AVOID DEEP NESTING
  cPrompt.rl.question('First of all. Do you want to login as admin? (yes|no) ', function(adminLogin) {
    result.adminLogin = adminLogin || 'no';

    cPrompt.rl.question('What is the host? (127.0.0.1) ', function(host) {
      result.host = host || '127.0.0.1';

      cPrompt.rl.question('What is the port? (5984)', function(port) {
        result.port = port || '5984';

        if (result.adminLogin.match(/^[yY]*?(es)?$/)) {
          cPrompt._setupAdmin(result);
        } else {
          cPrompt.cli.createConnection(result);
        }
      });
    });
  });
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
cPrompt._setupAdmin = function(result) {
  cPrompt.rl.question('What is the name of new admin? ', function(username) {
    result.username = username;

    cPrompt.rl.question('What is the password for ' + result.username + '? ', function(password) {
      result.password = password;

      cPrompt.cli.createConnection(result);
    });
  });
};


/**
 * Set a new tab completer for prompt input.
 * The completer is changing
 * after each level switch (connection, database, ...)
 *
 * @param   {object} cli general cli object
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


cPrompt._showWelcomeScreen = function() {
  console.log('Welcome to Cushion-Cli.');
  console.log('I hope you enjoy it...\n');
};

/**
 * Main function for command loop
 * Get command and execute it at given level commands file
 *
 * @param  {object} cli general cli object
 */
cPrompt.command = function(cli, command) {
  if (cli[cli.level + 'Commands'].commandExists(command, cli)) {

    cli[cli.level + 'Commands'].command(command, cli);

  } else {

    console.log('This is a unknown command.');
    cli.prompt();
  }
};