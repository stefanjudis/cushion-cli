/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var cPrompt = module.exports = {},
    cHelper = require('../helper/helper'),
    readline = require('readline'),
    cFile = require('../file/file'),
    clc = require('cli-color');


/**
 * Main function for command loop
 * Get command and execute it at given level commands file
 *
 * @param  {object} cli general cli object
 */
cPrompt.command = function(cli, command) {
  if (command) {
    if (cli[cli.level + 'Commands'].commandExists(command, cli)) {

      cli[cli.level + 'Commands'].command(command, cli);

    } else {

      console.log('This is a unknown command.');
      cli.prompt();
    }
  } else {
    cli.prompt();
  }
};


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
 * display prompt and
 * get information like admin name and admin passwort
 * and create admin afterwards
 *
 * @param   {object} cli general cli object
 * @private
 */
cPrompt._promptGetAdmin = function() {
  var args = Array.prototype.slice.call(arguments),
      callback = args[args.length - 1],
      username,
      password;

  // remove callback of arguments
  args = args.slice(0, -1);

  cPrompt.rl.question('What is the name of admin? ', function(username) {
    username = username;

    cPrompt.rl.question('What is the password for ' + username + '? ', function(password) {
      password = password;

      args.unshift(username, password);
      callback.apply(cPrompt.cli.cushion, args);
    });
  });
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


/**
 * display prompt and get name of
 * admin who should be deleted
 *
 * @param   {object} cli general cli object
 * @private
 */
cPrompt._promptDeleteAdmin = function(cli) {
  cPrompt.rl.question('What is the name of admin? ', function(name) {
    cli.cushion.deleteAdmin(
      name,
      cli.connectionCallbacks.deleteAdmin
    );
  });
};


/**
 * delete given connection
 *
 * @param  {string} name name of given conntection
 * @private
 */
cPrompt._deleteConnection = function(name) {
  delete cPrompt.cli.connections[name];

  cFile._writeConnections(cPrompt.cli.connections, function(error) {
    if (!error) {
      console.log(
        '\nConnection ' + clc.yellow(name) + ' deleted.\n'
      );
    } else {
      console.log('\nSomething went wrong. Sorry.\n');
    }

    cPrompt.cli.prompt();
  });
};


/**
 * Set a new tab completer for prompt input.
 * The completer is changing
 * after each level switch (connection, database, ...)
 *
 * @param   {object} cli general cli object
 * @private
 */
cPrompt._setCompleter = function(cli) {
  // completer used by readline module afterwards
  var completer = function(line, callback) {
        var completion = require(
              '../completions/' + cli.level + 'Completions.js'
            ),
            firstLevel = line.split(' ')[0],
            linePartial = line.replace(firstLevel + ' ', ''),
            completions,
            hits;

        // check if a second level completion exists
        if (completion[firstLevel] !== undefined) {

          completion[firstLevel](linePartial, cli.level, callback);

        } else {
          completions = cHelper._getAllCommands(cli[cli.level + 'Commands']);
          hits = completions.filter(
            function(c) {
              return c.indexOf(line) === 0;
            }
          );

          callback(null, [hits.length ? hits : completions, line]);
        }
      };

  cPrompt.rl.completer = completer;
};


/**
 * Callback function called after file reading
 * Handles error or sets connections inside cli object
 * and show next prompt
 *
 * @param {error}  error Object
 * @param {stream} data  Read file data
 * @private
 */
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
 * display prompt and
 * get connection information like host and port
 * and call cli.createConnection() callback afterwards
 *
 * @private
 */
cPrompt._setupConnection = function() {
  var host,
      port;

  // TODO AVOID DEEP NESTING
  cPrompt.rl.question('First of all. Do you want to login as admin? (yes|no) ', function(adminLogin) {
    adminLogin = adminLogin || 'no';

    cPrompt.rl.question('What is the host? (127.0.0.1) ', function(host) {
      host = host || '127.0.0.1';

      cPrompt.rl.question('What is the port? (5984)', function(port) {
        port = port || '5984';

        if (adminLogin.match(/^[yY]*?(es)?$/)) {
          cPrompt._promptGetAdmin(host, port, cPrompt.cli.createConnection);
        } else {
          cPrompt.cli.createConnection('', '', host, port);
        }
      });
    });
  });
};


/**
 * Display prompt and
 * get index number connection that should be deleted
 *
 * @private
 */
cPrompt._setupDeleteSavedConnection = function() {
  var i = 1;

  cPrompt.rl.question(
    'Please choose connection to delete by entering the number: ',
    // that whole function should go inside of a new function in cfile
    function(number) {
      var connections = cPrompt.cli.connections,
          inputNumber = parseInt(number, 10) - 1,
          inputConnectionName = Object.keys(connections)[inputNumber],
          inputConnection = connections[inputConnectionName];

      // check for empty input representing
      // that a new connection should be set up
      if (isNaN(inputNumber)) {
        if (number.length === 0) {
          console.log(clc.yellow('\nNo connection deleted.\n'));
        } else {
          console.log(clc.red('\nInput was not a number. Try again.\n'));
        }
        cPrompt.cli.prompt();
      } else {
        if (inputConnection) {
          cPrompt._deleteConnection(inputConnectionName);
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
 * Display prompt and
 * get index number or index identifier connection that should be saved
 *
 * @private
 */
cPrompt._setupSavedConnection = function() {
  // readline fix, because it does not like multiline questions
  console.log('Press ' + clc.blue('ENTER') + ' to create a new connection');

  // and here the real question
  cPrompt.rl.question(
    'or choose one connection by entering depending number or name: ',
    function(input) {
      var connections = cPrompt.cli.connections,
          connection = connections[input] ||
            connections[Object.keys(connections)[parseInt(input, 10) - 1]];

      if (input.length === 0) {
        console.log(
          clc.yellow('\nPressed ENTER. Let\'s start default setup.\n')
        );

        cPrompt._setupConnection();
      } else {
        if (connection) {
          cPrompt.cli.createConnection(
            connection.username,
            connection.password,
            connection.host,
            connection.port
          );
        } else {
          console.log(
            clc.red('\nUnfortunately your input doesn\'t match a connection\n')
          );

          cPrompt._showConnections(cPrompt._setupSavedConnection);
        }
      }
    }
  );
};


/**
 * Callback function called when file defaults.json was read
 *
 * @param  {object} err  error that may be appeared a reading defaults.json
 * @param  {stream} data read data with saved connections
 * @private
 */
cPrompt._showConnections = function(callback) {
  var i = 1,
      connections = cPrompt.cli.connections || {},
      connectionNames = Object.keys(connections);

  if (connectionNames.length > 0) {

    console.log('Connection file found.');
    console.log('You have the following saved connections:\n');

    connectionNames.forEach(function(connection) {
      var connectionObject = cPrompt.cli.connections[connection];
      console.log(
        '(' + i + ') ' + clc.yellow(connection) + ' -> ' + connectionObject.host
      );

      ++i;
    });

    console.log('');

  } else {
    console.log(clc.yellow('\nUnfortunately it\'s empty...\n'));
  }

  callback();
};


/**
 * Show welcome screen
 *
 * @private
 */
cPrompt._showWelcomeScreen = function() {
  console.log('Welcome to Cushion-Cli.');
  console.log('Enjoy it...\n');
};
