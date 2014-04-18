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

var url = require('url');
var https = require('https');
var crypto = require('crypto');
var querystring = require('querystring');

/**
 * Twitter API abstraction.
 *
 * The options object should have the following information:
 *
 *     apiKey: The Twitter API key (application)
 *     apiSecret: The Twitter API secret (application)
 *     accessToken: The users access token.
 *     accessSecret: The users access token secret.
 * 
 * @param {object} options The configuration object.
 *
 */
function Twitter (options) {
    this.$$apiEndpoint = 'https://api.twitter.com';
    this.$$apiVersion  = '1.1';

    this.$$apiKey = options.apiKey;
    this.$$apiSecret = options.apiSecret;
    this.$$accessToken = options.accessToken;
    this.$$accessTokenSecret = options.accessTokenSecret;
}

/**
 * Generates the OAuth signature for the HTTP header.
 *
 * @param {string} uri The URI for which the signature should be generated.
 * @param {string} verb The HTTP verb (optional; default = 'GET')
 * @param {string} payload The request payload which will be send in the HTTP request body (as querystring)
 *
 * @return {string} The OAuth generated signature which will be added to the HTTP request header (e.g. Authorization: OAuth <signature>)
 *
 */
Twitter.prototype.$$createOAuthSignature = function $$createOAuthSignature (uri, verb, payload) {
    var method = 'HMAC-SHA1';
    var version = '1.0';
    var timestamp = Math.floor((new Date()).getTime() / 1000).toString();
    var nonce = new Buffer(timestamp).toString('base64').replace(/[+=/]/g, '');
    var key = this.$$apiSecret + '&' + this.$$accessTokenSecret;
    var signature = 'OAuth ';
    var base;
    var oauthSign;

    verb = verb || 'GET';

    base = verb + '&' + encodeURIComponent(uri) + '&';

    base = base + encodeURIComponent(
                    'oauth_consumer_key=' + this.$$apiKey +
                    '&oauth_nonce=' + nonce +
                    '&oauth_signature_method=' + method +
                    '&oauth_timestamp=' + timestamp +
                    '&oauth_token=' + this.$$accessToken +
                    '&oauth_version=' + version
                );

    if (payload) {
        base = base + encodeURIComponent('&' + payload);
    }

    oauthSign = crypto.createHmac('sha1', key).update(base).digest('base64');
    oauthSign = oauthSign.replace('+', '%2B');
    oauthSign = oauthSign.replace('/', '%2F');
    oauthSign = oauthSign.replace('=', '%3D');

    signature = signature + 'oauth_consumer_key="' + this.$$apiKey + '"' +
                          ', oauth_nonce="' + nonce + '"' +
                          ', oauth_signature="' + oauthSign + '"' + 
                          ', oauth_signature_method="HMAC-SHA1"' +
                          ', oauth_timestamp="' + timestamp + '"' +
                          ', oauth_token="' + this.$$accessToken + '"' +
                          ', oauth_version="1.0"';

    return signature;
};

/**
 * Returns the full Twitter API URI
 *
 * @param  {string} action e.g. /statuses/update.json
 *
 * @return {string} e.g. https://api.twitter.com/1.1/statuses/update.json
 *
 */
Twitter.prototype.$$prepareURI = function $$prepareURI (action) {
    if ('/' !== action[0]) {
        action = '/' + action;
    }

    return this.$$apiEndpoint + '/' + this.$$apiVersion + action;
};

/**
 * Sends a tweet to the Twitter API.
 *
 * @param {string} message The message that should be send.
 * @param {function} callback
 *
 */
Twitter.prototype.tweet = function tweet (message, callback) {
    var uri = this.$$prepareURI('/statuses/update.json');
    var options = url.parse(uri);
    var payload = querystring.stringify({
        status: message
    });
    var request;

    callback = callback || function () {};

    function handleError (err) {
        if (err) {
            return callback(new Error('Problem while sending tweet to Twitter: ' + err.message));
        }
    }

    options.method = 'POST';
    options.headers = {
        Authorization: this.$$createOAuthSignature(uri, options.method, payload),
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    request = https.request(options, function onResponse (response) {
        var body = '';

        response
            .on('readable', function onReadable () {
                body = body + response.read().toString('utf-8');
            })
            .on('error', handleError)
            .on('end', function () {
                var result;

                try {
                    result = JSON.parse(body);
                } catch (e) {}

                if (200 !== response.statusCode) {
                    return handleError(new Error('Status: ' + response.statusCode));
                } else {
                    return callback(null, result);
                }
            });
    });

    request.write(payload);
    request.on('error', handleError);
    request.end();
};

/**
 * Creates an instance of the Twitter API abstraction.
 *
 * @param {object} options The configuration object (see above)
 *
 * @return {Twitter} The Twitter API abstraction instance.
 *
 */
exports.create = function create (options) {
    options = options || {};

    return new Twitter(options);
};