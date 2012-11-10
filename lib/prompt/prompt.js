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
    cFile = require('../file/file'),
    clc = require('cli-color');


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
  cFile.defaultExists(cPrompt._defaultsCallback);
};


/**
 * Callback function called after checking if
 * default connection file already exists
 *
 * @param  {bool} exists defaults.json exist
 * @private
 */
cPrompt._defaultsCallback = function(exists) {
  if (exists) {
    cFile.getConnections(cPrompt._setConnections);
  } else {
    cPrompt._setupConnection();
  }
};


cPrompt._setConnections = function(error, data) {
  if (error) {
    console.log('There was an error at reading default connections.');
  } else {
    // set parsed connections into cli object
    cPrompt.cli.connections = JSON.parse(data);
    cPrompt._showConnections(cPrompt._setupSavedConnection);
  }
};

/**
 * Callback function called when file defaults.json was read
 *
 * @param  {object} err  error that may be appeared a reading defaults.json
 * @param  {stream} data read data with saved connections
 * @private
 */
cPrompt._showConnections = function(callback) {
  var i = 1;

  console.log('Saved connections found.');
  console.log('You have the following saved connections:\n');

  Object.keys(cPrompt.cli.connections).forEach(function(connection) {
    var connectionObject = cPrompt.cli.connections[connection];
    console.log(
      '(' + i + ') ' + clc.yellow(connection) + ' -> ' + connectionObject.host
    );

    ++i;
  });

  // dirty for an empty line, i know
  console.log('');

  callback();
};


/**
 * Display prompt and
 * get index number connection that should be saved
 *
 * @private
 */
cPrompt._setupSavedConnection = function() {
  var i = 1;

  console.log(
    'Press ' + clc.blue('ENTER') + ' to create a new connection.\n'
  );

  cPrompt.rl.question(
    'Please choose one connection by entering the number: ',
    function(number) {
      var connections = cPrompt.cli.connections,
          inputNumber = parseInt(number, 10) - 1,
          inputConnectionName = Object.keys(connections)[inputNumber],
          inputConnection = connections[inputConnectionName];

      // check for empty input representing
      // that a new connection should be set up
      if (isNaN(inputNumber)) {
        cPrompt._setupConnection();
      } else {
        if (inputConnection) {
          cPrompt.cli.createConnection(inputConnection);
        } else {
          console.log('Unfortunately your input doesn\'t match a connection');
          cPrompt.showConnections(false, data);
        }
      }
    }
  );
};


/**
 * Display prompt and
 * get index number connection that should be deleted
 *
 * @private
 */
cPrompt._setupDeleteSavedConnection = function() {
  var i = 1;

  console.log(
    'Press ' + clc.blue('ENTER') + ' to delete no connection.\n'
  );

  cPrompt.rl.question(
    'Please choose connection to delete by entering the number: ',
    function(number) {
      var connections = cPrompt.cli.connections,
          inputNumber = parseInt(number, 10) - 1,
          inputConnectionName = Object.keys(connections)[inputNumber],
          inputConnection = connections[inputConnectionName];

      // check for empty input representing
      // that a new connection should be set up
      if (isNaN(inputNumber)) {
        console.log(clc.red('Input was not a number. Try again.\n'));
        cPrompt.cli.prompt();
      } else {
        if (inputConnection) {
          delete cPrompt.cli.connections[inputConnectionName];

          cFile._writeConnections(cPrompt.cli.connections, function(error) {
            if (!error) {
              console.log(
                '\nConnection ' + clc.yellow(inputConnectionName) + ' deleted.\n'
              );
            } else {
              console.log('\nSomething went wrong. Sorry.\n');
            }

            cPrompt.cli.prompt();
          });

        } else {
          console.log(
            clc.red('\nUnfortunately your input doesn\'t match a connection\n')
          );

          cPrompt._showConnections(cPrompt._setupDeleteSavedConnection);
        }
      }
    }
  );
};


/**
 * display prompt and
 * get connection information like host and port
 * and call cli.createConnection() callback afterwards
 *
 * @private
 */
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
 * and call cli.createConnection() callback afterwards
 *
 * @param   {object}   result   object with inputted connection information
 * @param   {Function} callback callback called after user input
 *
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
 *
 * @private
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
 *
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
 *
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