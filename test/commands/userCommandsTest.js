'use strict';

module.exports = {
  setUp: function(callback) {
    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../../lib/cliRunner');

    this.cli.user = {};
    this.cli.user.name = 'foo';

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  addRole: {
    oneArguments: function(test) {
      var cli = this.cli,
          input = ['addRole']

      console.log = function(message) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof message, 'string');
        test.done();
      };

      cli.userCommands._addRole(input, cli);
    },
    twoArguments: function(test) {
      var cli = this.cli,
          input = ['addRole', 'role']

      cli.user.addRole = function(name, args, callback) {
        test.strictEqual(name, 'foo');

        test.strictEqual(typeof args, 'object');
        test.strictEqual(args instanceof Array, true);
        test.strictEqual(args[0], 'role');

        test.strictEqual(typeof callback, 'function');
        test.strictEqual(callback, cli.userCallbacks.addRole);

        test.done();
      }

      cli.userCommands._addRole(input, cli);
    }
  },


  simpleCommand: function(test) {
    var cli = this.cli,
        input = ['getRoles'],
        getRoles = cli.user.getRoles;

    cli.user.name = 'john';

    cli.user.getRoles = function() {
      test.strictEqual(arguments.length, 2);

      test.strictEqual(typeof arguments[0], 'string');
      test.strictEqual(arguments[0], 'john');

      test.strictEqual(typeof arguments[1], 'function');
      test.strictEqual(arguments[1], cli.userCallbacks.getRoles);

      test.done();
    };

    cli.userCommands._simpleCommand(input, cli);

    cli.user.getRoles = getRoles;
  }
};
