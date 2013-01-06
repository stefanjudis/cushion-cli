/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var documentCommands = module.exports = {},
    documentCallbacks = require('../callbacks/documentCallbacks'),
    generalCommands = require('./generalCommands'),
    clc = require('cli-color'),
    extend = require('node.extend');


// extend level commands with general commands
extend(documentCommands, generalCommands);


documentCommands._content = function(input, cli) {
  var args = input.slice(1, input.length),
      argsLength = args.length,
      body = cli.doc._body,
      bodyKeys = Object.keys(body),
      response = {};

  switch (argsLength) {
    case 0:
      if (bodyKeys.length === 0) {
        console.log(
          clc.red('\nNo entries found. Probably document not loaded yet.\n')
        );
      } else {
        console.pretty(cli.doc._body);
      }

      break;
    case 1:
      if (body[args[0]] !== undefined) {
        response[args[0]] = body[args[0]];

        console.pretty(response);
      } else {
        console.log(
          clc.red('Key not found in document. May mispelled something?')
        );
      }
      break;
    case 2:
        body[args[0]] = args[1];
        console.log(
          clc.yellow(args[1] + ' saved to ' + args[0] + '.')
        );
      break;
    default:
      console.log(
        clc.red(
          '\nToo many arguments. Try $ help document for further information.\n'
        )
      );
  }

  cli.prompt();
};

documentCommands._database = function(input, cli) {
  console.log(clc.yellow('\n Switched to database level.\n'));

  cli.level = 'database';
  cli.name = cli.db.name();

  cli.prompt();
};


/**
 * General function for commands that don't need
 * specific actions, validation or functionality.
 * It's only executing the particular cushion function
 * and the depending callback.
 *
 * @param  {Array}  input Array of ' ' splitted input arguments
 * @param  {Object} cli   general cli object
 *
 * @private
 */
documentCommands._simpleCommand = function(input, cli) {
  // command is stored at first place in input array
  var command = input[0];

  cli.doc[command](documentCallbacks[command]);
};



documentCommands._load =
documentCommands._info =
documentCommands._save = documentCommands._simpleCommand;
