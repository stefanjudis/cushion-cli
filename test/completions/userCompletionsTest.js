'use strict';

module.exports = {
  setUp: function(callback) {
    this.cli = require('../../lib/cliRunner');
    this.completions = require('../../lib/completions/userCompletions');

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  deleteRole: function(test) {
    var cli = this.cli,
        callback = function(){};

    cli.user = {};

    cli.user.getRoles = function(name, callback) {
      test.strictEqual(arguments.length, 2);

      test.strictEqual(name, 'foo');

      test.strictEqual(typeof callback, 'function');

      test.done();
    };

    cli.user.name = 'foo';


    this.completions.deleteRole('', 'user', callback);
  }
};
