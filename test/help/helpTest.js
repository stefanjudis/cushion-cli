'use strict';

module.exports = {
  setUp: function(callback) {
    this.help = require('../../lib/help/help');

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
          levelObject = {};

      this.help._generalHelp = function(object, inputCli) {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(object, levelObject);
        test.strictEqual(inputCli, cli);

        test.done();
      };

      help.getHelp(levelObject, input, cli);
    },
    twoArguments: function(test) {
      var cli = {},
          help = this.help,
          input = ['help', 'secondParameter'],
          levelObject = {};

      this.help._specificHelp = function(args, inputCli) {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(args.length, 1);
        test.strictEqual(args[0], 'secondParameter');
        test.strictEqual(inputCli, cli);

        test.done();
      };

      help.getHelp(levelObject, input, cli);
    }
  }
};
