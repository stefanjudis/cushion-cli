/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var messages = module.exports = {
  'general':          'Got into trouble?\n' +
                      'Lookup help for specific commands with:\n\n' +
                      '    $ help [command]\n\n' +
                      'Available commands on this level are:',

  '..':               'Switch to parent level\n\n' +
                      'Command:\n' +
                      '    $ ..',

  'activeTasks':      'Get a list of active tasks.\n\n' +
                      'Command:\n' +
                      '    $ activeTasks',

  'addRole':          'Add a new role to current user.\n\n' +
                      'Commands:\n' +
                      'Add one new role to User.\n' +
                      '    $ addRole foo\n' +
                      'Add more than one role to user.\n' +
                      '    $ addRole foo bar baz',

  'allDocuments':     'Get a list of all documents in given database.\n\n' +
                      'Commands:\n' +
                      'Get all documents without any query parameters.\n' +
                      '    $ allDocuments\n\n' +
                      'Get all documents with query parameters.\n' +
                      '    $ allDocuments [param1] [param2] ...\n' +
                      '    -> allDocuments limit=3 startkey="doc"',

  'cleanup':          'Starts the view cleanup on the database.\n\n' +
                      'Commands:\n' +
                      '    $ cleanup',

  'connection':       'Switch to basic connection level.\n\n' +
                      'Command:\n' +
                      '    $ connection',

  'compact':          'Starts the compaction on the database.\n\n' +
                      'Commands:\n' +
                      '    $ compact',

  'config':           'Get config information.\n\n' +
                      'Commands:\n' +
                      'Get complete config.\n' +
                      '    $ config\n\n' +
                      'Get config options for specific section.\n' +
                      '    $ config [section]\n\n' +
                      'Get content for specific config option.\n' +
                      '    $ config [section] [option] delayed_commits\n\n' +
                      'Set value for specific config option.\n' +
                      '    $ config [section] [option] [value]',

  'create':           'Create new given database and set it in CouchDB.\n\n' +
                      'Command:\n' +
                      '    $ create',

  'createAdmin':      'Create new Admin.\n\n' +
                      'You have to be logged in as admin\n' +
                      'Commands:\n' +
                      'Create admin with prompt for name and password.\n' +
                      '    $ createAdmin\n\n' +
                      'Create admin with typed name and password.\n' +
                      '    $ createAdmin [name] [password]',

  'database':         'Connect to a given database.\n\n' +
                      'You can connect to an existing database or\n' +
                      'or set up a new database later ' +
                      '(look at \'$ database create)\n' +
                      'Command:\n' +
                      '    $ database [name]',

  'delete':           'Delete current User.\n' +
                      'Level will be switched back to connection afterwards.\n' +
                      'Command is only available at user level.\n\n' +
                      'Command:\n' +
                      '    $ delete',


  'deleteAdmin':      'Delete an existing admin.\n\n' +
                      'Commands:\n' +
                      'Delete admin with prompt for name.\n' +
                      '    $ deleteAdmin\n\n' +
                      'Delete admin with typed name\n' +
                      '    $ deleteAdmin [name]',

  'deleteConnection': 'Delete particular connection stored in file.\n\n' +
                      'Command:\n' +
                      '    $ deleteConnection',

  'deleteRole':       'Delete a particular role of current user.\n\n' +
                      'Commands:\n' +
                      'Delete one role of current user.\n' +
                      '    $ deleteRole foo\n' +
                      'Delete more than one role of current user.\n' +
                      '    $deleteRole foo bar baz',

  'destroy':          'Delete given database and remove it from CouchDB.\n\n' +
                      'Command:\n' +
                      '    $ destroy',

  'ensureFullCommit': 'Saves all uncommited stuff to the disk.\n\n' +
                      'Command:\n' +
                      '    $ ensureFullCommit',

  'exists':           'Check if given database already exists.\n\n' +
                      'Command:\n' +
                      '    $ exists',

  'exit':             'Stop cushion and do something else.',

  'info':             'Get info about given database.\n\n' +
                      'Command:\n' +
                      '    $ info',

  'help':             'Really? Help for the help command???',

  'listDatabases':    'Get a list of existing databases ' +
                      'in current connection.\n\n' +
                      'Command:\n' +
                      '    $ listDatabases',

  'listUsers':        'Get a list of existing users ' +
                      'in current connection.\n\n' +
                      'Command:\n' +
                      '    $ listUsers',

  'log':              'Get logs of couchdb.\n\n' +
                      'Commands:\n' +
                      'Get log with default length of 1000 Bytes.\n' +
                      '    $ log\n\n' +
                      'Get log with specific length of bytes.\n' +
                      '    $ log [bytes]',

  'saveConnection':   'Save current connection to file for later usage.\n\n' +
                      'Command:\n' +
                      '    $ saveConnection [name]',

  'showConnection':   'Show connection details like host, ' +
                      'port and username.\n\n' +
                      'Command:\n' +
                      '    $ showConnection',

  'restart':          'Restart the couchdb.\n\n' +
                      'You have to be logged in as admin\n' +
                      'Command:\n' +
                      '    $ restart',

  'stats':            'Get server statistics.\n\n' +
                      'Command:\n' +
                      '    $ stats',

  'user':             'Switch to a given user level.\n' +
                      'You can switch to an existing user or' +
                      'into the level of a new user by setting his/her' +
                      'name and create it afterwards. Try "help create" ' +
                      'at user level if you need more information.\n\n' +
                      'Command:\n' +
                      '    $ user foo',

  'uuids':            'Create couchdb uuids.\n\n' +
                      'Commands:\n' +
                      'Create one uuid\n' +
                      '    $ uuids\n' +
                      'Create 10 uuids \n' +
                      '    $ uuids 10',

  'view':             'Retriew a particular view in design document ' +
                      'for given database.\n\n' +
                      'Command:\n' +
                      'Retrieve a given view without any query parameters.\n' +
                      '    $ view [design] [view]\n\n' +
                      'Retrieve a given view with query parameters\n' +
                      '    $ view [design] [view] [param1] [param2] ...\n' +
                      '    -> view entries all limit=2 startkey="doc2"',

  'version':          'Get version of connected couchdb.\n\n' +
                      'Command:\n' +
                      '    $ version'
};
