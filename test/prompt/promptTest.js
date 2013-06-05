'use strict';

module.exports = {
  setUp: function(callback) {
    this.cPrompt = require('../../lib/prompt/prompt');
    this.cPrompt.rl = {};

    this.cFile = require('../../lib/file/file');

    this.npm = require('npm');

    this.clc = require('cli-color');

    callback();
  },


  tearDown: function(callback) {
    callback();
  },


  npmUpdateFunctions: {
    promptCheckForUpdates: function(test) {
      var question = this.cPrompt.rl.question;

      this.cPrompt.rl.question = function() {
        test.strictEqual(arguments.length, 2);

        test.strictEqual(typeof arguments[0], 'string');
        test.strictEqual(
          arguments[0],
          'Do you want to check for updates of cushion-cli? (yes|no) '
        );

        test.strictEqual(typeof arguments[1], 'function');
        test.strictEqual(
          arguments[1],
          this.cPrompt._promptCheckForUpdatesCallback
        );

        test.done();
      }.bind(this);

      this.cPrompt._promptCheckForUpdates();

      this.cPrompt.rl.question = question;
    },

    promptCheckForUpdatesCallback: {
      answerWasYes: function(test) {
        var check = 'yes',
            load = this.npm.load;

        console.log = function() {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof arguments[0], 'string');
        }

        this.npm.load = function() {
          test.strictEqual(arguments.length, 2);

          test.strictEqual(typeof arguments[0], 'object');
          test.strictEqual(arguments[0].loglevel, 'silent');
          test.strictEqual(Object.keys(arguments[0]).length, 1);

          test.strictEqual(typeof arguments[1], 'function');
          test.strictEqual(arguments[1], this.cPrompt._npmLoadCallback);

          test.done();
        }.bind(this);

        this.cPrompt._promptCheckForUpdatesCallback(check);

        this.npm.load = load;
      },
      answerWasNotYes: function(test) {
        var check = 'no',
            defaultExists = this.cFile.defaultExists;

        this.cFile.defaultExists = function() {
          test.strictEqual(arguments.length, 1);

          test.strictEqual(typeof arguments[0], 'function');
          test.strictEqual(arguments[0], this.cPrompt._defaultsCallback);

          test.done();
        }.bind(this);

        this.cPrompt._promptCheckForUpdatesCallback(check);

        this.cFile.defaultExists = defaultExists;
      }
    },


    npmLoadCallback: {
      anErrorOccured: function(test) {
        var error = {
          error: 'someError'
        },
            defaultExists = this.cFile.defaultExists;

        console.log = function() {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof arguments[0], 'string');
        };

        this.cFile.defaultExists = function() {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof arguments[0], 'function');
          test.strictEqual(arguments[0], this.cPrompt._defaultsCallback);

          test.done();
        }.bind(this);

        this.cPrompt._npmLoadCallback(error);

        this.cFile.defaultExists = defaultExists;
      },
      noErrorOccured: function(test) {
        var error = null,
            log = console.log,
            npm = {};

        npm.search = function() {
          test.strictEqual(arguments.length, 2);

          test.strictEqual(typeof arguments[0], 'string');
          test.strictEqual(arguments[0], 'cushion-cli');

          test.strictEqual(typeof arguments[1], 'function');
          test.strictEqual(arguments[1], this.cPrompt._npmSearchCallback);

          test.notEqual(console.log, log);
          test.strictEqual(this.cPrompt.log, log);

          test.done();
        }.bind(this);

        this.cPrompt._npmLoadCallback(error, npm);
      }
    },


    npmSearchCallback: {
      anErrorOccured: function(test) {
        var error = {
          error: 'someError'
        },
            defaultExists = this.cFile.defaultExists,
            log = console.log;

        this.cPrompt.log = log;

        this.cFile.defaultExists = function() {
          test.strictEqual(arguments.length, 1);

          test.strictEqual(typeof arguments[0], 'function');
          test.strictEqual(arguments[0], this.cPrompt._defaultsCallback);

          test.strictEqual(this.cPrompt.log, undefined);

          test.strictEqual(console.log, log);

          test.done();
        }.bind(this);

        this.cPrompt.log = log;

        this.cPrompt._npmSearchCallback(error);

        this.cFile.defaultExists = defaultExists;
      },
      noErrorOccured: function(test) {
        var error = null,
            result = {
          'cushion-cli': {
            version: '1.2.3'
          }
        },
            getCushionVersionNumber = this.cFile.getCushionVersionNumber,
            log = console.log;

        this.cPrompt.log = log;

        this.cFile.getCushionVersionNumber = function() {
          test.strictEqual(arguments.length, 1);

          test.strictEqual(typeof arguments[0], 'function');
          test.strictEqual(
            arguments[0],
            this.cPrompt._npmCushionVersionCallback
          );

          test.strictEqual(this.cPrompt.log, undefined);
          test.strictEqual(this.cPrompt.actualVersion, '1.2.3');

          test.strictEqual(console.log, log);

          test.done();
        }.bind(this);

        this.cPrompt._npmSearchCallback(error, result);

        this.cFile.getCushionVersionNumber = getCushionVersionNumber;
      }
    },


    npmCushionVersionCallback: {
      anErrorOccured: function(test) {
        var error = {
          error: 'someError'
        },
            defaultExists = this.cFile.defaultExists;

        console.log = function() {
          test.strictEqual(arguments.length, 1);

          test.strictEqual(typeof arguments[0], 'string');
          test.strictEqual(
            arguments[0],
            this.clc.red(
              '\nSorry. An error occured at reading your package.json.\n'
            )
          );
        }.bind(this);

        this.cFile.defaultExists = function() {
          test.strictEqual(arguments.length, 1);

          test.strictEqual(typeof arguments[0], 'function');
          test.strictEqual(arguments[0], this.cPrompt._defaultsCallback);

          test.strictEqual(this.cPrompt.actualVersion, undefined);

          test.done();
        }.bind(this);

        this.cPrompt._npmCushionVersionCallback(error);

        this.cFile.defaultExists = defaultExists;
      },
      noErrorOccured: {
        versionEqualActualVersion: function(test) {
          var error = null,
              defaultExists = this.cFile.defaultExists,
              version = '1.2.3';

          this.cPrompt.actualVersion = version;

          console.log = function() {
            test.strictEqual(arguments.length, 1);

            test.strictEqual(typeof arguments[0], 'string');
          }.bind(this);

          this.cFile.defaultExists = function() {
            test.strictEqual(arguments.length, 1);

            test.strictEqual(typeof arguments[0], 'function');
            test.strictEqual(arguments[0], this.cPrompt._defaultsCallback);

            test.strictEqual(this.cPrompt.actualVersion, undefined);

            test.done();
          }.bind(this);

          this.cPrompt._npmCushionVersionCallback(error, version);

          this.cFile.defaultExists = defaultExists;
        },
        versionNotEqualActualVersion: function(test) {
          var error = null,
              defaultExists = this.cFile.defaultExists,
              version = '1.2.3';

          this.cPrompt.actualVersion = '1.2.1';

          console.log = function() {
            test.strictEqual(arguments.length, 1);

            test.strictEqual(typeof arguments[0], 'string');
          }.bind(this);

          this.cFile.defaultExists = function() {
            test.strictEqual(arguments.length, 1);

            test.strictEqual(typeof arguments[0], 'function');
            test.strictEqual(arguments[0], this.cPrompt._defaultsCallback);

            test.strictEqual(this.cPrompt.actualVersion, undefined);

            test.done();
          }.bind(this);

          this.cPrompt._npmCushionVersionCallback(error, version);

          this.cFile.defaultExists = defaultExists;
        }
      }
    }
  }
};
