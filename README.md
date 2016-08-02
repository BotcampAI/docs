# Botcamp API Documentation

- [Getting Started](#getting-started)
- [Request Authorization](#request-authorization)
- [Configuring Your Bot](#configuring-your-bot)
- [Messages](#messages)
- [Events](#events)
- [Users API](#users-api)
- [Files API](#files-api)
- [Message Examples](#message-examples)
- [Questions, Feature Requests and Bug Reports](#questions-feature-requests-and-bug-reports)

## Getting Started

First of all, you need to create a bot using [Botcamp Web Application](http://app.botcamp.ai/). Right after it, you'll get a token for a newly created bot to communicate with Botcamp platform.

You have a choice of two different ways on how to communicate with our platform — HTTP API or Websockets. Please, keep in mind that these are alternative approaches, that cannot be used together.

## Request Authorization

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

- `protocol`: protocol you are going to use, `ws` or `http`.
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
  "ws": "wss://api.botcamp.ai/FH67DSX"
}
```

## Messages

Botcamp transforms incoming messages from all the platforms, and unifies the format of them. Apart from the important information, you receive some helper properties to ease your work.

- `channel`: *channel id string*. Channel id, where channel is a user or group of users.
- `user`: *user id string*. User id, where user is the user, who sends a message, uploads a file, or initiates an event.
- `type`: *enum*. Type of the message, one of the following `text`, `file`, `link`, `picture`, `video` or `event`.
- `text`: *string*, **optional**. Text message content or event type, if `type` of the message is `event`.
- `url`: *url string*, **optional**. URL of video, photo, link or file.
- `mentions`: *array of user id strings*. Array of the user ids mentioned in the message. Doesn't contain your bot id. If the bot was mentioned, see `mentioned` field.
- `mentioned`: *boolean*. Determines whether bot was mentioned in the message.
- `direct`: *bool*. True if it's a direct message to your bot.
- `timestamp`: *timestamp*. In milliseconds.
- `token`: *token string*. It's a required field in case you're using websockets. In case of HTTP API, please, use `Authorization` header.

Example of the incoming message:

```javascript
// example of incoming text message
{
  "channel": "FKVF9KTZ", // id of the channel, where message was sent
  "user": "XFD7KDX0", // id of the user, who sent the message
  "type": "text", // this is a simple text message
  "text": "this is a text message",
  "mentions": [], // no mentions of other users were found in this message
  "mentioned": false, // your bot were not mentioned in the message
  "direct": false, // it's a group message, other users may be present on this channel
  "timestamp": 1463487634001
}
```

```javascript
// example of incoming text message with mentions
{
  "channel": "FKVF9KTZ", // id of the channel, where message was sent
  "user": "XFD7KDX0", // id of the user, who sent the message
  "type": "text", // this is a simple text message
  "text": "Hi, <@ME>, I'd like to schedule a meeting with <@YFD6F8X0>", // content of the message with user mentions
  "mentions": ['YFD6F8X0'], // user with id YFD6F8X0 was mentioned in the message
  "mentioned": true, // your bot were mentioned in the message
  "direct": true, // it's a direct message
  "timestamp": 1463487634001
}
```

Outgoing messages should contain the next fields:

- `channel`: *channel id string*. Channel id, where channel is a user or group of users.
- `type`: *enum*. Type of the message, one of the following `text`, `file`, `link`, `picture`, `video` or `event`.
- `text`: *string*, **optional**. Text message content or event type, if `type` of the message is `event`. If you want to mention a user, use the next construction anywhere within your text `<@USERID>`. To mention your bot itself simply use `<@ME>`.
- `url`: *url string*, **optional**. URL of video, photo, link or file.

Here is an example of your bot's message:

```javascript
// example of outgoing text message
{
  "channel": "FKVF9KTZ", // send message to the channel with this id
  "type": "text", // send a text message
  "text": "Hi, <@XFD7KDX0>, my name is <@ME>."
}
```

For more examples on different types of messages, please, see [Message Examples](#message-examples).

## Events

Events are a special type of *only incoming messages*. It helps your bot better to understand the context of what's happening, e.g. user has left the channel or started typing something.

Botcamp now supports the following types of the events:
- `start`: start of the conversation, your bot was added
- `join`: user joined a channel
- `leave`: user left a channel
- `end`: end of the conversation, your bot was removed

```javascript
// start of the conversation / added to a channel
{
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0", // user who invited you or started a conversation
  "type": "event",
  "text": "start",
  "timestamp": 1463487634001
}
```

```javascript
// end of the conversation / removed from a channel
{
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0", // user who removed you or closed the conversation
  "type": "event",
  "text": "end",
  "timestamp": 1463487634001
}
```

```javascript
// new user joined
{
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0", // user who joined
  "type": "event",
  "text": "join",
  "timestamp": 1463487634001
}
```

```javascript
// user left a channel / group
{
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0", // user who left
  "type": "event",
  "text": "leave",
  "timestamp": 1463487634001
}
```

## Users API

Botcamp provides an API to learn more about your users. Passing user id, you have received in any message, you can access such information like first name, last name, email and much more. Of course, it strictly depends on the type of the messenger being used to send the message.

Send `GET` request to `https://users.botcamp.ai/${userId}` and do not forget to add your token to `Authorization` header. We do not store any user information and provide it as a proxy, so please be sure you store it in some way on your side.

```javascript
// GET to https://users.botcamp.ai/XFD7KDX0
{
  "username": "hoxyfoxy",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@doe.com",
  "image": "https://files.botcamp.ai/JGFY25FX"
}
```

## Files API

Probably you have already noticed, that for security reasons Botcamp hides all the incoming URLs behind its own proxy file server. Same as for the users we do not store any files on our servers. We always include a full URL to all files in any message in the format of `https://files.botcamp.ai/${fileId}`.

Do not forget to add your token to `Authorization` header.

## Message Examples

### Text Messages

```javascript
// example of incoming text message
{
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0",
  "type": "text",
  "text": "this is a text message",
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```

```javascript
// example of outgoing text message
{
  "channel": "FKVF9KTZ",
  "type": "text",
  "text": "Hi, <@XFD7KDX0>, my name is <@ME>."
}
```

### Links

```javascript
// example of incoming link message
{
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0",
  "type": "link",
  "url": "https://www.facebook.com",
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```


```javascript
// example of outgoing link message
{
  "channel": "FKVF9KTZ",
  "type": "link",
  "url": "https://www.facebook.com"
}
```

### Pictures

```javascript
// example of incoming picture message
{
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0",
  "type": "picture",
  "url": "https://files.botcamp.ai/FKVF9KTZ/YX431AG2",
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```

```javascript
// example of outgoing picture message
{
  "channel": "FKVF9KTZ",
  "type": "picture",
  "url": "http://www.aagga.com/wp-content/uploads/2016/02/Sample.jpg"
}
```

### Videos

```javascript
// example of incoming video message
{
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0",
  "type": "video",
  "url": "https://files.botcamp.ai/HFGDY64J",
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```

```javascript
// example of outgoing video message; maximum video size is 15Mb
{
  "channel": "FKVF9KTZ",
  "type": "video",
  "url": "http://download.wavetlan.com/SVV/Media/HTTP/H264/Talkinghead_Media/H264_test1_Talkinghead_mp4_480x360.mp4"
}
```

### Files

```javascript
// example of incoming file message
{
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0",
  "type": "file",
  "url": "https://files.botcamp.ai/JI431AG2",
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```

```javascript
// example of outgoing file message
{
  "channel": "FKVF9KTZ",
  "type": "file",
  "url": "http://www.pdf995.com/samples/pdf.pdf"
}
```

## Questions, Feature Requests and Bug Reports

If you have a bug report, a feature request in your mind, or just stuck somewhere and need help, please, [file a ticket](https://github.com/BotcampAI/support). We will be happy to help you.
