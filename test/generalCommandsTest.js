
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

    this.generalCommands = require('../lib/commands/generalCommands');

    this.input = ['does', 'not', 'matter', 'here'];

    callback();
  },

  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },

  stepBack: {
    connectionLevel: function(test) {
      var cli = this.cli;

      this.cli.prompt = function() {
        test.strictEqual(cli.level, 'connection');
        test.strictEqual(cli.name, '127.0.0.1');
        test.done();
      };

      this.generalCommands['_..'](this.input, this.cli);
    },

    databaseLevel: function(test) {
      var cli = this.cli;

      cli.level = 'database';
      cli.name = 'testDatabase';
      cli.db = cli.cushion.database('testDatabase');

      this.cli.prompt = function() {
        test.strictEqual(cli.level, 'connection');
        test.strictEqual(cli.name, '127.0.0.1');
        test.strictEqual(cli.db, undefined);
        test.done();
      };

      this.generalCommands['_..'](this.input, this.cli);
    },

    documentLevel: function(test) {
      var cli = this.cli;

      cli.level = 'document';
      cli.db = cli.cushion.database('testDatabase');
      cli.name = 'testDocument';

      this.cli.prompt = function() {
        test.strictEqual(cli.level, 'database');
        test.strictEqual(cli.name, cli.db.name());
        test.done();
      };

      this.generalCommands['_..'](this.input, this.cli);
    },

    userLevel: function(test) {
      var cli = this.cli;

      cli.user = cli.cushion.user();
      cli.user.name = 'testUser';

      cli.level = 'user';
      cli.name = cli.user.name;

      this.cli.prompt = function() {
        test.strictEqual(cli.level, 'connection');
        test.strictEqual(cli.name, '127.0.0.1');
        test.done();
      };

      this.generalCommands['_..'](this.input, this.cli);
    },
  },

  connection: function(test) {
    var cli = this.cli;

    cli.level = 'database';
    cli.db = cli.cushion.database('testDatabase');
    cli.name = 'testDatabase';

    this.cli.prompt = function() {
      test.strictEqual(cli.level, 'connection');
      test.strictEqual(cli.name, cli.cushion.option('host'));
      test.strictEqual(cli.db, undefined);
      test.done();
    };

    this.generalCommands._connection(this.input, this.cli);
  },

  database: {
    databaseUp: function(test) {
      var cli = this.cli,
          input = ['database', 'testDatabase'];

      this.cli.prompt = function() {
        test.strictEqual(cli.level, 'database');
        test.strictEqual(cli.name, 'testDatabase');
        test.ok(cli.db);
        test.strictEqual(cli.db.name(), 'testDatabase');
        test.done();
      };

      this.generalCommands._database(input, this.cli);
    },

    databaseDown: function(test) {
      var cli = this.cli,
          input = ['database'];

      cli.level = 'document';
      cli.db = cli.cushion.database('testDatabase');
      cli.name = 'testDocument';

      this.cli.prompt = function() {
        test.strictEqual(cli.level, 'database');
        test.strictEqual(cli.name, 'testDatabase');
        test.done();
      };

      this.generalCommands._database(input, this.cli);
    }
  },

  listDatabases: function(test) {
    var cli = this.cli,
        input = ['listDatabases'];

    this.cli.connectionCallbacks.listDatabases = function(error, databases) {
      test.ok(!error);
      test.ok(databases);
      test.ok(databases instanceof Array);
      test.done();
    };

    this.generalCommands._listDatabases(input, this.cli);
  },

  user: function(test) {
    var cli = this.cli,
        input = ['user', 'stefan'];

    this.cli.prompt = function() {
      test.strictEqual(cli.level, 'user');
      test.strictEqual(cli.name, 'stefan');
      test.ok(cli.user);
      test.strictEqual(cli.user.name, 'stefan');
      test.done();
    };

    this.generalCommands._user(input, this.cli);
  }
};
