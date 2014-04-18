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
 */
var http = require('http');
var util = require('util');
var events = require('events');
var FeedParser = require('feedparser');

/**
 * The Feed abstraction.
 *
 * Possible feed events:
 *
 *     new: New item fetched.
 *
 * Possible option configurations:
 * 
 *     uri: The feed uri, e.g. http://feeds.feedburner.com/npmawesome?format=xml
 *     interval: The poll interval in ms, e.g. 300000
 * 
 */
function Feed (options) {
    options = options || {};

    this.$$uri = options.uri;
    this.$$interval = options.interval || ((60 * 1000) * 5);

    //
    // The cache is an "emit history".
    // It keeps track of the already
    // emitted items (contains the guid of the feed items).
    //
    this.$$emitted = [];

    this.$$watcher = null;

    events.EventEmitter.call(this);
}

util.inherits(Feed, events.EventEmitter);

/**
 * Pulls the available items from the feed.
 *
 * @param {function} cb
 *
 */
Feed.prototype.$$pull = function $$pull (cb) {
    var self = this;
    var feedparser = new FeedParser();
    var items = [];

    var callback = function wrap (err) {
        return (cb || function () {})(err, items);
    };

    function onParsed () {
        /*jshint validthis:true */
        var stream = this;
        var item;

        while (null !== (item = stream.read())) {
            items.unshift(item);
        }
    }

    function onResponse (res) {
        if (200 !== res.statusCode) {
            return callback(new Error('Wrong HTTP response status'));
        }

        res.pipe(feedparser);
    }

    http.get(this.$$uri, onResponse).on('error', callback);

    feedparser.on('error', callback);
    feedparser.on('readable', onParsed);
    feedparser.once('end', callback);
};

/**
 * Observes the defined feed for changes and emits 'new' event.
 * The method will also pull the items in the first execution in order
 * to fetch the items which are already in the feed.
 *
 * @return {Feed} The feed instance itself.
 *
 */
Feed.prototype.watch = function watch () {
    var self = this;

    function onPoll (err, items) {
        if (err) {
            return self.emit('error', err);
        }

        items
            //
            // Filter for new items.
            //
            .filter(function onFilter (item) {
                return !(~self.$$emitted.indexOf(item.guid));
            })
            //
            // Emit the new item and push the id to the "emit history".
            //
            .forEach(function onItem (item) {
                self.$$emitted.push(item.guid);
                self.emit('new', item);
            });
    }

    function poll () {
        self.$$pull(onPoll);
    }

    if (this.$$watcher) {
        this.unwatch();
    }

    this.$$watcher = setInterval(poll, this.$$interval);

    poll();

    return this;
};

/**
 * Kills the watcher.
 *
 */
Feed.prototype.unwatch = function unwatch () {
    clearInterval(this.$$watcher);

    this.$$watcher = null;
};

/**
 * Creates a feed instance.
 *
 * @param  {object} options The configuration object (see above).
 *
 * @return {Feed}
 *
 */
exports.create = function create (options) {
    return new Feed(options);
};