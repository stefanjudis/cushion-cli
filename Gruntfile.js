module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodeunit: {
      all: ['test/**/*Test.js']
    },
    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          nocase: true
        }
      },
      src: {
        files: ['lib/**/*.js', 'test/**/*.js', 'Gruntfile.js'],
        tasks: ['default']
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default
  grunt.registerTask('default', ['jshint', 'nodeunit']);
  grunt.registerTask('travis', ['jshint', 'nodeunit']);

  // Testing
  grunt.registerTask('test', ['nodeunit']);
};
