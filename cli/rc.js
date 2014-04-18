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
 * Module dependencies
 *
 */
var fs = require('fs');
var path = require('path');

var file = path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.npmawesomebotrc');

function Configuration () {
    this.path = file;
}

Configuration.prototype.exists = function exists () {
    return fs.existsSync(this.path);
};

Configuration.prototype.touch = function touch () {
    var template = path.join(__dirname, '..', 'etc', 'template');

    fs.createReadStream(template).pipe(fs.createWriteStream(this.path));
};

Configuration.prototype.consume = function consume () {
    return JSON.parse(fs.readFileSync(this.path, 'utf-8'));
};

module.exports = new Configuration();