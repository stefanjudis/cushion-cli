'use strict';

module.exports = {
  setUp: function(callback) {
    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../lib/cliRunner');
    this.prompt = require('../lib/prompt/prompt');
    this.fs = require('fs');
    this.clc = require('cli-color');

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  init: {
    optionsIsObject: {
      hasKeys: {
        callbackIsDefined: function(test) {
          var cli = this.cli,
              callback = function() {},
              options = {
            oneKey: 'someValue'
          },
              initWithOptions = cli.initWithOptions,
              init = this.prompt.init;

          this.prompt.init = function() {
            test.strictEqual(arguments.length, 1);
            test.strictEqual(arguments[0], cli);

            this.prompt.rl = true;
          }.bind(this);

          cli.initWithOptions = function() {
            test.strictEqual(arguments.length, 2);

            test.strictEqual(typeof arguments[0], 'object');
            test.strictEqual(Object.keys(options).length, 1);
            test.strictEqual(arguments[0].oneKey, 'someValue')

            test.strictEqual(arguments[1], callback);

            //check if readline was initialized
            test.ok(this.prompt.rl);

            test.done();
          }.bind(this);

          cli.init(options, callback);

          cli.initWithOptions = initWithOptions;
          this.prompt.init = init;
        },
        callbackIsUndefined: function(test) {
          var cli = this.cli,
              options = {
            oneKey: 'someValue'
          },
              initWithOptions = cli.initWithOptions,
              init = this.prompt.init;

          this.prompt.init = function() {
            test.strictEqual(arguments.length, 1);
            test.strictEqual(arguments[0], cli);

            this.prompt.rl = true;
          }.bind(this);

          cli.initWithOptions = function() {
            test.strictEqual(arguments.length, 2);

            test.strictEqual(typeof arguments[0], 'object');
            test.strictEqual(Object.keys(options).length, 1);
            test.strictEqual(arguments[0].oneKey, 'someValue')

            test.strictEqual(arguments[1], cli.createConnection);

            //check if readline was initialized
            test.ok(this.prompt.rl);

            test.done();
          }.bind(this);

          cli.init(options);

          cli.initWithOptions = initWithOptions;
          this.prompt.init = init;
        }
      },
      hasNoKeys: {
        callbackIsDefined: function(test) {
          var cli = this.cli,
              callback = function() {},
              options = {},
              prompt = this.prompt,
              init = prompt.init,
              setup = prompt.setup;

          prompt.init = function() {
            test.strictEqual(arguments.length, 1);
            test.strictEqual(arguments[0], cli);

            this.prompt.rl = true;
          }.bind(this);

          prompt.setup = function() {
            test.strictEqual(arguments.length, 2);

            test.strictEqual(typeof arguments[0], 'object');

            test.strictEqual(typeof arguments[1], 'function');
            test.strictEqual(arguments[1], callback);

            //check if readline was initialized
            test.ok(this.prompt.rl);

            test.done();
          }.bind(this);

          cli.init(options, callback);

          prompt.init = init;
          prompt.setup = setup;
        },
        callbackIsUndefined: function(test) {
          var cli = this.cli,
              options = {},
              prompt = this.prompt,
              init = prompt.init,
              setup = prompt.setup;

          prompt.init = function() {
            test.strictEqual(arguments.length, 1);
            test.strictEqual(arguments[0], cli);

            this.prompt.rl = true;
          }.bind(this);

          prompt.setup = function() {
            test.strictEqual(arguments.length, 2);

            test.strictEqual(typeof arguments[0], 'object');

            test.strictEqual(typeof arguments[1], 'function');
            test.strictEqual(arguments[1], cli.createConnection);

            //check if readline was initialized
            test.ok(this.prompt.rl);

            test.done();
          }.bind(this);

          cli.init(options);

          prompt.init = init;
          prompt.setup = setup;
        }
      }
    },
    optionsIsCallback: {
      callbackIsDefined: function(test) {
        var cli = this.cli,
            options = function() {},
            callback = function() {},
            prompt = this.prompt,
            init = prompt.init,
            setup = prompt.setup;

        prompt.init = function() {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(arguments[0], cli);

          this.prompt.rl = true;
        }.bind(this);

        prompt.setup = function() {
          test.strictEqual(arguments.length, 2);

          test.strictEqual(typeof arguments[0], 'object');
          test.strictEqual(arguments[0], cli);

          test.strictEqual(typeof arguments[1], 'function');
          test.strictEqual(arguments[1], options);

          //check if readline was initialized
          test.ok(this.prompt.rl);

          test.done();
        }.bind(this);

        cli.init(options, callback);

        prompt.init = init;
        prompt.setup = setup;
      },
      callbackIsUndefined: function(test) {
        var cli = this.cli,
            options = function() {},
            prompt = this.prompt,
            init = prompt.init,
            setup = prompt.setup;

        prompt.init = function() {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(arguments[0], cli);

          this.prompt.rl = true;
        }.bind(this);

        prompt.setup = function() {
          test.strictEqual(arguments.length, 2);

          test.strictEqual(typeof arguments[0], 'object');
          test.strictEqual(arguments[0], cli);

          test.strictEqual(typeof arguments[1], 'function');
          test.strictEqual(arguments[1], options);

          //check if readline was initialized
          test.ok(this.prompt.rl);

          test.done();
        }.bind(this);

        cli.init(options);

        prompt.init = init;
        prompt.setup = setup;
      }
    }
  },


  initWithOptions: {
    versionIsDefined: function(test) {
      var cli = this.cli,
          options = {
        v: true
      },
          fs = this.fs,
          readFile = fs.readFile;

      fs.readFile = function() {
        test.strictEqual(arguments.length, 2);

        test.strictEqual(typeof arguments[0], 'string');
        test.strictEqual(typeof arguments[1], 'function');

        test.done();
      };

      cli.initWithOptions(options);

      fs.readFile = readFile;
    },
    hostAndPortAreDefined: {
      adminIsDefined: function(test) {
        var cli = this.cli,
            callback = function() {},
            options = {
          h: '127.0.0.1',
          p: '5984',
          a: 'john'
        },
            prompt = this.prompt,
            promptGetAdminPassword = prompt._promptGetAdminPassword;

        prompt._promptGetAdminPassword = function() {
          test.strictEqual(arguments.length, 2);

          test.strictEqual(typeof arguments[0], 'string');
          test.strictEqual(arguments[0], options.a);

          test.strictEqual(typeof arguments[1], 'object');
          test.strictEqual(arguments[1] instanceof Array, true);
          test.strictEqual(arguments[1].length, 3);
          test.strictEqual(arguments[1][0], options.h);
          test.strictEqual(arguments[1][1], options.p);
          test.strictEqual(arguments[1][2], callback);

          test.done();
        }

        cli.initWithOptions(options, callback);

        prompt._promptGetAdminPassword = promptGetAdminPassword;
      },
      adminIsUndefined: function(test) {
        var cli = this.cli,
            options = {
          h: '127.0.0.1',
          p: '5984'
        },
            callback = function() {
              test.strictEqual(arguments.length, 4);

              test.strictEqual(typeof arguments[0], 'string');
              test.strictEqual(arguments[0], '');

              test.strictEqual(typeof arguments[1], 'string');
              test.strictEqual(arguments[1], '');

              test.strictEqual(typeof arguments[2], 'string');
              test.strictEqual(arguments[2], options.h);

              test.strictEqual(typeof arguments[3], 'string');
              test.strictEqual(arguments[3], options.p);

              test.done();
            }

        cli.initWithOptions(options, callback);
      }
    },
    noMatchesWithOptions: function(test) {
      var cli = this.cli,
          options = {
        someThing: 'someValue',
        foo: 'bar'
      },
          init = cli.init;

      console.log = function() {
        test.strictEqual(arguments.length, 1);

        test.strictEqual(
          arguments[0],
          this.clc.red('\nOptions did not match. Starting default setup...\n')
        );
      }.bind(this);

      cli.init = function() {
        test.done();
      };

      cli.initWithOptions(options);

      cli.init = init;
    }
  }
};
