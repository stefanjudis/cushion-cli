'use strict';

module.exports = {
  setUp: function(callback) {
    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../../lib/cliRunner');
    this.cli.level = 'document';

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  load: {
    errorAppeared: {
      errorIsNotFound: function(test) {
        var cli = this.cli,
            documentObject = {
          '_id': 'id'
        },
            error = {
          error: 'not_found'
        },
            prompt = cli.prompt;

        cli.unsavedChanges = false;

        console.log = function() {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof arguments[0], 'string');
        };

        cli.prompt = function() {
          test.strictEqual(arguments.length, 0);

          test.strictEqual(cli.unsavedChanges, true);

          test.done();
        };

        cli.documentCallbacks.load(error, documentObject);

        cli.prompt = prompt;
      },
      errorIsNotNotFound: function(test) {
        var cli = this.cli,
            documentObject = {
          '_id': 'id'
        },
            error = {
          error: 'some_error'
        },
            prompt = cli.prompt,
            showError = cli.documentCallbacks.showError;

        cli.unsavedChanges = false;

        console.log = function() {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof arguments[0], 'string');
        };

        cli.documentCallbacks.showError = function() {
          test.strictEqual(arguments.length, 1);

          test.strictEqual(typeof arguments[0], 'object');
          test.strictEqual(arguments[0], error);
          test.strictEqual(arguments[0].error, 'some_error');
        };

        cli.prompt = function() {
          test.strictEqual(arguments.length, 0);

          test.strictEqual(cli.unsavedChanges, false);

          test.done();
        };

        cli.documentCallbacks.load(error, documentObject);

        cli.prompt = prompt;
        cli.documentCallbacks.showError = showError;
      }
    },
    noErrorAppeared: function(test) {
      var cli = this.cli,
          documentObject = {
        '_id': 'id'
      },
          error = false,
          prompt = cli.prompt;

      cli.unsavedChanges = false;

      console.log = function() {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof arguments[0], 'string');
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.strictEqual(cli.unsavedChanges, false);

        test.strictEqual(cli.doc, documentObject);
        test.strictEqual(typeof cli.doc, 'object');
        test.strictEqual(cli.doc._id, 'id');

        test.done();
      };

      cli.documentCallbacks.load(error, documentObject);

      cli.prompt = prompt;
    }
  }
};
