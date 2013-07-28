'use strict';

module.exports = {
  setUp: function(callback) {
    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.helper = require('../../lib/helper/helper');

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  createParamsObject: {
    validInput: function(test) {
      var array = ['limit=3', 'startkey=doc'],
          object = this.helper._createParamsObject(array);

      test.strictEqual(typeof object, 'object');
      test.strictEqual(Object.keys(object).length, 2);

      test.strictEqual(object.limit, '3');
      test.strictEqual(object.startkey, 'doc');

      test.done();
    },
    invalidInput: function(test) {
      var array = ['limit=3', 'startkey'],
          object = this.helper._createParamsObject(array);

      test.strictEqual(typeof object, 'undefined');

      test.done();
    }
  },


  getAllCommands: function(test) {
    var object = {
      _test: '_test',
      __test : '__test',
      _simpleCommand: '_simpleCommand'
    },
        result = this.helper._getAllCommands(object);

    test.strictEqual(result instanceof Array, true);
    test.strictEqual(typeof result, 'object');
    test.strictEqual(result.length, 1);

    // underscore will be replaced
    test.strictEqual(result[0], 'test');

    test.done();
  },


  parseProcessArguments: {
    noAdditionalArguments: function(test) {
      var args = ['node', 'cushion'],
          result = this.helper.parseProcessArguments(args);

      test.strictEqual(typeof result, 'object');
      test.strictEqual(Object.keys(result).length, 0);

      test.strictEqual(args.length, 2);
      test.strictEqual(args[0], 'node');
      test.strictEqual(args[1], 'cushion');

      test.done();
    },
    onlyKeysIncluded: function(test) {
      var args = ['node', 'cushion', '-v'],
          result = this.helper.parseProcessArguments(args);

      test.strictEqual(typeof result, 'object');
      test.strictEqual(Object.keys(result).length, 1);

      test.strictEqual(result.v, true);

      test.strictEqual(args.length, 3);
      test.strictEqual(args[0], 'node');
      test.strictEqual(args[1], 'cushion');
      test.strictEqual(args[2], '-v');

      test.done();
    },
    onlyKeysAndValuesIncluded: function(test) {
      var args = ['node', 'cushion', '-h', '127.0.0.1'],
          result = this.helper.parseProcessArguments(args);

      test.strictEqual(typeof result, 'object');
      test.strictEqual(Object.keys(result).length, 1);

      test.strictEqual(result.h, '127.0.0.1');

      test.strictEqual(args.length, 4);
      test.strictEqual(args[0], 'node');
      test.strictEqual(args[1], 'cushion');
      test.strictEqual(args[2], '-h');
      test.strictEqual(args[3], '127.0.0.1');

      test.done();
    },
    keysAndValuesAndKeysIncluded: function(test) {
      var args = ['node', 'cushion', '-h', '127.0.0.1', '-v'],
          result = this.helper.parseProcessArguments(args);

      test.strictEqual(typeof result, 'object');
      test.strictEqual(Object.keys(result).length, 2);

      test.strictEqual(result.h, '127.0.0.1');
      test.strictEqual(result.v, true);

      test.strictEqual(args.length, 5);
      test.strictEqual(args[0], 'node');
      test.strictEqual(args[1], 'cushion');
      test.strictEqual(args[2], '-h');
      test.strictEqual(args[3], '127.0.0.1');
      test.strictEqual(args[4], '-v');

      test.done();
    }
  }
};
