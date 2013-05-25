'use strict';

module.exports = {
  setUp: function(callback) {
    var config = require('../config');

    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../../lib/cliRunner');
    this.cli.level = 'database';
    this.cli.name = config.database;

    this.cli.db = this.cli.cushion.database(config.database);

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  allDesignDocuments: function(test) {
    var cli = this.cli,
        allDocuments = cli.db.allDocuments,
        input = ['allDesignDocuments'];


    cli.db.allDocuments = function(callback) {
      test.strictEqual(arguments.length, 1);
      test.strictEqual(typeof callback, 'function');
      test.done();
    };

    cli.databaseCommands._allDesignDocuments(input, cli);

    cli.db.allDocuments = allDocuments;
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
  },


  document: {
    withId: function(test) {
      var cli = this.cli,
          input = ['document', 'id'];

      cli.prompt = function() {
        test.strictEqual(cli.level, 'document');
        test.strictEqual(cli.name, 'id');
        test.strictEqual(typeof cli.doc, 'object');
        // check for prototype should be implemented here as well
        test.done();
      };

      cli.databaseCommands._document(input, cli);
    },
    withoutId: function(test) {
      var cli = this.cli,
          input = ['document'];

      cli.prompt = function() {
        test.strictEqual(cli.level, 'document');
        test.strictEqual(cli.name, '...');
        test.strictEqual(typeof cli.doc, 'object');
        // check for prototype should be implemented here as well
        test.done();
      };

      cli.databaseCommands._document(input, cli);
    }
  },


  filterDesigns: {
    withError: function(test) {
      var cli = this.cli,
          error = { foo: 'bar' },
          showError = cli.databaseCallbacks.showError;

      cli.databaseCallbacks.showError = function(errorObject) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(errorObject, error);
        test.done();
      };

      cli.databaseCommands.__filterDesigns(error, {}, {});

      cli.databaseCallbacks.showError = showError;
    },
    withoutError: function(test) {
      var cli = this.cli,
          allDesignDocuments = cli.databaseCallbacks.allDesignDocuments,
          allDesignDocs = {
        '_design/foo': 'foo',
        '_design/bar': 'bar',
        'bar': 'bar'
      },
          info = {};

      cli.databaseCallbacks.allDesignDocuments = function(designDocs) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof designDocs, 'object');
        test.strictEqual(designDocs instanceof Array, true);
        test.strictEqual(designDocs.length, 2);
        test.strictEqual(designDocs[0], 'foo');
        test.strictEqual(designDocs[1], 'bar');
        test.done();
      };

      cli.databaseCommands.__filterDesigns(null, info, allDesignDocs);

      cli.databaseCallbacks.allDesignDocuments = allDesignDocuments;
    }
  }
};
