'use strict';

module.exports = {
  setUp: function(callback) {
    var config = require('../config');

    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../../lib/cliRunner');
    this.cli.level = 'database';
    this.cli.name = 'database1';

    this.cli._setCushion(
      config.name,
      config.password,
      config.host,
      config.port
    );

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
          prompt = cli.prompt,
          showError = cli.databaseCallbacks.showError;

      cli.databaseCallbacks.showError = function(errorObject) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof errorObject, 'object');
        test.strictEqual(errorObject.error, 'error');
        test.strictEqual(errorObject, error);
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.done();
      };

      cli.databaseCallbacks.create(error);

      cli.prompt = prompt;
      cli.databaseCallbacks.showError = showError;
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

        cli.databaseCallbacks.create(error, true);

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

        cli.databaseCallbacks.create(error, false);

        cli.prompt = prompt;
      }
    }
  },


  destroy: {
    errorAppeared: function(test) {
      var cli = this.cli,
          error = {
        error: 'error'
      },
          prompt = cli.prompt,
          showError = cli.databaseCallbacks.showError;

      cli.databaseCallbacks.showError = function(errorObject) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof errorObject, 'object');
        test.strictEqual(errorObject.error, 'error');
        test.strictEqual(errorObject, error);
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.done();
      };

      cli.databaseCallbacks.destroy(error);

      cli.prompt = prompt;
      cli.databaseCallbacks.showError = showError;
    },
    noErrorAppeared: {
      responseIsTrue: function(test) {
        var cli = this.cli,
            prompt = cli.prompt;

        console.log = function(message) {
          test.strictEqual(arguments.length, 1);

          test.strictEqual(typeof message, 'string');
        };

        cli.prompt = function() {
          test.strictEqual(arguments.length, 0);

          test.strictEqual(cli.level, 'connection');
          test.strictEqual(cli.name, cli.cushion.option('host'));

          test.done();
        };

        cli.databaseCallbacks.destroy(false, true);

        cli.prompt = prompt;
      },
      responseIsFalse: function(test) {
        var cli = this.cli,
            prompt = cli.prompt;

        console.log = function(message) {
          test.strictEqual(arguments.length, 1);

          test.strictEqual(typeof message, 'string');
        };

        cli.prompt = function() {
          test.strictEqual(arguments.length, 0);

          test.strictEqual(cli.level, 'database');
          test.strictEqual(cli.name, 'database1');

          test.done();
        };

        cli.databaseCallbacks.destroy(false, false);

        cli.prompt = prompt;
      }
    }
  },


  exists: {
    errorAppeared: function(test) {
      var cli = this.cli,
          error = {
        error: 'error'
      },
          prompt = cli.prompt,
          showError = cli.databaseCallbacks.showError;

      cli.databaseCallbacks.showError = function(errorObject) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof errorObject, 'object');
        test.strictEqual(errorObject.error, 'error');
        test.strictEqual(errorObject, error);
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.done();
      };

      cli.databaseCallbacks.exists(error);

      cli.prompt = prompt;
      cli.databaseCallbacks.showError = showError;
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
