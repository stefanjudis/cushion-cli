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
var connectionCallbacks = require('../lib/connectionCallbacks'),
    exports = module.exports;

exports.commands = {
  'simpleCallbackError': function(test) {
    var _log = console.log;

    console.log = function(chunk) {
      test.expect(1);
      test.equal(chunk, 'error', 'Error should be displayed');
      test.done();
    };

    connectionCallbacks.simpleCallback('error', '');
    console.log = _log;
  },
  'simpleCallbackResponse': function(test) {
    var _log = console.log;

    console.log = function(chunk) {
      test.expect(1);
      test.equal(chunk, 'response', 'Response should be displayed');
      test.done();
    };

    connectionCallbacks.simpleCallback('', 'response');
    console.log = _log;
  },
  'listDatabasesResponse': function(test) {
    var _log = console.log,
        databases = [
          { _name: 'db1',
            _connection:
              { _methodMatch: /^GET|PUT|POST|DELETE|HEAD|COPY$/i,
                _options: [Object]
              }
          },
          { _name: 'db2',
            _connection:
              { _methodMatch: /^GET|PUT|POST|DELETE|HEAD|COPY$/i,
                _options: [Object]
              }
          },
          { _name: 'db3',
            _connection:
              { _methodMatch: /^GET|PUT|POST|DELETE|HEAD|COPY$/i,
                _options: [Object]
              }
          }
        ];

    console.log = function(chunk) {
      test.expect(1);
      test.equal(
        chunk,
        "db1\ndb2\ndb3",
        'Names of databases should be displayed'
      );

      test.done();
    };

    connectionCallbacks.listDatabases('', databases);
    console.log = _log;
  }
};
