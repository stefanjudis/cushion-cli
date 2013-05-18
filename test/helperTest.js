'use strict';

module.exports = {
  setUp: function(callback) {
    this.helper = require('../lib/helper/helper');

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
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
