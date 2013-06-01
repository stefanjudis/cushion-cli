'use strict';

module.exports = {
  setUp: function(callback) {
    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../../lib/cliRunner');
    this.cli.level = 'connection';
    this.cli.unsavedChanges = false;

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  create: {
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

      cli.userCallbacks.create(error);

      cli.prompt = prompt;
    },
    noErrorAppeared: {
      creationWorked: function(test) {
        var cli = this.cli,
            error = false,
            prompt = cli.prompt;

        cli.prompt = function() {
          test.strictEqual(arguments.length, 0);

          test.strictEqual(cli.unsavedChanges, false);

          test.done();
        };

        cli.userCallbacks.create(error, true);

        cli.prompt = prompt;
      },
      creationDoesNotWork: function(test) {
        var cli = this.cli,
            error = false,
            prompt = cli.prompt;

        cli.prompt = function() {
          test.strictEqual(arguments.length, 0);

          test.strictEqual(cli.unsavedChanges, true);

          test.done();
        };

        cli.userCallbacks.create(error, false);

        cli.prompt = prompt;
      }
    }
  }
};
