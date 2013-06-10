'use strict';

module.exports = {
  setUp: function(callback) {
    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../../lib/cliRunner');
    this.clc = require('cli-color');

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  createAdmin: {
    errorAppeared: function(test) {
      var cli = this.cli,
          error = {
        error: 'someError'
      },
          prompt = cli.prompt,
          showError = cli.connectionCallbacks.showError;

      cli.connectionCallbacks.showError = function() {
        test.strictEqual(arguments.length, 1);

        test.strictEqual(typeof arguments[0], 'object');
        test.strictEqual(arguments[0], error);
        test.strictEqual(arguments[0].error, 'someError');
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.done();
      };

      cli.connectionCallbacks.createAdmin(error);

      cli.prompt = prompt;
      cli.connectionCallbacks.showError = showError;
    },
    noErrorAppeared: function(test) {
      var cli = this.cli,
          error = null,
          pretty = console.pretty,
          prompt = cli.prompt;

      console.log = function() {
        test.strictEqual(arguments.length, 1);

        test.strictEqual(typeof arguments[0], 'string');
        test.strictEqual(arguments[0], this.clc.yellow('Admin was created.'));
      }.bind(this);

      console.pretty = function() {
        test.strictEqual(arguments.length, 1);

        test.strictEqual(typeof arguments[0], 'boolean');
        test.strictEqual(arguments[0], true);
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.done();
      };

      cli.connectionCallbacks.createAdmin(error, true);

      console.pretty = pretty;
      cli.prompt = prompt;
    }
  },


  listAdmins: {
    errorAppeared: function(test) {
      var cli = this.cli,
          error = {
        error: 'someError'
      },
          prompt = cli.prompt,
          showError = cli.connectionCallbacks.showError;

      cli.connectionCallbacks.showError = function() {
        test.strictEqual(arguments.length, 1);

        test.strictEqual(typeof arguments[0], 'object');
        test.strictEqual(arguments[0], error);
        test.strictEqual(arguments[0].error, 'someError');
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.done();
      };

      cli.connectionCallbacks.listAdmins(error);

      cli.prompt = prompt;
      cli.connectionCallbacks.showError = showError;
    },
    noErrorAppeared: function(test) {
      var cli = this.cli,
          admins = {
        john: 'someHash',
        doe: 'anotherHash'
      },
          error = null,
          pretty = console.pretty,
          prompt = cli.prompt;

      console.pretty = function() {
        test.strictEqual(arguments.length, 1);

        test.strictEqual(typeof arguments[0], 'object');
        test.strictEqual(arguments[0] instanceof Array, true);
        test.strictEqual(arguments[0].length, 2);
      };

      cli.prompt = function() {
        test.strictEqual(arguments.length, 0);

        test.done();
      };

      cli.connectionCallbacks.listAdmins(error, admins);

      console.pretty = pretty;
      cli.prompt = prompt;
    }
  }
};
