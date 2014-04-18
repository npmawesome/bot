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
var Feed = require('./lib/').Feed;

function Bot (options) {
    this.name = pkg.name;
    this.version = pkg.version;

    this.$$feed = Feed.create(options.feed);

    this.$$twitter = null;
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
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 *
 */
exports.create = function create (options) {
    return new Bot(options);
};