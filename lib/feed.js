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

/**
 * Dependencies
 *
 *
 */
var http = require('http');
var util = require('util');
var events = require('events');
var FeedParser = require('feedparser');

/**
 * DOCME
 *
 * Possible feed events:
 *
 *     new: New item in the feed
 *
 * @param {[type]} uri      [description]
 * @param {[type]} interval [description]
 *
 */
function Feed (options) {
    this.$$uri = options.uri;

    this.$$cache = [];

    this.$$watcher = null;

    events.EventEmitter.call(this);
}

util.inherits(Feed, events.EventEmitter);

/**
 * Polls the given feed and emits a 'item'
 * event on every new item.
 *
 */
Feed.prototype.$$check = function $$check () {
    var self = this;
    var feedparser = new FeedParser();

    function onError (err) {
        return self.emit('error', new Error('Fetching feed failed: ' + err.toString()));
    }

    function onParsed () {
        var stream = this;
        var item;

        while (item = stream.read()) {
            if (!self.$$cache[item.guid]) {
                self.$$cache[item.guid] = item;

                self.emit('new', item);
            }
        }
    }

    function onResponse (res) {
        if (200 !== res.statusCode) {
            return onError(new Error('Wrong HTTP response status'));
        }

        res.pipe(feedparser)
    }

    http.get(this.$$uri, onResponse)
        .on('error', onError);

    feedparser.on('error', onError);
    feedparser.on('readable', onParsed);
};

/**
 * Observes the defined feed for changes.
 *
 * @return {Feed} The feed instance itself.
 *
 */
Feed.prototype.watch = function watch (interval) {
    interval = interval || ((60 * 1000) * 5);

    if (this.$$watcher) {
        this.unwatch();
    }

    setInterval(this.$$check.bind(this), interval);

    return this;
};

/**
 * DOCME
 * 
 * @return {[type]} [description]
 */
Feed.prototype.unwatch = function unwatch () {
    clearInterval(this.$$watcher);

    this.$$watcher = null;
};

/**
 * Creates a feed instance.
 *
 * @param  {object} options
 *
 * @return {Feed}
 *
 */
exports.create = function create (options) {
    options = options || {};

    return new Feed(options);
};