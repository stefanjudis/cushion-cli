'use strict';

module.exports = {
  setUp: function(callback) {
    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../../lib/cliRunner');

    this.cli.user = {};
    this.cli.user.name = 'foo';

    this.prompt = require('../../lib/prompt/prompt');

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
          input = ['addRole', 'role'],
          addRole = cli.user.addRole;

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

      cli.user.addRole = addRole;
    }
  },


  create: {
    oneArgument: function(test) {
      var cli = this.cli,
          input = ['create'],
          promptGetUserPassword = this.prompt._promptGetUserPassword;

      cli.user.name = 'john';
      cli.user.create = function() {};

      this.prompt._promptGetUserPassword = function() {
        test.strictEqual(arguments.length, 3);

        test.strictEqual(typeof arguments[0], 'string');
        test.strictEqual(arguments[0], 'john');

        test.strictEqual(typeof arguments[1], 'function');
        test.strictEqual(arguments[1], cli.userCallbacks.create);

        test.strictEqual(typeof arguments[2], 'function');
        test.strictEqual(arguments[2], cli.user.create);

        test.done();
      };

      cli.userCommands._create(input, cli);

      this.prompt._promptGetUserPassword = promptGetUserPassword;

    },
    twoArguments: function(test) {
      var cli = this.cli,
          input = ['create', 'xxxx'],
          create = cli.user.create;

      cli.user.name = 'john';

      cli.user.create = function() {
        test.strictEqual(arguments.length, 3);

        test.strictEqual(typeof arguments[0], 'string');
        test.strictEqual(arguments[0], 'john');

        test.strictEqual(typeof arguments[1], 'string');
        test.strictEqual(arguments[1], 'xxxx');

        test.strictEqual(typeof arguments[2], 'function');
        test.strictEqual(arguments[2], cli.userCallbacks.create);

        test.done();
      };

      cli.userCommands._create(input, cli);

      cli.user.create = create;
    }
  },


  delete: function(test) {
    var cli = this.cli,
        input = ['delete'],
        deleteFunction = cli.user.delete;

    cli.user.name = 'john';

    cli.user.delete = function(name, callback) {
      test.strictEqual(arguments.length, 2);

      test.strictEqual(typeof name, 'string');
      test.strictEqual(name, 'john');

      test.strictEqual(typeof callback, 'function');
      test.strictEqual(callback, cli.userCallbacks.delete);

      test.done();
    };

    cli.userCommands._delete(input, cli);

    cli.user.delete = deleteFunction;
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
