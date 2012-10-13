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

  'allDocuments':   'Get a list of all documents in given database.\n' +
                    'Commands:\n' +
                    'Get all documents without any query parameters.\n' +
                    '    $ allDocuments\n\n' +
                    'Get all documents with query parameters.\n' +
                    '    $ allDocuments [param1] [param2] ...\n' +
                    '    -> allDocuments limit=3 startkey="doc"',

  'config':         'Get config information.\n' +
                    'Comands:\n' +
                    'Get complete config.\n' +
                    '    $ config\n\n' +
                    'Get config options for specific section.\n' +
                    '    $ config [section]\n\n' +
                    'Get content for specific config option.\n' +
                    '    $ config [section] [option] delayed_commits\n\n' +
                    'Set value for specific config option.\n' +
                    '    $ config [section] [option] [value]',

  'create':         'Create new given database and set it in CouchDB.\n' +
                    'Command:\n' +
                    '    $ create',

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
                    '    $ database [name]',

  'deleteAdmin':    'Delete an existing admin.\n' +
                    'Commands:\n' +
                    'Delete admin with prompt for name.\n' +
                    '    $ deleteAdmin\n\n' +
                    'Delete admin with typed name\n' +
                    '    $ deleteAdmin [name]',

  'destroy':        'Delete given database and remove it from CouchDB.\n' +
                    'Command:\n' +
                    '    $ destroy',

  'exists':         'Check if given database already exists.\n' +
                    'Command:\n' +
                    '    $ exists',

  'exit':           'Stop cushion and do something else.',

  'info':           'Get info about given database.\n' +
                    'Command:\n' +
                    '    $ info',

  'help':           'Really? Help for the help command???',

  'listDatabases':  'Get a list of existing databases.\n' +
                    'Command:\n' +
                    '    $ listDatabases',

  'log':            'Get logs of couchdb.\n' +
                    'Commands:\n' +
                    'Get log with default length of 1000 Bytes.\n' +
                    '    $ log\n\n' +
                    'Get log with specific length of bytes.\n' +
                    '    $ log [bytes]',

  'restart':        'Restart the couchdb.\n' +
                    'You have to be logged in as admin\n' +
                    'Command:\n' +
                    '    $ restart',

  'stats':          'Get server statistics.\n' +
                    'Comamnd:\n' +
                    '    $ stats',

  'view':           'Retriew a particular view in design document ' +
                    'for given database.\n' +
                    'Command:\n' +
                    'Retrieve a given view without any query parameters.\n' +
                    '    $ view [design] [view]\n\n' +
                    'Retrieve a given view with query parameters\n' +
                    '    $ view [design] [view] [param1] [param2] ...\n' +
                    '    -> view entries all limit=2 startkey="doc2"',

  'version':        'Get version of connected couchdb.\n' +
                    'Command:\n' +
                    '    $ version'
};