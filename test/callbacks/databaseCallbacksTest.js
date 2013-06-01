'use strict';

module.exports = {
  setUp: function(callback) {
    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../../lib/cliRunner');
    this.cli.level = 'database';

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  exists: {
    errorAppeared: function(test) {
      var cli = this.cli,
          error = {
        error: 'error'
      },
          prompt = cli.prompt;

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.done();
      };

      cli.databaseCallbacks.exists(error);

      cli.prompt = prompt;
    },
    noErrorAppeared: {
      exists: function(test) {
        var cli = this.cli,
            error = false,
            prompt = cli.prompt;

        cli.prompt = function() {
          test.strictEqual(arguments.length, 0);

          test.strictEqual(cli.unsavedChanges, false);

          test.done();
        };

        cli.databaseCallbacks.exists(error, true);

        cli.prompt = prompt;
      },
      doesNotExists: function(test) {
        var cli = this.cli,
            error = false,
            prompt = cli.prompt;

        cli.prompt = function() {
          test.strictEqual(arguments.length, 0);

          test.strictEqual(cli.unsavedChanges, true);

          test.done();
        };

        cli.databaseCallbacks.exists(error, false);

        cli.prompt = prompt;
      }
    }
  }
};
