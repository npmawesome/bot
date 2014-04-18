#!/usr/bin/env node

/*
 * npmawesome-twitter-bot
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

// Usage:
//
// npmawesome-twitter-bot --dry-run --all

// --dry-run
//     does not send tweets to twitter.

// --quiet
//     No output on stdout

/**
 * Module dependencies
 *
 */
var argv = require('yargs').argv;

var Bot = require('../');
var utilities = require('./utilities');
var rc = require('./rc');

var bot;

function onTweet (err, tweet) {
    if (err) {
        return utilities.printError(err.message);
    }
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