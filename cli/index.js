#!/usr/bin/env node

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

/**
 * Module dependencies
 *
 */
var yargs = require('yargs');
var pkg = require('../package.json');

var Bot = require('../');
var utilities = require('./utilities');
var rc = require('./rc');

var argv = yargs
    .usage('A Twitter bot and realtime consumer for #npmawesome.\n')
    .example('npmawesome-bot --watch', '"Realtime" #npmawesome updates.')
    .alias('q', 'quiet')
    .alias('d', 'dry-run')
    .alias('w', 'watch')
    .alias('v', 'version')
    .describe('watch', 'You will see new #npmawesome posts as they arrive!')
    .describe('quiet', 'No stdout output.')
    .describe('dry-run', 'No fear, no Twitter interaction in this mode. :)')
    .describe('version', 'Version information')
    .argv;

var bot;

function onTweet (err, tweet) {
    if (err) {
        return utilities.printError(err.message);
    }
}

if (argv.version) {
    console.log(pkg.version);

    return process.exit(0);
}

if (!argv.watch) {
    yargs.showHelp();

    return process.exit(1);
}

// 1. Step: Let's check if the configuration file is available.
if (!rc.exists()) {

    utilities.printError('The bot is not configured. Check: ' + rc.path);

    rc.touch();
} else {

    try {
        bot = Bot.create(rc.consume());
    } catch (e) {
        utilities.printError('Malformed configuration file. Check: ' + rc.path);

        return process.exit(1);
    }

    bot.watch()
        .on('new', function onAwesome (pick) {
            if (!argv.quiet) {
                utilities.printPick(pick);
            }

            if (!argv.dryRun) {
                bot.tweet(pick, onTweet);
            }
        })
        .on('error', utilities.printError);
}