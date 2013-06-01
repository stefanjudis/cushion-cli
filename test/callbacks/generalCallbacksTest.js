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


  users: {
    errorAppeared: function(test) {
      var cli = this.cli,
          error = {
        error: 'error'
      },
          prompt = cli.prompt,
          showError = cli.connectionCallbacks.showError;


      cli.connectionCallbacks.showError = function() {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof arguments[0], 'string');
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.done();
      };

      cli.connectionCallbacks.users(error, {}, []);

      cli.connectionCallbacks.showError = showError;
      cli.prompt = prompt;
    },
    noErrorAppeared: {
      userExists: function(test) {
        var cli = this.cli,
            prompt = cli.prompt;

        cli.prompt = function() {
          test.strictEqual(arguments.length, 0);

          test.strictEqual(cli.unsavedChanges, false);

          test.done();
        };

        cli.connectionCallbacks.users.apply(
          'john',
          [
            false,
            {},
            {
              'org.couchdb.user:john': 'something',
              'org.couchdb.user:doe': 'something'
            }
          ]
        );

        cli.prompt = prompt;
      },
      userDoesNotExist: function(test) {
        var cli = this.cli,
            prompt = cli.prompt;

        cli.prompt = function() {
          test.strictEqual(arguments.length, 0);

          test.strictEqual(cli.unsavedChanges, true);

          test.done();
        };

        cli.connectionCallbacks.users.apply(
          'john',
          [
            false,
            {},
            {
              'org.couchdb.user:doe': 'something'
            }
          ]
        );

        cli.prompt = prompt;
      }
    }
  }
};
