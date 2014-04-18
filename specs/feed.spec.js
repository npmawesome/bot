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

var fs = require('fs');
var http = require('http');
var Feed = require('../lib/feed');

describe('The Feed abstraction', function () {
    var server;

    var feed = Feed.create({
        uri: 'http://127.0.0.1:60000/npmawesome.atom',
        interval: 2000
    });

    beforeEach(function (done) {
        server = http.createServer(function (req, res) {
            fs.createReadStream(__dirname + '/fixtures/npmawesome.atom').pipe(res);
        }).listen(60000, done);
    });

    afterEach(function (done) {
        server.close(done);
    });

    it('should be able to listen for new items', function (done) {
        feed.watch()
            .once('new', function awesome (pick) {
                expect(pick).toBeDefined();
                expect(pick.title).toBe('EHLO');
                expect(pick.guid).toBe('http://npmawesome.com/is/awesome');

                feed.unwatch();

                done();
            });
    });
});