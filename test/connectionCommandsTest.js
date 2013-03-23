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

    // only include these guys for testing
    this.cli.generalCommands = require('../lib/commands/generalCommands');

    this.input = ['does', 'not', 'matter', 'here'];

    callback();
  },


  tearDown: function(callback) {
    //console.log = this._console;

    callback();
  },


  config: {
    oneArgument: function(test) {
      this.input = ['config'];

      this.cli.cushion.config = function() {
        test.strictEqual(arguments.length, 1);
        test.strictEqual(typeof arguments[0], 'function');
        test.done();
      };

      this.cli.connectionCommands._config(this.input, this.cli);
    },
    twoArguments: function(test) {
      this.input = ['config', 'section'];

      this.cli.cushion.config = function() {
        test.strictEqual(arguments.length, 2);
        test.strictEqual(arguments[0], 'section');
        test.strictEqual(typeof arguments[1], 'function');
        test.done();
      };

      this.cli.connectionCommands._config(this.input, this.cli);
    },
    threeArguments: function(test) {
      this.input = ['config', 'section', 'option'];

      this.cli.cushion.config = function() {
        test.strictEqual(arguments.length, 3);
        test.strictEqual(arguments[0], 'section');
        test.strictEqual(arguments[1], 'option');
        test.strictEqual(typeof arguments[2], 'function');
        test.done();
      };

      this.cli.connectionCommands._config(this.input, this.cli);
    },
    fourArguments: function(test) {
      this.input = ['config', 'section', 'option', 'value'];

      this.cli.cushion.config = function() {
        test.strictEqual(arguments.length, 4);
        test.strictEqual(arguments[0], 'section');
        test.strictEqual(arguments[1], 'option');
        test.strictEqual(arguments[2], 'value');
        test.strictEqual(typeof arguments[3], 'function');
        test.done();
      };

      this.cli.connectionCommands._config(this.input, this.cli);
    },
    fiveArguments: function(test) {
      this.input = ['config', 'section', 'option', 'value', 'invalidInput'];

      console.log = function() {
        test.done();
      };

      this.cli.connectionCommands._config(this.input, this.cli);
    },
  }
};
