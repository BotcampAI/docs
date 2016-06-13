# Botcamp API

## Getting started

First of all, you need to create a bot using [Botcamp Web Application](http://app.botcamp.ai/). Right after it, you'll get a token for a newly created bot to communicate with Botcamp platform.

You have a choice of two different ways on how to communicate with our platform — [HTTP API](#http-api) or [Websockets](#websockets). Please, keep in mind that these are alternative approaches, that cannot be used together.

## Authorization

Each HTTP-request to Botcamp API should contain your bot token within `Authorization` header property.

```
  Authorization: Bearer placeYourBotTokenHere
```

In case websockets are being used instead of HTTP, please, send us your bot token together with a payload object within `token` property.

## Configuring your bot

To configure your bot and to get it online on all the platforms  you need to send a `POST` request to `http://api.botcamp.ai/hi` with the following payload:

```javascript
{
  "protocol": "http",
  "webhook": "http://your-webdomain.com/bot-webhook"
}
```

- `protocol`: required, `ws` or `http`.
- `webhook`: should contain an URL of your script, that will be triggered each time we receive any message from your users. Required only if `protocol` is `http`.

Depending on the protocol chosen, the server responses with an object which contains URL to connect or post messages to:

```javascript
{
  "http": "https://api.botcamp.ai/"
}
```

In case of websockets:

```javascript
{
  "ws": "wss://api.botcamp.ai/rt/FH67DSX"
}
```


## Messages

- `channel`: channel id
- `user`: user id
- `type`: `text`, `file`, `link`, `picture`, `video`, `event`
- `text`: message itself; if you want to mention some user place <@${userId}> within text; <@ME> for mentioning the bot itself
- `url`: file URL
- `mentions`: array of the user ids mentioned in the message; doesn't contain botId; in the `message.text` bot mention is marked as `<@ME>`
- `mentioned`: bool, determines whether bot was mentioned in the message
- `direct`: bool, if it's a direct message
- `timestamp`: timestamp with milliseconds


### Text Messages

```javascript
// text message
{
  "type": "text",
  "text": "this is text",
  "channel": "FKVF9KTZ",
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```

### Links

```javascript
// link message
{
  "type": "link",
  "url": "https://www.facebook.com",
  "channel": "FKVF9KTZ",
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```

### Pictures

```javascript
// picture message
{
  "type": "picture",
  "channel": "FKVF9KTZ",
  "url": "https://files.botcamp.ai/FKVF9KTZ/YX431AG2",
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```

### Videos

```javascript
// video message
{
  "type": "video",
  "channel": "FKVF9KTZ",
  "url": "http://download.wavetlan.com/SVV/Media/HTTP/H264/Talkinghead_Media/H264_test1_Talkinghead_mp4_480x360.mp4",
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```

### Files

```javascript
// file message
{
  "type": "file",
  "channel": "FKVF9KTZ",
  "url": "https://files.botcamp.ai/FKVF9KTZ/YX431AG2",
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```

## Events

```javascript
// start of the conversation / added to a channel
{
  "type": "event",
  "channel": "FKVF9KTZ",
  "text": "start",
  "user": "XFSF9KTZ", // user who invited you or started a conversation
  "timestamp": 1463487634001
}
```

```javascript
// end of the conversation / removed from a channel
{
  "type": "event",
  "channel": "FKVF9KTZ",
  "text": "start",
  "user": "XFSF9KTZ", // user who removed you or closed the conversation
  "timestamp": 1463487634001
}
```

```javascript
// new user joined
{
  "type": "event",
  "channel": "FKVF9KTZ",
  "text": "join",
  "user": "XFSF9KTZ", // user who joined
  "timestamp": 1463487634001
}
```

```javascript
// user left a channel / group
{
  "type": "event",
  "channel": "FKVF9KTZ",
  "text": "leave",
  "user": "XFSF9KTZ", // user who left
  "timestamp": 1463487634001
}
```

## Mentions

### Receiving Messages

```javascript
// text message
{
  "type": "text",
  "text": "<@XK7F9CHY>, can you do that?",
  "channel": "FKVF9KTZ",
  "mentions": [],
  "mentioned": true,
  "direct": false,
  "timestamp": 1463487634001
}
```

### Sending Messages

```javascript
// text message
{
  "type": "text",
  "text": "<@FDSA5GF8>, yes, I can? You can also ask <@JFD2GH4O> to do that.",
  "channel": "FKVF9KTZ"
}
```

## Questions, Feature Requests and Bug Reports
