/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var connectionCommands = module.exports = {},
    connectionCallbacks = require('./connectionCallbacks'),
    prompt = require('cli-prompt');


/**
 * [simpleCommand description]
 * @return {[type]} [description]
 */
connectionCommands.command = function(typedInput, cli) {
  var input = typedInput.split(' '),
      command = input[0],
      args = input.slice(1, input.length);

  switch (command) {
    case 'help':
      this._help(cli);
      break;

    case 'createAdmin':
      this._createAdmin(args, cli);
      break;

    case 'deleteAdmin':
      this._deleteAdmin(args, cli);
      break;

    default:
      this._simpleCommand(command, args, cli);
  }
};

connectionCommands.commandExists = function(input) {
  var command = input.split(' ')[0],
      _return;

  if(this['_' + command] !== undefined) {
    _return = true;
  } else {
    _return = false;
  }

  return _return;
};


connectionCommands._createAdmin = function(args, cli) {
  var name,
      password;

  if (args.length === 0) {
    prompt('What is the name of the new admin? -> ', function(val) {
      name = val;

      prompt('What is the new password for ' + name + '? -> ', function(val) {
        password = val;

        cli.cushion.createAdmin(
          name,
          password,
          connectionCallbacks.createAdmin
        );
      });
    });

  } else if (args.length === 2) {
    name = args[0];
    password = args[1];

    cli.cushion.createAdmin(
      name,
      password,
      connectionCallbacks.createAdmin
    );
  }
};

connectionCommands._deleteAdmin = function(args, cli) {
  var name;

  if (args.length === 0) {
    prompt('What is the name of the new admin? -> ', function(val) {
      name = val;

      cli.cushion.deleteAdmin(
        name,
        connectionCallbacks.deleteAdmin
      );
    });

  } else if (args.length === 2) {
    name = args[0];

    cli.cushion.deleteAdmin(
      name,
      connectionCallbacks.deleteAdmin
    );
  }
};

connectionCommands._simpleCommand = function(command, args, cli) {
  cli.cushion[command](connectionCallbacks[command]);
};

// @todo database command is missing
connectionCommands._help = function(cli) {
  var command,
      i = 0;
  console.log('Got into trouble?');
  console.log('Available commands are for connection are:');

  for(command in this) {
    i++;

    if (
      command.match('_') &&
      !command.match('_simpleCommand')
    ) {
      console.log(command.substr(1, command.length));
    }

    // @todo that could be solved nicer or?
    if (i === Object.keys(this).length) {
      cli.runner();
    }
  }
};

connectionCommands._version = connectionCommands._simpleCommand;
connectionCommands._activeTasks = connectionCommands._simpleCommand;