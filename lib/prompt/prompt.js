'use strict';

/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var cPrompt = module.exports = {},
    cFile = require('../file/file'),
    cHelper = require('../helper/helper'),
    clc = require('cli-color'),
    readline = require('readline'),
    npm = require('npm');


/**
 * ==================================================
 *
 * General Functions
 *
 * without question handling
 * for basic prompt functionality
 *
 * ==================================================
 */


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


cPrompt.init = function(cli) {
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
};


/**
 * Display prompt and
 * gets connection information to establish it
 *
 * @param  {Function} callback callback called after user input
 */
cPrompt.setup = function() {
  cPrompt.showWelcomeScreen(cPrompt._promptCheckForUpdates);
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
 * Set a new tab completer for prompt input.
 * The completer is changing
 * after each level switch (connection, database, ...)
 *
 * @param   {object} cli general cli object
 * @private
 */
cPrompt._setCompleter = function(cli) {
  // completer used by readline module afterwards
  cPrompt.rl.completer = function (line, callback) {
    var completion = require(
            '../completions/' + cli.level + 'Completions.js'
        ),
        firstLevel = line.split(' ')[0],
        linePartial = line.replace(firstLevel + ' ', ''),
        completions,
        hits;

    // check if a second level completion exists
    // TODO build up a function for that
    if (completion[firstLevel] !== undefined) {

      completion[firstLevel](linePartial, cli.level, callback);

    } else {
      completions = cHelper._getAllCommands(cli[cli.level + 'Commands']);
      hits = completions.filter(
        function (c) {
          return c.indexOf(line) === 0;
        }
      );

      callback(null, [hits.length ? hits : completions, line]);
    }
  };
};


/**
 * ==================================================
 *
 * END General Functions
 *
 * ==================================================
 */


/**
 * ==================================================
 *
 * NPM Functions
 *
 * ==================================================
 */

/**
 * Start prompt for npm update dialog
 *
 * @tested
 */
cPrompt._promptCheckForUpdates = function() {
  cPrompt.rl.question(
    'Do you want to check for updates of cushion-cli? (yes|no) ',
    cPrompt._promptCheckForUpdatesCallback
  )
};


/**
 * Handle user response if he/she wants to check for updates
 *
 * @param  {String} check user answer
 *
 * @tested
 */
cPrompt._promptCheckForUpdatesCallback = function(check) {
  if (check.match(/^[yY]*?(es)?$/)) {
    console.log(clc.yellow('\nLookin\' for cushion-cli in npm ...'));

    npm.load(
      { loglevel: 'silent'},
      cPrompt._npmLoadCallback
    );
  } else {
    // check if there is an existing
    cFile.defaultExists(cPrompt._defaultsCallback);
  }
};


/**
 * Handle npm load
 *
 * @param  {Object|null} error error of npm loading
 * @param  {Object}      npm   loaded npm object
 *
 * @tested
 */
cPrompt._npmLoadCallback = function(error, npm) {
  if (error) {
    console.log(
      clc.red('\nSorry. An error occured at loading npm.\n')
    );

    cFile.defaultExists(cPrompt._defaultsCallback);
  } else {
    //make npm really silent
    cPrompt.log = console.log;
    console.log = function() {};

    npm.search(
      'cushion-cli',
      cPrompt._npmSearchCallback
    );
  }
};


/**
 * Handle npm search result
 *
 * @param  {Object|null} error  error of npm searching
 * @param  {Object}      result result for search
 *
 * @tested
 */
cPrompt._npmSearchCallback = function(error, result) {
  // set the real console again
  console.log = cPrompt.log;

  // cleaning up afterwards
  delete cPrompt.log;

  if (error) {
    console.log(
      clc.red('\nSorry. An error occured at fetching npm data.\n')
    );

    cFile.defaultExists(cPrompt._defaultsCallback);
  } else {
    cPrompt.actualVersion = result['cushion-cli'].version;
    console.log(
      '\nThe most actual version is ' +
        clc.yellow(cPrompt.actualVersion) + '.'
    );

    cFile.getCushionVersionNumber(cPrompt._npmCushionVersionCallback);
  }
};


/**
 * Handle version number result
 *
 * @param  {Object|null} error   error of package.json read
 * @param  {String}      version version number written in package.json
 *
 * @tested
 */
cPrompt._npmCushionVersionCallback = function(error, version) {
  if (error) {
    console.log(
      clc.red('\nSorry. An error occured at reading your package.json.\n')
    );
  } else {
    console.log('Your current version is ' + clc.yellow(version) + '.');

    if (version !== cPrompt.actualVersion) {
      console.log(
        clc.red('\nYour current version is not the most actual one!\n') +
          'If you want to have bug fixes and new features do:\n\n' +
        clc.yellow('npm update -g cushion-cli\n')
      );
    } else {
      console.log(
        clc.green('\nPerfect!!! You\'re up to date.\n')
      );
    }
  }

  delete cPrompt.actualVersion;

  cFile.defaultExists(cPrompt._defaultsCallback);
}

/**
 * ==================================================
 *
 * END NPM Functions
 *
 * ==================================================
 */


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
 * display prompt and
 * get information like admin name and admin passwort
 * and create admin afterwards
 *
 * @param   {object} cli general cli object
 * @private
 */
cPrompt._promptGetAdmin = function() {
  var args = Array.prototype.slice.call(arguments);

  cPrompt.rl.question('What is the name of admin? ', function(username) {
    cPrompt._promptGetAdminPassword(username, args);
  });
};



cPrompt._promptGetAdminPassword = function(username, args) {
  var callback = args[args.length - 1];

  args = args.slice(0, -1);

  cPrompt.rl.question(
    'What is the password for ' + username + '? ',
    function(password) {
      args.unshift(username, password);
      callback.apply(cPrompt.cli.cushion, args);
    }
  );
};


/**
 * display prompt and
 * ask for user password
 *
 * @param   {object} cli general cli object
 * @private
 */
cPrompt._promptGetUserPassword = function() {
  var args = Array.prototype.slice.call(arguments),
      callback = args[args.length - 1],
      name = args[0];

  // remove callback of arguments
  args = args.slice(1, -1);

  cPrompt.rl.question(
    'What is the passwort for the user? ',
    function(password) {
      args.unshift(name, password);

      callback.apply(cPrompt.cli.user, args);
    }
  );
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
  // TODO AVOID DEEP NESTING
  cPrompt.rl.question(
    'First of all. Do you want to login as admin? (yes|no) ',
    function(adminLogin) {
      adminLogin = adminLogin || 'no';

      cPrompt.rl.question('What is the host? (127.0.0.1) ', function(host) {
        host = host || '127.0.0.1';

        cPrompt.rl.question('What is the port? (5984) ', function(port) {
          port = port || '5984';

          if (adminLogin.match(/^[yY]*?(es)?$/)) {
            cPrompt._promptGetAdmin(host, port, cPrompt.cli.createConnection);
          } else {
            cPrompt.cli.createConnection('', '', host, port, true);
          }
        });
      });
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
 * ask if connection should be saved or not and when
 * with which name. Callback will be called afterwards
 *
 * @param  {function} callback callback
 */
cPrompt._setupSaveConnection = function(callback) {
  cPrompt.rl.question(
    'Do you want to save this connection for later? (yes|no) ',
    function(save) {
      if (save.match(/^[yY]*?(es)?$/)) {
        cPrompt.rl.question(
          'What should be the name of new saved connection? ',
          function(name) {
            if (name.length) {
              var args = ['saveConnection', name];

              cPrompt.cli.connectionCommands._saveConnection(args, cPrompt.cli);
            } else {
              console.log('Name was empty. Not saved...');
              callback();
            }
          }
        );
      } else {
        callback();
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
            connection.port,
            true
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
 * ==================================================
 *
 * Show Functions
 *
 * without question handling
 * for basic prompt functionality
 *
 * ==================================================
 */


/**
 * Show read connection and call callback afterwards
 *
 * @param  {function} callback callback
 * @private
 */
cPrompt._showConnections = function(callback) {
  var i = 1,
      connections = cPrompt.cli.connections || {},
      connectionNames = Object.keys(connections);

  if (connectionNames.length > 0) {
    console.log('Lookin for connection file ... \n')
    console.log(clc.green('Connection file found.\n'));
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
 * @param {function} callback callback
 */
cPrompt.showWelcomeScreen = function(callback) {
  console.log('Welcome to Cushion-Cli.');
  console.log('Enjoy it...\n');

  callback();
};


/**
 * ==================================================
 *
 * END Show Functions
 *
 * ==================================================
 */
