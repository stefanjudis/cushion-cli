/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var messages = module.exports = {
  'general':        'Got into trouble?\n' +
                    'Lookup help for specific commands with:\n\n' +
                    '    $ help [command]\n\n' +
                    'Available commands on this level are:\n',
  'activeTasks':    'Get a list of active tasks.\n' +
                    'Command:\n' +
                    '    $ activeTasks',
  'config':         'help config',
  'createAdmin':    'Create new Admin.\n' +
                    'You have to be logged in as admin\n' +
                    'Commands:\n' +
                    'Create admin with prompt for name and password.\n' +
                    '    $ createAdmin\n\n' +
                    'Create admin with typed name and password.\n' +
                    '    $ createAdmin [name] [password]',
  'database':       'Connect to a given database.\n' +
                    'You can connect to an existing database or\n' +
                    'or set up a new database later (look at \'$ database create)\n' +
                    'Command:\n' +
                    '    database [name]',
  'deleteAdmin':    'Delete an existing admin.\n' +
                    'Commands:\n' +
                    'Delete admin with prompt for name.\n' +
                    '    $ deleteAdmin\n\n' +
                    'Delete admin with typed name\n' +
                    '    $ deleteAdmin bob',
  'help':           'Really? Help for the help command???',
  'listDatabases':  'Get a list of existing databases.\n' +
                    'Command:\n' +
                    '    $ listDatabases',
  'log':            'help log',
  'restart':        'Restart the couchdb.\n' +
                    'You have to be logged in as admin\n' +
                    'Command:\n' +
                    '    $ restart',
  'stats':          'help stats',
  'version':        'Get version of connected couchdb.\n' +
                    'Command:\n' +
                    '    $ version'
};