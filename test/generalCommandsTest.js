
module.exports = {
  setUp: function(callback) {
    var Cushion = require('cushion'),
        config = require('./config');

    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../lib/cliRunner');
    this.cli.level = 'connection';
    this.cli.name = config.host;
    this.cli.cushion = new Cushion.Connection(
      config.host, config.port, config.name, config.password
    );

    // only include these guys for testing
    this.cli.generalCommands = require('../lib/commands/generalCommands');

    this.input = ['does', 'not', 'matter', 'here'];

    callback();
  },


  tearDown: function(callback) {
    //console.log = this._console;

    callback();
  },


  stepBack: {
    connectionLevel: function(test) {
      var cli = this.cli;

      cli.prompt = function() {
        test.strictEqual(cli.level, 'connection');
        test.strictEqual(cli.name, '127.0.0.1');
        test.done();
      };

      cli.generalCommands['_..'](this.input, cli);
    },


    databaseLevel: function(test) {
      var cli = this.cli;

      cli.level = 'database';
      cli.name = 'testDatabase';
      cli.db = cli.cushion.database('testDatabase');

      cli.prompt = function() {
        test.strictEqual(cli.level, 'connection');
        test.strictEqual(cli.name, '127.0.0.1');
        test.strictEqual(cli.db, undefined);
        test.done();
      };

      cli.generalCommands['_..'](this.input, cli);
    },


    documentLevel: function(test) {
      var cli = this.cli;

      cli.level = 'document';
      cli.db = cli.cushion.database('testDatabase');
      cli.name = 'testDocument';

      cli.prompt = function() {
        test.strictEqual(cli.level, 'database');
        test.strictEqual(cli.name, cli.db.name());
        test.done();
      };

      cli.generalCommands['_..'](this.input, cli);
    },


    userLevel: function(test) {
      var cli = this.cli;

      cli.user = cli.cushion.user();
      cli.user.name = 'testUser';

      cli.level = 'user';
      cli.name = cli.user.name;

      cli.prompt = function() {
        test.strictEqual(cli.level, 'connection');
        test.strictEqual(cli.name, '127.0.0.1');
        test.done();
      };

      cli.generalCommands['_..'](this.input, cli);
    },
  },


  connection: function(test) {
    var cli = this.cli;

    cli.level = 'database';
    cli.db = cli.cushion.database('testDatabase');
    cli.name = 'testDatabase';

    cli.prompt = function() {
      test.strictEqual(cli.level, 'connection');
      test.strictEqual(cli.name, cli.cushion.option('host'));
      test.strictEqual(cli.db, undefined);
      test.done();
    };

    cli.generalCommands._connection(this.input, cli);
  },


  commandExists: {
    connection: function(test) {
      var cli = this.cli,
          connectionCommands = Object.keys(
                                  require('../lib/commands/connectionCommands')
                                ),
          connectionCommandsLength = connectionCommands.length,
          i = 0;

      cli.level = 'connection';

      for(i; i < connectionCommandsLength; i++) {
        if (
          connectionCommands[i] !== 'command' &&
          connectionCommands[i] !== 'commandExists'
        ) {
          test.strictEqual(
            cli.connectionCommands.commandExists(
              connectionCommands[i].substr(1)
            ),
            true
          );
        }
      }

      test.done();
    },
    database: function(test) {
      var cli = this.cli,
          databaseCommands = Object.keys(
                                  require('../lib/commands/databaseCommands')
                                ),
          databaseCommandsLength = databaseCommands.length,
          i = 0;

      cli.level = 'database';

      for(i; i < databaseCommandsLength; i++) {
        if (
          databaseCommands[i] !== 'command' &&
          databaseCommands[i] !== 'commandExists'
        ) {
          test.strictEqual(
            cli.databaseCommands.commandExists(
              databaseCommands[i].substr(1)
            ),
            true
          );
        }
      }

      test.done();
    },
    document: function(test) {
      var cli = this.cli,
          documentCommands = Object.keys(
                                  require('../lib/commands/documentCommands')
                                ),
          documentCommandsLength = documentCommands.length,
          i = 0;

      cli.level = 'document';

      for(i; i < documentCommandsLength; i++) {
        if (
          documentCommands[i] !== 'command' &&
          documentCommands[i] !== 'commandExists'
        ) {
          test.strictEqual(
            cli.documentCommands.commandExists(
              documentCommands[i].substr(1)
            ),
            true
          );
        }
      }

      test.done();
    },
    user: function(test) {
      var cli = this.cli,
          userCommands = Object.keys(
                                  require('../lib/commands/userCommands')
                                ),
          userCommandsLength = userCommands.length,
          i = 0;

      cli.level = 'user';

      for(i; i < userCommandsLength; i++) {
        if (
          userCommands[i] !== 'command' &&
          userCommands[i] !== 'commandExists'
        ) {
          test.strictEqual(
            cli.userCommands.commandExists(
              userCommands[i].substr(1)
            ),
            true
          );
        }
      }

      test.done();
    }
  },


  database: {
    databaseUp: function(test) {
      var cli = this.cli;

      this.input = ['database', 'testDatabase'];

      cli.prompt = function() {
        test.strictEqual(cli.level, 'database');
        test.strictEqual(cli.name, 'testDatabase');
        test.ok(cli.db);
        test.strictEqual(cli.db.name(), 'testDatabase');
        test.done();
      };

      cli.generalCommands._database(this.input, cli);
    },

    databaseDown: function(test) {
      var cli = this.cli;

      this.input = ['database'];

      cli.level = 'document';
      cli.db = cli.cushion.database('testDatabase');
      cli.name = 'testDocument';

      cli.prompt = function() {
        test.strictEqual(cli.level, 'database');
        test.strictEqual(cli.name, 'testDatabase');
        test.done();
      };

      cli.generalCommands._database(this.input, cli);
    }
  },


  listDatabases: function(test) {
    var cli = this.cli;

    cli.cushion.listDatabases = function(callback) {
      test.strictEqual(typeof callback, 'function');
      test.strictEqual(callback instanceof Function, true);
      test.strictEqual(arguments.length, 1);
      test.done();
    };

    cli.generalCommands._listDatabases(this.input, cli);
  },


  listUsers: function(test) {
    var cli = this.cli;

    console.pretty = function(userNames) {
      test.ok(userNames instanceof Array);
    };

    cli.prompt = function() {
      test.done();
    };

    cli.generalCommands._listUsers(this.input, cli);
  },


  user: function(test) {
    var cli = this.cli;

    this.input = ['user', 'stefan'];

    cli.prompt = function() {
      test.strictEqual(cli.level, 'user');
      test.strictEqual(cli.name, 'stefan');
      test.ok(cli.user);
      test.strictEqual(cli.user.name, 'stefan');
      test.done();
    };

    cli.generalCommands._user(this.input, cli);
  }
};
