/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var connectionCommands = require('../lib/connectionCommands'),
    exports = module.exports,
    cushion = require('cushion');

exports.commands = {
  'commandExists': function(test) {
      test.expect(5);
      test.equal(
        connectionCommands.commandExists('version'),
        true,
        'Function "version" should exist'
      );

      test.equal(
        connectionCommands.commandExists('createAdmin'),
        true,
        'Function "createAdmin" should exist'
      );

      test.equal(
        connectionCommands.commandExists('deleteAdmin'),
        true,
        'Function "deleteAdmin" should exist'
      );

      test.equal(
        connectionCommands.commandExists('activeTasks'),
        true,
        'Function "activeTasks" should exist'
      );

      test.equal(
        connectionCommands.commandExists('abcdef'),
        false,
        'Function "deleteAdmin" should exist'
      );

      test.done();
  },
  'command': function(test) {
    var cli = {};
        cli.cushion = {
          'testCommand': function() {
            test.done();
          }
        };

    connectionCommands.command('testCommand', cli);
  }
};
