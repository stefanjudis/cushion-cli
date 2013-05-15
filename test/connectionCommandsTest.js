module.exports = {
  setUp: function(callback) {
    var Cushion = require('cushion'),
        config = require('./config');

    // block console.log for cushion output
    this._console = console.log;
    console.log = function(){};

    this.cli = require('../lib/cliRunner');
    this.cli.level = 'connection';
    this.cli.name = config.host;
    this.cli.cushion = new Cushion.Connection(
      config.host, config.port, config.name, config.password
    );

    this.cPrompt = require('../lib/prompt/prompt');

    callback();
  },


  tearDown: function(callback) {
    //console.log = this._console;

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
    },
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
  }
};
