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


  defaultExists: function(test) {
    var callbackFunction = function() {},
        exists = this.fs.exists;

    this.fs.exists = function() {
      test.strictEqual(arguments.length, 2);

      test.strictEqual(typeof arguments[0], 'string');

      test.strictEqual(typeof arguments[1], 'function');
      test.strictEqual(arguments[1], callbackFunction);

      test.done();
    };

    this.cFile.defaultExists(callbackFunction);

    this.fs.exists = exists;
  },


  getConnections: function(test) {
    var callbackFunction = function() {},
        readFile = this.fs.readFile;

    this.fs.readFile = function() {
      test.strictEqual(arguments.length, 2);

      test.strictEqual(typeof arguments[0], 'string');

      test.strictEqual(typeof arguments[1], 'function');
      test.strictEqual(arguments[1], callbackFunction);

      test.done();
    };

    this.cFile.getConnections(callbackFunction);

    this.fs.readFile = readFile;
  },


  readPackageJSON: function(test) {
    var callbackFunction = function() {},
        readFile = this.fs.readFile;

    this.fs.readFile = function() {
      test.strictEqual(arguments.length, 2);

      test.strictEqual(typeof arguments[0], 'string');

      test.strictEqual(typeof arguments[1], 'function');
      test.strictEqual(arguments[1], callbackFunction);

      test.done();
    }

    this.cFile.readPackageJSON(callbackFunction);

    this.fs.readFile = readFile;
  },

  writeConnections: function(test) {
    var connections = {
      connection1: 'someData'
    },
        callback = function() {},
        exists = this.fs.exists;

    this.fs.exists = function() {
      test.strictEqual(arguments.length, 2);

      test.strictEqual(typeof arguments[0], 'string');

      test.strictEqual(typeof arguments[1], 'function');
      test.strictEqual(
        arguments[1], this.cFile._writeConnectionsExistsCallback
      );

      test.strictEqual(typeof this.cFile.connections, 'object');
      test.strictEqual(this.cFile.connections, connections);

      test.strictEqual(typeof this.cFile.writeConnectionsCallback, 'function');
      test.strictEqual(this.cFile.writeConnectionsCallback, callback);

      test.done();
    }.bind(this);

    this.cFile._writeConnections(connections, callback);

    this.fs.exists = exists;
  },


  writeConnectionsExistsCallback: {
    doesExist: function(test) {
      var writeFile = this.fs.writeFile;

      this.cFile.connections = {
        connection1: 'someConnection'
      };

      this.fs.writeFile = function() {
        test.strictEqual(arguments.length, 3);

        test.strictEqual(typeof arguments[0], 'string');

        test.strictEqual(typeof arguments[1], 'string');
        test.strictEqual(arguments[1], '{"connection1":"someConnection"}');

        test.strictEqual(typeof arguments[2], 'function');
        test.strictEqual(arguments[2], this.cFile.writeConnectionsCallback);

        test.done();
      }.bind(this);

      this.cFile._writeConnectionsExistsCallback(true);

      this.fs.writeFile = writeFile;
    },
    doesNotExist: function(test) {
      var mkdir = this.fs.mkdir;

      this.fs.mkdir = function() {
        test.strictEqual(arguments.length, 3);

        test.strictEqual(typeof arguments[0], 'string');

        test.strictEqual(typeof arguments[1], 'string');
        test.strictEqual(arguments[1], '0755');

        test.strictEqual(typeof arguments[2], 'function');

        test.done();
      };

      this.cFile._writeConnectionsExistsCallback(false);
      this.fs.mkdir = mkdir;
    }
  }
};
