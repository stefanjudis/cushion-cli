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

exports.commands = {
  'simpleCommand': function(test) {
    var _log = console.log;

    console.log = function(chunk) {
      test.expect(1);
      test.equal(chunk, 'error', 'Error should be displayed');
      test.done();
    };

    connectionCallbacks.simpleCallback('error', '');
    console.log = _log;
  }
};
