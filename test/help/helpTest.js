'use strict';

module.exports = {
  setUp: function(callback) {
    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.help = require('../../lib/help/help');
    this.messages = require('../../lib/help/messages');

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  getHelp: {
    oneArgument: function(test) {
      var cli = {},
          help = this.help,
          input = ['help'],
          levelObject = {},
          _generalHelp = help._generalHelp;

      this.help._generalHelp = function(object, inputCli) {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(object, levelObject);
        test.strictEqual(inputCli, cli);

        test.done();
      };

      help.getHelp(levelObject, input, cli);

      this.help._generalHelp = _generalHelp
    },
    twoArguments: function(test) {
      var cli = {},
          help = this.help,
          input = ['help', 'secondParameter'],
          levelObject = {},
          _specificHelp = help._specificHelp;

      this.help._specificHelp = function(args, inputCli) {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(args.length, 1);
        test.strictEqual(args[0], 'secondParameter');
        test.strictEqual(inputCli, cli);

        test.done();
      };

      help.getHelp(levelObject, input, cli);

      this.help._specificHelp = _specificHelp;
    }
  },


  generalHelp: function(test) {
    var cli = {},
        help = this.help,
        messages = this.messages,
        object = {
      _test: '_test',
      __test : '__test',
      _simpleCommand: '_simpleCommand'
    };

    console.log = function(message) {
      test.strictEqual(typeof message, 'string');
      test.strictEqual(arguments.length, 1);
      test.strictEqual(message, messages.general);
    }

    console.pretty = function(commands) {
      test.strictEqual(typeof commands, 'object');
      test.strictEqual(commands instanceof Array, true);
      test.strictEqual(commands.length, 1);
      test.strictEqual(commands[0], 'test');
    };

    cli.prompt = function() {
      test.done();
    }

    help._generalHelp(object, cli);
  },


  specificHelp: {
    knownCommand: function(test) {
      var cli = {},
          help = this.help,
          input = ['config'],
          messages = this.messages;

      console.log = function(message) {
        test.strictEqual(typeof message, 'string');
        test.strictEqual(arguments.length, 1);
        test.strictEqual(message, messages.config)
      }

      cli.prompt = function() {
        test.done();
      }

      help._specificHelp(input, cli);
    },
    unknownCommand: function(test) {
      var cli = {},
          help = this.help,
          input = ['someCommand'];

      console.log = function(message) {
        test.strictEqual(typeof message, 'string');
        test.strictEqual(arguments.length, 1);
      }

      cli.prompt = function() {
        test.done();
      }

      help._specificHelp(input, cli);
    }
  }
};
