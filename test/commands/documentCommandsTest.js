'use strict';

module.exports = {
  setUp: function(callback) {
    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../../lib/cliRunner');
    this.cli.level = 'document';
    this.cli.doc = {};

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  content: {
    bodyResponseIsObject: {
      withoutKeys: function(test) {
        var cli = this.cli,
            input = ['content', 'foo'],

            body = cli.doc.body;

        cli.doc.body = function() {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof arguments[0], 'string');
          test.strictEqual(arguments[0], 'foo');

          return {};
        }

        console.log = function(message) {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof message, 'string')
        };

        cli.prompt = function() {
          test.done();
        };

        cli.documentCommands._content(input, cli);

        cli.doc.body = body;
      },
      withKeys: function(test) {
        var cli = this.cli,
            input = ['content', 'foo'],

            body = cli.doc.body,
            content = cli.documentCallbacks.content;

        cli.doc.body = function() {
          test.strictEqual(arguments.length, 1);
          test.strictEqual(typeof arguments[0], 'string');
          test.strictEqual(arguments[0], 'foo');

          return {
            foo: 'bar'
          };
        }

        cli.documentCallbacks.content = function() {
          test.strictEqual(arguments.length, 2);

          test.strictEqual(arguments[0], false);

          test.strictEqual(typeof arguments[1], 'object');
          test.strictEqual(Object.keys(arguments[1]).length, 1);
          test.strictEqual(arguments[1].foo, 'bar')

          test.done();
        };

        cli.documentCommands._content(input, cli);

        cli.doc.body = body;
        cli.documentCallbacks.content = content;
      }
    }
  },


  simpleCommand: function(test) {
    var cli = this.cli,
        input = ['content'],
        content = cli.doc.content;

    cli.doc.content = function() {
      test.strictEqual(arguments.length, 1);
      test.strictEqual(typeof arguments[0], 'function');
      test.strictEqual(arguments[0], cli.documentCallbacks.content);

      test.done();
    };

    cli.documentCommands._simpleCommand(input, cli);

    cli.doc.content = content;
  }
};
