/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var connectionCommands = module.exports = {},
    connectionCallbacks = require('./connectionCallbacks'),
    cPrompt = require('./prompt/prompt'),
    cHelper = require('./helper/helper');


/**
 * [simpleCommand description]
 * @return {[type]} [description]
 */
connectionCommands.command = function(input, cli) {
  var args = input.split(' '),
      command = args[0];

  connectionCommands['_' + command](args, cli);
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
connectionCommands._createAdmin = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      name,
      password;

  // @TODO what is about this switch case?
  switch (argsLength) {
    case 0:
      cPrompt._createAdmin(cli);

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
connectionCommands._deleteAdmin = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      name;

  // @TODO what's about this switch statement avoidable?
  switch (argsLength) {
    case 0:
      cPrompt._deleteAdmin(cli);

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
connectionCommands._config = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length;

  if (argsLength < 4) {
    // push callback to args for usage of apply
    args.push(connectionCallbacks.config);
    cli.cushion.config.apply(cli.cushion, args);
  } else {
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
connectionCommands._log = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length;

  if (argsLength < 2) {
    args.push(connectionCallbacks.log);
    cli.cushion.log.apply(cli.cushion, args);
  } else {
    console.log(
     'Please, use the \'log\' command without or with one argument.'
    );

    //restart the given command loop
    cli.runner();
  }
};


/**
 * [_database description]
 * @param   {[type]} input [description]
 * @param   {[type]} cli   [description]
 * @return  {[type]}       [description]
 * @private
 */
connectionCommands._database = function(input, cli) {
  var name = input[1];

  cli.db = cli.cushion.database(name);
  console.log('Switched to database ' + name);

  cli.runner = cli.handleDatabaseCommands;
  cli.handleDatabaseCommands();
};


/**
 * [_simpleCommand description]
 * @param   {[type]} command [description]
 * @param   {[type]} args    [description]
 * @param   {[type]} cli     [description]
 * @return  {[type]}         [description]
 * @private
 */
connectionCommands._simpleCommand = function(input, cli) {
  // command is stored at first place in input array
  var command = input[0];

  cli.cushion[command](connectionCallbacks[command]);
};


/**
 * [_help description]
 * @param   {[type]} input [description]
 * @param   {[type]} cli   [description]
 * @return  {[type]}       [description]
 * @private
 */
connectionCommands._help = function(input, cli) {
  cHelper.getHelp(this, cli);
};

connectionCommands._version =
connectionCommands._activeTasks =
connectionCommands._listDatabases =
connectionCommands._stats =
connectionCommands._restart = connectionCommands._simpleCommand;