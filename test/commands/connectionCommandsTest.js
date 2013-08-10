'use strict';

module.exports = {
  setUp: function(callback) {
    var config = require('../config');

    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../../lib/cliRunner');
    this.cli.level = 'connection';
    this.cli.name = config.host;

    this.cli._setCushion(
      config.name,
      config.password,
      config.host,
      config.port
    );

    this.cPrompt = require('../../lib/prompt/prompt');
    this.cFile = require('../../lib/file/file');

    callback();
  },


  tearDown: function(callback) {
    console.log = this._console;

    callback();
  },


  config: {
    oneArgument: function(test) {
      var cli = this.cli,
          input = ['config'];

      this.cli.cushion.config = function() {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof arguments[0], 'function');
        test.done();
      };

      cli.connectionCommands._config(input, cli);
    },
    twoArguments: function(test) {
      var cli = this.cli,
          input = ['config', 'section'];

      this.cli.cushion.config = function() {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(arguments[0], 'section');
        test.strictEqual(typeof arguments[1], 'function');
        test.done();
      };

      cli.connectionCommands._config(input, cli);
    },
    threeArguments: function(test) {
      var cli = this.cli,
          input = ['config', 'section', 'option'];

      this.cli.cushion.config = function() {
        test.strictEqual(arguments.length, 3);
        test.strictEqual(arguments[0], 'section');
        test.strictEqual(arguments[1], 'option');
        test.strictEqual(typeof arguments[2], 'function');
        test.done();
      };

      cli.connectionCommands._config(input, cli);
    },
    fourArguments: function(test) {
      var cli = this.cli,
          input = ['config', 'section', 'option', 'value'];

      this.cli.cushion.config = function() {
        test.strictEqual(arguments.length, 4);
        test.strictEqual(arguments[0], 'section');
        test.strictEqual(arguments[1], 'option');
        test.strictEqual(arguments[2], 'value');
        test.strictEqual(typeof arguments[3], 'function');
        test.done();
      };

      cli.connectionCommands._config(input, cli);
    },
    fiveArguments: function(test) {
      var cli = this.cli,
          input = ['config', 'section', 'option', 'value', 'invalidInput'];

      console.log = function() {
        test.strictEqual(arguments.length, 1);
        test.done();
      };

      cli.connectionCommands._config(input, cli);
    }
  },


  createAdmin: {
    oneArgument: function(test) {
      var cli = this.cli,
          input = ['createAdmin'];

      this.cPrompt._promptGetAdmin = function() {
        test.strictEqual(arguments.length, 2);
        test.done();
      };

      cli.connectionCommands._createAdmin(input, cli);
    },
    twoArguments: function(test) {
      var cli = this.cli,
          input = ['createAdmin', 'admin'];

      console.log = function() {
        test.strictEqual(arguments.length, 1);
        test.done();
      };

      cli.connectionCommands._createAdmin(input, cli);
    },
    threeArguments: function(test) {
      var cli = this.cli,
          input = ['createAdmin', 'admin', 'password'];

      this.cli.cushion.createAdmin = function() {
        test.strictEqual(arguments.length, 3);
        test.strictEqual(arguments[0], 'admin');
        test.strictEqual(arguments[1], 'password');
        test.strictEqual(typeof arguments[2], 'function');
        test.done();
      };

      cli.connectionCommands._createAdmin(input, cli);
    },
    fourArguments: function(test) {
      var cli = this.cli,
          input = ['createAdmin', 'admin', 'password', 'invalidInput'];

      console.log = function() {
        test.strictEqual(arguments.length, 1);
        test.done();
      };

      cli.connectionCommands._createAdmin(input, cli);
    }
  },


  deleteAdmin: {
    oneArgument: function(test) {
      var cli = this.cli,
          input = ['deleteAdmin'];

      this.cPrompt._promptDeleteAdmin = function(inputCli) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(inputCli, cli);
        test.done();
      };

      cli.connectionCommands._deleteAdmin(input, cli);
    },
    twoArguments: function(test) {
      var cli = this.cli,
          input = ['deleteAdmin', 'foo'];

      this.cli.cushion.deleteAdmin = function(name, callback) {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(name, 'foo');
        test.strictEqual(callback, cli.connectionCallbacks.deleteAdmin);
        test.done();
      };

      cli.connectionCommands._deleteAdmin(input, cli);
    },
    threeArguments: function(test) {
      var cli = this.cli,
          input = ['deleteAdmin', 'foo', 'redundantInput'];

      console.log = function() {
        test.strictEqual(arguments.length, 1);
        test.done();
      };

      cli.connectionCommands._deleteAdmin(input, cli);
    }
  },


  deleteConnection: {
    oneArgument: function(test) {
      var cli = this.cli,
          input = ['deleteConnection'],
          cPrompt = this.cPrompt;

      cPrompt._showConnections = function(callback) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof callback, 'function');
        test.strictEqual(callback instanceof Function, true);
        test.strictEqual(callback, cPrompt._setupDeleteSavedConnection);
        test.done();
      };

      cli.connectionCommands._deleteConnection(input, cli);
    },
    twoArguments: {
      inputIsName: {
        nameExists: function(test) {
          var cli = this.cli,
              input = ['deleteConnection', 'connection'],
              writeConnections = this.cFile._writeConnections;

          cli.connections = {};
          cli.connections.connection = 'foo';

          this.cFile._writeConnections = function(connections, callback) {
            test.strictEqual(typeof connections, 'object');
            test.strictEqual(connections instanceof Object, true);
            test.strictEqual(Object.keys(connections).length, 0);

            test.strictEqual(typeof callback, 'function');
            test.strictEqual(callback instanceof Function, true);

            test.done();
          };

          cli.connectionCommands._deleteConnection(input, cli);

          this.cFile._writeConnections = writeConnections;
        },
        nameDoesntExist: function(test) {
          var cli = this.cli,
              input = ['deleteConnection', 'noConnection'];

          cli.connections = {};
          cli.connections.connection = 'foo';

          console.log = function(message) {
            test.strictEqual(Object.keys(cli.connections).length, 1);

            test.strictEqual(arguments.length, 1);
            test.strictEqual(typeof message, 'string');
          };

          cli.prompt = function() {
            test.strictEqual(arguments.length, 0);

            test.done();
          };

          cli.connectionCommands._deleteConnection(input, cli);
        }
      },
      inputIsIndex: {
        indexExists: function(test) {
          var cli = this.cli,
              input = ['deleteConnection', '1'],
              writeConnections = this.cFile._writeConnections;

          cli.connections = {};
          cli.connections.connection = 'foo';

          this.cFile._writeConnections = function(connections, callback) {
            test.strictEqual(typeof connections, 'object');
            test.strictEqual(connections instanceof Object, true);
            test.strictEqual(Object.keys(connections).length, 0);

            test.strictEqual(typeof callback, 'function');
            test.strictEqual(callback instanceof Function, true);

            test.done();
          };

          cli.connectionCommands._deleteConnection(input, cli);

          this.cFile._writeConnections = writeConnections;
        },
        indexDoesntExist: function(test) {
          var cli = this.cli,
              input = ['deleteConnection', '2'];

          cli.connections = {};
          cli.connections.connection = 'foo';

          console.log = function(message) {
            test.strictEqual(Object.keys(cli.connections).length, 1);

            test.strictEqual(arguments.length, 1);
            test.strictEqual(typeof message, 'string');
          };

          cli.prompt = function() {
            test.strictEqual(arguments.length, 0);

            test.done();
          };

          cli.connectionCommands._deleteConnection(input, cli);
        }
      }
    }
  },


  _deleteConnection: function(test) {
    var cli = this.cli,
        input = ['connectionName1', '2', 'connectionName3'],
        deleteConnectionWithIndex = cli.connectionCommands.__deleteConnectionWithIndex,
        withIndexCount = 0,
        deleteConnectionWithName = cli.connectionCommands.__deleteConnectionWithName,
        withNameCount = 0,
        deleteConnectionWrite = cli.connectionCommands.__deleteConnectionWrite;

    cli.connectionCommands.__deleteConnectionWithIndex = function() {
      ++withIndexCount;
    };

    cli.connectionCommands.__deleteConnectionWithName = function() {
      ++withNameCount;
    };

    cli.connectionCommands.__deleteConnectionWrite = function() {
      test.strictEqual(withIndexCount, 1);
      test.strictEqual(withNameCount,2);
      test.strictEqual(arguments[0], 'connectionName1, 2, connectionName3');

      test.done();
    }

    cli.connectionCommands.__deleteConnection(input, cli);

    cli.connectionCommands.__deleteConnectionWithIndex = deleteConnectionWithIndex;
    cli.connectionCommands.__deleteConnectionWithName = deleteConnectionWithName;
    cli.connectionCommands.__deleteConnectionWrite = deleteConnectionWrite;
  },


  _deleteConnectionWithIndex: {
    connectionExists: function(test) {
      var cli = this.cli,
          deleteConnectionWithName = cli.connectionCommands.__deleteConnectionWithName;

      cli.connections = {
        connection1 : 'connection1'
      }

      cli.connectionCommands.__deleteConnectionWithName = function() {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(arguments[0], 'connection1');

        test.done();
      };

      cli.connectionCommands.__deleteConnectionWithIndex(1, 0, cli);

      cli.connectionCommands.__deleteConnectionWithName = deleteConnectionWithName;
    },
    connectionDoesntExist: function(test) {
      var cli = this.cli,
          log = console.log

      cli.connections = {
        connection1 : 'connection1'
      }

      console.log = function() {
        test.strictEqual(arguments.length, 1);

        test.done();
      };

      cli.connectionCommands.__deleteConnectionWithIndex(2, 0, cli);

      console.log = log;
    }
  },


  _deleteConnectionWithName: {
    connectionExists: function(test) {
      var cli = this.cli;

      cli.connections = {
        connection1 : 'connection1',
        connection2 : 'connection2'
      }

      cli.connectionCommands.__deleteConnectionWithName('connection1', cli);

      test.strictEqual(Object.keys(cli.connections).length, 1);
      test.strictEqual(cli.connections.connection1, undefined);
      test.strictEqual(cli.connections.connection2, 'connection2');

      test.done();
    },
    connectionDoesntExist: function(test) {
      var cli = this.cli,
          log = console.log;

      cli.connections = {
        connection1 : 'connection1',
        connection2 : 'connection2'
      }

      console.log = function() {
        test.strictEqual(Object.keys(cli.connections).length, 2);
        test.strictEqual(cli.connections.connection1, 'connection1');
        test.strictEqual(cli.connections.connection2, 'connection2');

        test.done();
      }

      cli.connectionCommands.__deleteConnectionWithName('connection3', cli);

      console.log = log;
    }
  },


  listAdmins: function(test) {
    var cli = this.cli,
        input = ['listAdmins'];

    cli.cushion.config = function(section, callback) {
      test.strictEqual(typeof section, 'string');
      test.strictEqual(section, 'admins');

      test.strictEqual(typeof callback, 'function');
      test.strictEqual(callback instanceof Function, true);
      test.strictEqual(callback, cli.connectionCallbacks.listAdmins);

      test.done();
    };

    cli.connectionCommands._listAdmins(input, cli);
  },


  log: {
    oneArguments: function(test) {
      var cli = this.cli,
          input = ['log'];

      cli.cushion.log = function(callback) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(callback, cli.connectionCallbacks.log);
        test.done();
      };

      cli.connectionCommands._log(input, cli);
    },
    twoArguments: function(test) {
      var cli = this.cli,
          input = ['log', 8];

      cli.cushion.log = function(bytes, callback) {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(bytes, 8);
        test.strictEqual(callback, cli.connectionCallbacks.log);
        test.done();
      };

      cli.connectionCommands._log(input, cli);
    },
    threeArguments: function(test) {
      var cli = this.cli,
          input = ['log', 12, 'redundantInput'];

      console.log = function() {
        test.strictEqual(arguments.length, 1);
        test.done();
      };

      cli.connectionCommands._log(input, cli);
    }
  },


  saveConnection: {
    oneArgument: function(test) {
      var cli = this.cli,
          input = ['saveConnection'];

      console.log = function() {
        test.strictEqual(arguments.length, 1);
      };

      cli.prompt = function() {
        test.done();
      };

      cli.connectionCommands._saveConnection(input, cli);
    },
    twoArguments: function(test) {
      var cli = this.cli,
          input = ['saveConnection', 'redundantInput'],
          writeConnections = this.cFile._writeConnections;

      this.cFile._writeConnections = function(connections, callback) {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(typeof connections, 'object');
        test.strictEqual(connections instanceof Object, true);
        test.strictEqual(typeof callback, 'function' );
        test.strictEqual(callback instanceof Function, true);
        test.done();
      };

      cli.connectionCommands._saveConnection(input, cli);

      this.cFile._writeConnections = writeConnections;
    }
  },


  showConnection: function(test) {
    var cli = this.cli,
        input = ['showConnection'];

    cli.prompt = function() {
      test.done();
    };

    cli.connectionCommands._showConnection(input, cli);
  },


  simpleCommand: function(test) {
    var cli = this.cli,
        input = ['activeTasks'],
        activeTasks = cli.cushion.activeTasks;

    cli.cushion.activeTasks = function() {
      test.strictEqual(arguments.length, 1);
      test.strictEqual(typeof arguments[0], 'function');
      test.strictEqual(arguments[0], cli.connectionCallbacks.activeTasks);

      test.done();
    };

    cli.connectionCommands._simpleCommand(input, cli);

    cli.cushion.activeTasks = activeTasks;
  },

  uuids: {
    oneArgument: function(test) {
      var cli = this.cli,
          input = ['uuids'];

      cli.cushion.uuids = function(callback) {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(callback, cli.connectionCallbacks.uuids);
        test.done();
      };

      cli.connectionCommands._uuids(input, cli);
    },
    twoArguments: function(test) {
      var cli = this.cli,
          input = ['uuids', 2];
      cli.cushion.uuids = function(nrOfUuids, callback) {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(nrOfUuids, 2);
        test.strictEqual(callback, cli.connectionCallbacks.uuids);
        test.done();
      };

      cli.connectionCommands._uuids(input, cli);
    },
    threeArguments: function(test) {
      var cli = this.cli,
          input = ['uuids', 2, 'redundantInput'];

      console.log = function() {
        test.strictEqual(arguments.length, 1);
        test.done();
      };

      cli.connectionCommands._uuids(input, cli);
    }
  }
};
