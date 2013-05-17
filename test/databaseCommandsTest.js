module.exports = {
  setUp: function(callback) {
    var Cushion = require('cushion'),
        config = require('./config');

    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../lib/cliRunner');
    this.cli.level = 'database';
    this.cli.name = config.database;

    this.cli.db = this.cli.cushion.database(config.database);

    // this.cPrompt = require('../lib/prompt/prompt');
    // this.cFile = require('../lib/file/file');

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  allViews: {
    oneArgument: function(test) {
      var cli = this.cli,
          input = ['allViews'];

      console.log = function(message) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof message, 'string');
      };

      cli.prompt = function() {
        test.done();
      };

      cli.databaseCommands._allViews(input, cli);
    },
    twoArguments: function(test) {
        var cli = this.cli,
            input = ['allViews', 'foo'];

      cli.db.document = function(path) {
        test.strictEqual(path, '_design/foo');

        return {
          load: function(callback) {
            test.strictEqual(arguments.length, 1);
            test.strictEqual(typeof callback, 'function');

            test.done();
          }
        };
      };

      cli.databaseCommands._allViews(input, cli);
    }
  }
};
