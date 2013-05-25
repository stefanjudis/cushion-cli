'use strict';

module.exports = {
  setUp: function(callback) {
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
  }
};
