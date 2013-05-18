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
  }
};
