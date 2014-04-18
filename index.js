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

var pkg = require('./package.json');
var Core = require('./lib/');
var Feed = Core.Feed;
var Twitter = Core.Twitter;

function Bot (options) {
    this.name = pkg.name;
    this.version = pkg.version;

    this.$$feed = Feed.create(options.feed);

    this.$$twitter = Twitter.create(options.twitter);
}

/**
 * DOCME
 *
 * @return {[type]} [description]
 *
 */
Bot.prototype.watch = function watch () {
    return this.$$feed.watch();
};

/**
 * DOCME
 *
 * @param  {[type]}   pick     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 *
 */
Bot.prototype.tweet = function tweet (pick, callback) {
    if ('function' === typeof pick) {
        callback = pick;
        pick = null;
    }

    if (!pick) {
        return process.nextTick(function onTick () {
            return callback(new Error('Please define a pick which should be send to twitter'));
        });
    }

    return this.$$twitter.post(pick.title + ' - ' + pick.guid , callback);
};

/**
 * DOCME
 *
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 *
 */
exports.create = function create (options) {
    return new Bot(options);
};