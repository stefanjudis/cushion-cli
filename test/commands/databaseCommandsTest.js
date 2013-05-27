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


  allDocuments: {
    oneArgument: function(test) {
      var cli = this.cli,
          allDocuments = cli.db.allDocuments,
          input = ['allDocuments'];

      cli.db.allDocuments = function(callback) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof callback, 'function');
        test.strictEqual(callback, cli.databaseCallbacks.allDocuments);
        test.done();
      };

      cli.databaseCommands._allDocuments(input, cli);

      cli.db.allDocuments = allDocuments;
    },
    twoArguments: {
      validArguments: function(test) {
        var cli = this.cli,
            allDocuments = cli.db.allDocuments,
            input = ['allDocuments', 'foo=bar'];

        cli.db.allDocuments = function(paramsObject, callback) {
          test.strictEqual(arguments.length, 2);

          test.strictEqual(typeof paramsObject, 'object');
          test.strictEqual(paramsObject.foo, 'bar');
          test.strictEqual(Object.keys(paramsObject).length, 1);

          test.strictEqual(typeof callback, 'function');
          test.strictEqual(callback, cli.databaseCallbacks.allDocuments);

          test.done();
        };

        cli.databaseCommands._allDocuments(input, cli);

        cli.db.allDocuments = allDocuments;
      },
      invalidArguments: function(test) {
        var cli = this.cli,
            input = ['allDocuments', 'foo'];

        console.log = function(message) {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof message, 'string');
        }
        cli.prompt = function() {
          test.done();
        };

        cli.databaseCommands._allDocuments(input, cli);
      },
    }
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
  },


  tmpView: {
    oneArgument: function(test) {
      var cli = this.cli,
          input = ['tmpView'];

      console.log = function(message) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof message, 'string');
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);
        test.done();
      }

      cli.databaseCommands._tmpView(input, cli);
    },
    twoArguments: function(test) {
      var cli = this.cli,
          input = ['tmpView', '\'function(doc) {emit(doc._id, doc);}\''],
          tmpView = cli.db.temporaryView;

      cli.db.temporaryView = function() {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(typeof arguments[0], 'string');
        test.strictEqual(arguments[0], '\'function(doc) {emit(doc._id, doc);}\'');

        test.strictEqual(typeof arguments[1], 'function');
        test.strictEqual(arguments[1] instanceof Function, true);
        test.strictEqual(arguments[1], cli.databaseCallbacks.view);

        test.done();
      };

      cli.databaseCommands._tmpView(input, cli);

      cli.db.temporaryView = tmpView;
    },
    threeArguments: {
      validInput: function(test) {
        var cli = this.cli,
            input = ['tmpView', '\'function(doc) {emit(doc._id, doc);}\'', 'limit=3'],
            tmpView = cli.db.temporaryView;

        cli.db.temporaryView = function() {
          test.strictEqual(arguments.length, 3);
          test.strictEqual(typeof arguments[0], 'string');
          test.strictEqual(arguments[0], '\'function(doc) {emit(doc._id, doc);}\'');

          test.strictEqual(typeof arguments[1], 'object');
          test.strictEqual(Object.keys(arguments[1]).length, 1);
          test.strictEqual(Object.keys(arguments[1])[0], 'limit');
          test.strictEqual(arguments[1].limit, '3');

          test.strictEqual(typeof arguments[2], 'function');
          test.strictEqual(arguments[2] instanceof Function, true);
          test.strictEqual(arguments[2], cli.databaseCallbacks.view);

          test.done();
        };

        cli.databaseCommands._tmpView(input, cli);

        cli.db.temporaryView = tmpView;
      },
      invalidInput: function(test) {
        var cli = this.cli,
            input = ['tmpView', '\'function(doc) {emit(doc._id, doc);}\'', 'limit=3'];

        console.log = function(message) {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof message, 'string');
        };

        cli.prompt = function() {
          test.strictEqual(arguments.length, 0);
          test.done();
        }

        cli.databaseCommands._tmpView(input, cli);
      }
    }
  },


  view: {
    oneArgument: function(test) {
      var cli = this.cli,
          input = ['view'];

      console.log = function(message) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof message, 'string');
      };

      cli.prompt = function() {
        test.done();
      };

      cli.databaseCommands._view(input, cli);
    },
    twoArguments: function(test) {
      var cli = this.cli,
          input = ['view', 'entries'];

      console.log = function(message) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof message, 'string');
      };

      cli.prompt = function() {
        test.done();
      };

      cli.databaseCommands._view(input, cli);
    },
    threeArguments: function(test) {
      var cli = this.cli,
          input = ['view', 'entries', 'all'],
          view = cli.db.view;

      cli.db.view = function() {
        test.strictEqual(arguments.length, 4);
        test.strictEqual(arguments[0], 'entries');
        test.strictEqual(arguments[1], 'all');
        test.strictEqual(Object.keys(arguments[2]).length, 0);
        test.strictEqual(typeof arguments[3], 'function');
        test.strictEqual(arguments[3], cli.databaseCallbacks.view);
        test.done()
      };

      cli.databaseCommands._view(input, cli);

      cli.db.view = view;
    },
    fourArguments: {
      withValidParams: function(test) {
        var cli = this.cli,
            input = ['view', 'entries', 'all', 'limit=3'],
            view = cli.db.view;

        cli.db.view = function() {
          test.strictEqual(arguments.length, 4);
          test.strictEqual(arguments[0], 'entries');
          test.strictEqual(arguments[1], 'all');
          test.strictEqual(Object.keys(arguments[2]).length, 1);
          test.strictEqual(Object.keys(arguments[2])[0], 'limit');
          test.strictEqual(arguments[2].limit, '3');
          test.strictEqual(typeof arguments[3], 'function');
          test.strictEqual(arguments[3], cli.databaseCallbacks.view);
          test.done()
        };

        cli.databaseCommands._view(input, cli);

        cli.db.view = view;
      },
      withInvalidParams: function(test) {
        var cli = this.cli,
            input = ['view', 'entries', 'all', 'limit'];

        console.log = function(message) {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof message, 'string');
        };

        cli.prompt = function() {
          test.done();
        };

        cli.databaseCommands._view(input, cli);
      }
    }
  }
};
