# npmawesome-bot

The bot which is responsible for filling the [@npmawesome](http://twitter.com/npmawesome) Twitter account when new picks arrive on [npmawesome.com](http://npmawesome.com).

## Installation

Install with [npm](https://npmjs.org/package/npmawesome-bot).

    npm i -g npmawesome-bot

## Configuration

The bot will create an configuration file in your home directory on the initial run (`$HOME/.npmawesomebotrc`).

    {
        "feed": {
            "uri": "http://feeds.feedburner.com/npmawesome?format=xml",
            "interval": 300000
        },
        "twitter": {
            "apiKey": "The Twitter API api key.",
            "apiSecret": "The Twitter API api secret.",
            "accessToken": "The Twitter API access token",
            "accessTokenSecret": "The Twitter API access token secret"    
        }
    }

## CLI usage

    Examples:
      npmawesome-bot --watch    "Realtime" #npmawesome updates.


    Options:
      --watch    You will see new #npmawesome posts as they arrive!  [required]
      --quiet    No stdout output.
      --dry-run  No fear, no Twitter interaction in this mode. :)


## Changelog

### Version 0.2.0 (Future)

- Spec for the Twitter API abstraction

### Version 0.1.0 (20140418)

- FeedEmitter for observing the #npmawesome feed.
- Twitter API abstraction ("if there is a new #npmawesome pick, send a tweet")

## Author

Copyright 2014, [André König](http://iam.andrekoenig.info) (andre.koenig@posteo.de)