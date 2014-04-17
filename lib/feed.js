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
var util = require('util');
var events = require('events');

/**
 * DOCME
 *
 * Possible feed events:
 *
 *     item: New item in the feed
 *
 * @param {[type]} uri      [description]
 * @param {[type]} interval [description]
 *
 */
function Feed (uri, interval) {
    this.$$uri = uri;

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
    // TODO: Fetch feed
    this.emit('new', 'new npm awesome item');
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