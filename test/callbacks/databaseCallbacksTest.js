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


  allDesignDocuments: function(test) {
    var cli = this.cli,
        prompt = cli.prompt,
        pretty = console.pretty,
        designs = ['someDesign'];

    console.pretty = function() {
      test.strictEqual(arguments.length, 1);
      test.strictEqual(typeof arguments[0], 'object');
      test.strictEqual(arguments[0] instanceof Array, true);
      test.strictEqual(arguments[0].length, 1);
      test.strictEqual(arguments[0][0], 'someDesign');
    };

    cli.prompt = function() {
      test.strictEqual(arguments.length, 0);

      test.done();
    };

    cli.databaseCallbacks.allDesignDocuments(designs);

    cli.prompt = prompt;
    console.pretty = pretty;
  },


  allDocuments: {
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

      cli.databaseCallbacks.allDocuments(error);

      cli.prompt = prompt;
      cli.databaseCallbacks.showError = showError;
    },
    noErrorAppeared: function(test) {
      var allDocuments = ['someDocument'],
          cli = this.cli,
          error = null,
          prompt = cli.prompt,
          pretty = console.pretty;

      console.pretty = function() {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof arguments[0], 'object');
        test.strictEqual(arguments[0] instanceof Array, true);
        test.strictEqual(arguments[0][0], 'someDocument');
        test.strictEqual(arguments[0], allDocuments);
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.done();
      };

      cli.databaseCallbacks.create(error, {}, allDocuments);

      cli.prompt = prompt;
      console.pretty = pretty;
    }
  },


  allViews: function(test) {
    var cli = this.cli,
        prompt = cli.prompt,
        pretty = console.pretty,
        log = console.log,
        views = ['someView'];

    console.log = function() {
      test.strictEqual(arguments.length, 1);
      test.strictEqual(typeof arguments[0], 'string');
      test.strictEqual(
        arguments[0],
        'This design document includes of ' + views.length + ' views.'
      );
    };

    console.pretty = function() {
      test.strictEqual(arguments.length, 1);
      test.strictEqual(typeof arguments[0], 'object');
      test.strictEqual(arguments[0] instanceof Array, true);
      test.strictEqual(arguments[0].length, 1);
      test.strictEqual(arguments[0][0], 'someView');
    };

    cli.prompt = function() {
      test.strictEqual(arguments.length, 0);

      test.done();
    };

    cli.databaseCallbacks.allViews(views);

    cli.prompt = prompt;
    console.log = log;
    console.pretty = pretty;
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


  designLoaded: {
    errorAppeared: function(test) {
      var cli = this.cli,
          error = {
        error: 'someError'
      },
          prompt = cli.prompt,
          showError = cli.databaseCallbacks.showError;

      cli.databaseCallbacks.showError = function() {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof arguments[0], 'object');
        test.strictEqual(arguments[0], error);
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.done();
      };

      cli.databaseCallbacks.designLoaded(error);

      cli.databaseCallbacks.showError = showError;
      cli.prompt = prompt;
    },
    noErrorAppeared: function(test) {
      var cli = this.cli,
          document = {},
          error = null,
          allViews = cli.databaseCallbacks.allViews,
          returnValue = {
          something: 'something'
        };

      document.body = function() {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof arguments[0], 'string');
        test.strictEqual(arguments[0], 'views');

        return returnValue;
      };

      cli.databaseCallbacks.allViews = function() {
        test.strictEqual(arguments.length, 1);

        test.strictEqual(arguments[0].length, 1);
        test.strictEqual(arguments[0][0], 'something');
        test.done();
      };

      cli.databaseCallbacks.designLoaded(error, document);

      cli.databaseCallbacks.allViews = allViews;
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
