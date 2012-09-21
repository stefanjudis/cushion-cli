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
    case 'config':
      this._config(args, cli);
      break;
    case 'log':
      this._log(args, cli);
      break;
    default:
      this._simpleCommand(command, cli);
  }
};

/**
 * [commandExists description]
 * @param  {[type]} input [description]
 * @return {[type]}       [description]
 */
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

/**
 * [_createAdmin description]
 * @param   {[type]} args [description]
 * @param   {[type]} cli  [description]
 * @return  {[type]}      [description]
 * @private
 */
connectionCommands._createAdmin = function(args, cli) {
  var argsLength = args.length,
      name,
      password;

  switch (argsLength) {
    case 0:
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

      break;
    case 2:
      name = args[0];
      password = args[1];

      cli.cushion.createAdmin(
        name,
        password,
        connectionCallbacks.createAdmin
      );

      break;
    default:
      console.log(
        'Use the \'createAdmin\' command without or with two arguments (user, password)'
      );

      //restart the command loop
      cli.runner();

  }
};

/**
 * [_deleteAdmin description]
 * @param   {[type]} args [description]
 * @param   {[type]} cli  [description]
 * @return  {[type]}      [description]
 * @private
 */
connectionCommands._deleteAdmin = function(args, cli) {
  var argsLength = args.length,
      name;

  switch (argsLength) {
    case 0:
      prompt('What is the name of the new admin? -> ', function(val) {
        name = val;

        cli.cushion.deleteAdmin(
          name,
          connectionCallbacks.deleteAdmin
        );
      });
      break;
    case 1:
      name = args[0];
      cli.cushion.deleteAdmin(
        name,
        connectionCallbacks.deleteAdmin
      );
      break;
    default:
      console.log(
        'Use the \'deleteAdmin\' command without or with one argument.'
      );

      //restart the given command loop
      cli.runner();
  }
};

/**
 * [_config description]
 * @param   {[type]} args [description]
 * @param   {[type]} cli  [description]
 * @return  {[type]}      [description]
 * @private
 */
connectionCommands._config = function(args, cli) {
  var argsLength = args.length;

  switch (argsLength) {
    case 0:
      cli.cushion.config(
        connectionCallbacks.config
      );
      break;
    case 1:
      cli.cushion.config(
        args[0],
        connectionCallbacks.config
      );
      break;
    case 2:
      cli.cushion.config(
        args[0],
        args[1],
        connectionCallbacks.config
      );
      break;
    case 3:
      cli.cushion.config(
        args[0],
        args[1],
        args[2],
        connectionCallbacks.config
      );
      break;
    default:
      console.log(
       'Please, use the \'config\' command with 0, 1, 2 or 3 arguments.'
      );

      //restart the given command loop
      cli.runner();
  }
};

/**
 * [_log description]
 * @param   {[type]} args [description]
 * @param   {[type]} cli  [description]
 * @return  {[type]}      [description]
 * @private
 */
connectionCommands._log = function(args, cli) {
  var argsLength = args.length;

  switch (argsLength) {
    case 0:
      cli.cushion.log(
        connectionCallbacks.log
      );
      break;
    case 1:
      cli.cushion.log(
        args[0],
        connectionCallbacks.log
      );
      break;
    default:
      console.log(
       'Please, use the \'log\' command without or with one argument.'
      );

      //restart the given command loop
      cli.runner();
  }
};

/**
 * [_simpleCommand description]
 * @param   {[type]} command [description]
 * @param   {[type]} args    [description]
 * @param   {[type]} cli     [description]
 * @return  {[type]}         [description]
 * @private
 */
connectionCommands._simpleCommand = function(command, cli) {
  cli.cushion[command](connectionCallbacks[command]);
};


connectionCommands._help = function(cli) {
  var command,
      i = 0;
  console.log('Got into trouble?');
  console.log('Available commands are for connection are:');
  // @todo that's really dirty - think of a better way!!!
  console.log('database');

  // @todo what's about doing it alphabetically????????
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

connectionCommands._version =
connectionCommands._activeTasks =
connectionCommands._listDatabases =
connectionCommands._stats =
connectionCommands._restart = connectionCommands._simpleCommand;