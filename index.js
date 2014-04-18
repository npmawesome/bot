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

var pkg = require('./package.json');
var Feed = require('./lib/').Feed;
var Twitter = require('./lib/').Twitter;

/**
 * The #npmawesome Twitter bot :)
 *
 * Options: See path.join(__dirname, 'etc', 'template')
 * for configuration options.
 *
 */
function Bot (options) {
    this.name = pkg.name;
    this.version = pkg.version;

    this.$$feed = Feed.create(options.feed);

    this.$$twitter = Twitter.create(options.twitter);
}

/**
 * Observes the #npmawesome feed for new items.
 *
 * @return {Feed (EventEmitter)}
 *
 */
Bot.prototype.watch = function watch () {
    return this.$$feed.watch();
};

/**
 * Sends a pick to the Twitter API.
 *
 * @param  {object} pick The "objectified" entry from the XML feed.
 * @param  {Function} callback
 *
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

    // guid = uri; see the XML source for further information.
    return this.$$twitter.tweet(pick.title + ' - ' + pick.guid , callback);
};

/**
 * Creates an instance of the Bot object.
 *
 * @param  {object} options
 * @return {Bot}
 *
 */
exports.create = function create (options) {
    return new Bot(options);
};