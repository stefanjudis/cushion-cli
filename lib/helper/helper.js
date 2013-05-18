'use strict';
/*
 * cushion-cli
 * https://github.com/stefanjudis/cushion-cli
 *
 * Copyright (c) 2012 stefan judis
 * Licensed under the MIT license.
 */

var helper = module.exports = {};

/**
 * Helper function to create an object out of an array with parameters.
 * Return value will set to undefined if validation for couchdb
 * query parameters failes.
 *
 * @param  {Array}             paramsArray  Array with given parameters
 * @return {Object|undefined} paramsObject Object with given parameters
 *
 * @private
 * @tested
 */
helper._createParamsObject = function(paramsArray) {
  var paramsObject = {};

  paramsArray.forEach(function(value) {
    // check for valid input
    if (value.match(/^.*[=].*$/) !== null) {
      value = value.split('=');

      // set object and avoid "invalid UTF-8 JSON" errors
      paramsObject[value[0]] = value[1].replace(/'/g, '"');
    } else {
      return undefined;
    }
  });

  return paramsObject;
};


/**
 * Get all possible commands stored in an Array.
 * This Array will include level specific commands
 * and a lot of general commands like 'help' or 'exit'.
 *
 * @param  {Object} object Command object with existing commands
 * @return {Array}         Array of commands from object and general commands
 *
 * @private
 * @tested
 */
helper._getAllCommands = function(object) {
  return Object.keys(object).filter(
    function (command) {
        return (
          command[0] === '_' &&
          command[1] !== '_' &&
          command !== '_simpleCommand'
        );
      }
  ).map(
    function (command) {
        return command.replace(/_/g, '');
    }
  ).sort();
};
