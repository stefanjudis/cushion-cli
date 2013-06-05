'use strict';

module.exports = {
  setUp: function(callback) {
    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../../lib/cliRunner');
    this.cli.level = 'document';

    this.clc = require('cli-color');

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },

  content: {
    anErrorOccured: function(test) {
      var cli = this.cli,
          error = {
        error: 'someError'
      },
          showError = cli.documentCallbacks.showError;

      cli.documentCallbacks.showError = function() {
        test.strictEqual(arguments.length, 1);

        test.strictEqual(typeof arguments[0], 'object');
        test.strictEqual(arguments[0], error);

        test.done();
      };

      cli.documentCallbacks.content(error);

      cli.documentCallbacks.showError = showError;
    },
    noErrorOccured: {
      documentIsUndefined: function(test) {
        var cli = this.cli,
            error = null,
            prompt = cli.prompt;

        console.log = function() {
          test.strictEqual(arguments.length, 1);

          test.strictEqual(typeof arguments[0], 'string');
          test.strictEqual(
            arguments[0],
            this.clc.red('\nThis property does not exist in this document.\n')
          );
        }.bind(this);

        cli.prompt = function() {
          test.done();
        };

        cli.documentCallbacks.content(error);

        cli.prompt = prompt;
      },
      documentIdIsFunction: function(test) {
        var cli = this.cli,
            document = {
          id: function() {}
        },
            error = null,
            prompt = cli.prompt;

        cli.unsavedChanges = false;

        console.log = function() {
          test.strictEqual(arguments.length, 1);

          test.strictEqual(typeof arguments[0], 'string');
          test.strictEqual(
            arguments[0],
            this.clc.yellow('\nProperty set.\n')
          );
        }.bind(this);

        cli.prompt = function() {
          test.strictEqual(cli.unsavedChanges, true);

          test.done();
        };

        cli.documentCallbacks.content(error, document);

        cli.prompt = prompt;
      },
      documentIdIsUndefined: function(test) {
        var cli = this.cli,
            document = {},
            error = null,
            pretty = console.pretty,
            prompt = cli.prompt;

        console.pretty = function() {
          test.strictEqual(arguments.length, 1);

          test.strictEqual(typeof arguments[0], 'object');
          test.strictEqual(arguments[0], document);
        }

        cli.prompt = function() {
          test.done();
        };

        cli.documentCallbacks.content(error, document);

        cli.prompt = prompt;
        console.pretty = pretty;
      }
    }
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
          error = null,
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
  },


  save: {
    errorAppeared: function(test) {
      var cli = this.cli,
          error = {
        'error': 'some_error'
      },
          showError = cli.documentCallbacks.showError;

      cli.documentCallbacks.showError = function() {
        test.strictEqual(arguments.length, 1);

        test.strictEqual(typeof arguments[0], 'object');
        test.strictEqual(arguments[0].error, 'some_error');
        test.strictEqual(arguments[0], error);

        test.done();
      };

      cli.documentCallbacks.save(error);

      cli.documentCallbacks.showError = showError;
    },
    noErrorAppeared: {
      idWasSet: function(test) {
        var cli = this.cli,
            error = null,
            documentObject = {
          '_id': '12345678'
        },
            prompt = cli.prompt;

        cli.name = '12345678';
        cli.unsavedChanges = true;

        console.log = function() {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof arguments[0], 'string');
        };

        cli.prompt = function() {
          test.strictEqual(typeof cli.name, 'string');
          test.strictEqual(cli.name, '12345678');

          test.strictEqual(typeof cli.unsavedChanges, 'boolean');
          test.strictEqual(cli.unsavedChanges, false);

          test.strictEqual(typeof cli.doc, 'object');
          test.strictEqual(cli.doc, documentObject);
          test.strictEqual(typeof cli.doc._id, 'string');
          test.strictEqual(cli.doc._id, '12345678');

          test.done();
        };

        cli.documentCallbacks.save(error, documentObject);

        cli.prompt = prompt;
      },
      idWasNotSet: function(test) {
        var cli = this.cli,
            error = null,
            documentObject = {
          '_id': '12345678'
        },
            prompt = cli.prompt;

        cli.name = '...';
        cli.unsavedChanges = true;

        console.log = function() {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof arguments[0], 'string');
        };

        cli.prompt = function() {
          test.strictEqual(typeof cli.name, 'string');
          test.strictEqual(cli.name, '12345678');

          test.strictEqual(typeof cli.unsavedChanges, 'boolean');
          test.strictEqual(cli.unsavedChanges, false);

          test.strictEqual(typeof cli.doc, 'object');
          test.strictEqual(cli.doc, documentObject);
          test.strictEqual(typeof cli.doc._id, 'string');
          test.strictEqual(cli.name, '12345678');

          test.done();
        };

        cli.documentCallbacks.save(error, documentObject);

        cli.prompt = prompt;
      }
    }
  }
};
