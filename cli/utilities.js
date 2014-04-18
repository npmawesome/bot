/*
 * npmawesome-bot
 *
 * Copyright(c) 2014 André König <andre.koenig@posteo.de>
 * MIT Licensed
 *
 */

/**
 * @author André König <andre.koenig@posteo.de>
 *
 */

'use strict';

var termcolors = {
    gray : function gray (value) {
        return '\x1b[90m' + value + '\x1b[39m';
    },
    green : function green (value) {
        return '\x1b[32m' + value + '\x1b[39m';
    },
    red : function red (value) {
        return '\x1b[31m' + value + '\x1b[39m';
    }
};

/**
 * Prints, well, an error.
 * 
 * @param  {object} err The error object.
 *
 */
exports.printError = function printError (err) {
    return console.error(termcolors.red(err));
};

/**
 * Print a pick.
 *
 * @param  {object} pick A #npmawesome pick.
 *
 */
exports.printPick = function printPick (pick) {
    return console.log('%s - %s: %s', termcolors.gray(pick.pubdate), termcolors.green(pick.title), termcolors.gray(pick.guid));
};