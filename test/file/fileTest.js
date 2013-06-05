'use strict';

module.exports = {
  setUp: function(callback) {
    this.cFile = require('../../lib/file/file');
    this.fs = require('fs');

    callback();
  },


  tearDown: function(callback) {
    callback();
  },


  writeConnections: function(test) {
    var callbackFunction = function() {},
        connections = {
      connection1: 'someData'
    },
        writeFile = this.fs.writeFile;

    this.fs.writeFile = function() {
      test.strictEqual(arguments.length, 3);

      test.strictEqual(typeof arguments[0], 'string');

      test.strictEqual(typeof arguments[1], 'string');
      test.strictEqual(arguments[1], '{"connection1":"someData"}');

      test.strictEqual(typeof arguments[2], 'function');
      test.strictEqual(arguments[2].toString(), 'function () {}');

      test.done();
    }

    this.cFile._writeConnections(connections, callbackFunction);

    this.fs.writeFile = writeFile;
  }
};
