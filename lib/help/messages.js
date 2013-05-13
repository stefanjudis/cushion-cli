/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var messages = module.exports = {
  'general':            'Got into trouble?\n' +
                        'Lookup help for specific commands with:\n\n' +
                        '    $ help [command]\n\n' +
                        'Available commands on this level are:\n\n' +
                        '(noticed TAB completion? -> if not try it...)',

  '..':                 'Switch to parent level\n\n' +
                        'Command:\n' +
                        '    $ ..',

  'activeTasks':        'Get a list of active tasks.\n\n' +
                        'Command:\n' +
                        '    $ activeTasks',

  'addRole':            'Add a new role to current user.\n\n' +
                        'Commands:\n' +
                        'Add one new role to User.\n' +
                        '    $ addRole [role]\n' +
                        'Add more than one role to user.\n' +
                        '    $ addRole [role1] [role2] [role3]',

  'allDesignDocuments': 'Retrieve a list of all design documents.\n\n' +
                        '    $ allDesignDocuments',

  'allDocuments':       'Get a list of all documents in given database.\n\n' +
                        'Commands:\n' +
                        'Get all documents without any query parameters.\n' +
                        '    $ allDocuments\n\n' +
                        'Get all documents with query parameters.\n' +
                        '    $ allDocuments [param1] [param2] ...\n' +
                        '    -> allDocuments limit=3 startkey="doc"',

  'allViews':           'Get a list of views for design document.\n' +
                        'Set design document without \'_design/\' at the beginning\n' +
                        '    $ allViews [designName]',

  'cleanup':            'Starts the view cleanup on the database.\n\n' +
                        'Commands:\n' +
                        '    $ cleanup',

  'connection':         'Switch to basic connection level.\n\n' +
                        'Command:\n' +
                        '    $ connection',

  'compact':            'Starts the compaction on the database.\n\n' +
                        'Commands:\n' +
                        '    $ compact',

  'config':             'Get or set config information.\n\n' +
                        'COMMAND SUPPORTS AUTO-COMPLETION.\n\n' +
                        'Commands:\n' +
                        'Get complete config.\n' +
                        '    $ config\n\n' +
                        'Get config options for specific section.\n' +
                        '    $ config [section]\n\n' +
                        'Get content for specific config option.\n' +
                        '    $ config [section] [option] \n\n' +
                        'Set value for specific config option.\n' +
                        '    $ config [section] [option] [value]',

  'content':            'Get or set content of given document.\n\n' +
                        'COMMAND SUPPORTS AUTO-COMPLETION.\n\n' +
                        'Commands:\n' +
                        'Get complete document body.\n' +
                        '    $ content\n\n' +
                        'Get content of particular document body key.\n' +
                        '    $ content [key]\n\n' +
                        'Set content of particular document body key.\n' +
                        '    $ content [key] [content]',

  'create':             'Create new database or user (if not exist) ' +
                        'depending on level and set it in CouchDB.\n\n' +
                        'Command:\n' +
                        '    $ create\n\n' +
                        'Examples:\n' +
                        '    $ database [name] create\n' +
                        '    $ user [name] create',

  'createAdmin':        'Create new Admin.\n\n' +
                        'You have to be logged in as admin.\n' +
                        'Commands:\n' +
                        'Create admin with prompt for name and password.\n' +
                        '    $ createAdmin\n\n' +
                        'Create admin with typed name and password.\n' +
                        '    $ createAdmin [name] [password]',

  'database':           'Connect to a given database.\n\n' +
                        'You can connect to an existing database or\n' +
                        'or set up a new database later ' +
                        '(look at \'$ database create)\n' +
                        'If you are at document level use command\n' +
                        'to switch back to last database\n\n' +
                        'COMMAND SUPPORTS AUTO-COMPLETION.\n\n' +
                        'Commands:\n' +
                        'Switch to new database.\n' +
                        '    $ database [name]\n\n' +
                        'Switch to "back" to database leve.\n' +
                        '    $ database',

  'delete':             'Delete current User.\n' +
                        'Level will be switched back to connection afterwards.\n' +
                        'Command is only available at user level.\n\n' +
                        'Command:\n' +
                        '    $ delete',


  'deleteAdmin':        'Delete an existing admin.\n\n' +
                        'Commands:\n' +
                        'Delete admin with prompt for name.\n' +
                        '    $ deleteAdmin\n\n' +
                        'Delete admin with typed name\n' +
                        '    $ deleteAdmin [name]',

  'deleteConnection':   'Delete particular saved connection.\n\n' +
                        'COMMAND SUPPORTS AUTO-COMPLETION.\n\n' +
                        'Commands:\n' +
                        'Delete saved connection by its name' +
                        '    $ deleteConnection [name]' +
                        'Delete saved connection by its index' +
                        '    $ deleteConnection [index]',

  'deleteRole':         'Delete a particular role of current user.\n\n' +
                        'Commands:\n' +
                        'Delete one role of current user.\n' +
                        '    $ deleteRole [role]\n' +
                        'Delete more than one role of current user.\n' +
                        '    $deleteRole [role1] [role2] [role3]',

  'destroy':            'Delete given database and remove it from CouchDB.\n\n' +
                        'Command:\n' +
                        '    $ destroy',

  'document':           'Switch to document level by ID.\n' +
                        'If you don\'t set the ID CouchDB' +
                        'will set it for you later\n\n' +
                        'COMMAND SUPPORTS AUTO-COMPLETION.\n\n' +
                        'Command:\n' +
                        '    $ document [id]',

  'ensureFullCommit':   'Saves all uncommited stuff to the disk.\n\n' +
                        'Command:\n' +
                        '    $ ensureFullCommit',

  'exists':             'Check if given database already exists.\n\n' +
                        'Command:\n' +
                        '    $ exists',

  'exit':               'Stop cushion and do something else.',

  'info':               'Get info about given database or document.\n\n' +
                        'Command:\n' +
                        '    $ info',

  'help':               'Really? Help for the help command???',

  'listDatabases':      'Get a list of existing databases ' +
                        'in current connection.\n\n' +
                        'Command:\n' +
                        '    $ listDatabases',

  'listUsers':          'Get a list of existing users ' +
                        'in current connection.\n\n' +
                        'Command:\n' +
                        '    $ listUsers',

  'load':               'Load body of given document.\n\n' +
                        'Command:\n' +
                        '    $ info',

  'log':                'Get logs of couchdb.\n\n' +
                        'Commands:\n' +
                        'Get log with default length of 1000 Bytes.\n' +
                        '    $ log\n\n' +
                        'Get log with specific length of bytes.\n' +
                        '    $ log [bytes]',

  'saveConnection':     'Save current connection to file for later usage.\n\n' +
                        'Command:\n' +
                        '    $ saveConnection [name]',

  'showConnection':     'Show connection details like host, ' +
                        'port and username.\n\n' +
                        'Command:\n' +
                        '    $ showConnection',

  'showConnections':    'Get a list of all saved connections.\n\n' +
                        'Command:\n' +
                        '    $ showConnections',

  'restart':            'Restart the couchdb.\n\n' +
                        'You have to be logged in as admin\n' +
                        'Command:\n' +
                        '    $ restart',

  'save':               'Save your changes of document content to CouchDB.\n\n' +
                        'Command:\n' +
                        '    $ save',

  'stats':              'Get server statistics.\n\n' +
                        'Command:\n' +
                        '    $ stats',

  'tmpView':            'Retrieve a temporary view for given database,\n\n' +
                        'Commands:\n' +
                        '    $ tmpView [map]\n' +
                        '    -> tmpView \'function(doc) {emit(doc._id, doc);}\'\n\n' +
                        '    $ tmpView [map] [param1] [param2] ...\n' +
                        '    -> tmpView \'function(doc) {emit(doc._id, doc);}\' limit=1 skip=2\n\n' +
                        '    $ tmpView [map] [reduce]\n' +
                        '    -> tmpView \'function(doc) {emit(doc._id, doc);}\' \'function(keys, values, rereduce){return sum(); }\'\n\n' +
                        '    $tmpView [map] [param1] [param2] ... [reduce]\n' +
                        '    -> tmpView \'function(doc) {emit(doc._id, doc);}\' limit=1 skip=2 \'function(keys, values, rereduce){return sum(); }\'',

  'user':               'Switch to a given user level.\n' +
                        'You can switch to an existing user or\n' +
                        'into the level of a new user by setting his/her\n' +
                        'name and create it afterwards. Try "help create\n" ' +
                        'at user level if you need more information.\n\n' +
                        'COMMAND SUPPORTS AUTO-COMPLETION.\n\n' +
                        'Command:\n' +
                        '    $ user [username]',

  'uuids':              'Create couchdb uuids.\n\n' +
                        'Commands:\n' +
                        'Create one uuid.\n' +
                        '    $ uuids\n' +
                        'Create 10 uuids.\n' +
                        '    $ uuids [numberOfUuids]',

  'view':               'Retriew a particular view in design document ' +
                        'for given database.\n\n' +
                        'Command:\n' +
                        'Retrieve a given view without any query parameters.\n' +
                        '    $ view [design] [view]\n\n' +
                        'Retrieve a given view with query parameters\n' +
                        '    $ view [design] [view] [param1] [param2] ...\n' +
                        '    -> view entries all limit=2 startkey="doc2"',

  'version':            'Get version of connected couchdb.\n\n' +
                        'Command:\n' +
                        '    $ version'
};
