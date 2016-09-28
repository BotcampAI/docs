# Botcamp API Documentation

- [Getting Started](#getting-started)
- [Request Authorization](#request-authorization)
- [Configuring Your Bot](#configuring-your-bot)
- [Receiving Messages](#receiving-messages)
  - [Text Messages](#text-messages)
  - [Mentions](#mentions)
  - [Links](#links)
  - [Pictures](#pictures)
  - [Videos](#videos)
  - [Files](#files)
  - [Locations](#locations)
  - [Events](#events)
  - [Metadata](#metadata)
- [Sending Messages](#sending-messages)
  - [Text Messages](#sending-text-messages)
  - [Mentions](#sending-mentions)
  - [Links](#sending-links)
  - [Pictures](#sending-pictures)
  - [Videos](#sending-videos)
  - [Files](#sending-files)
  - [Locations](#sending-locations)
  - [Custom Keyboards](#custom-keyboards)
  - [Custom Messages](#custom-messages)
- [Channels API](#channels-api)
- [Users API](#users-api)
- [Files API](#files-api)
- [Questions, Feature Requests and Bug Reports](#questions-feature-requests-and-bug-reports)

## Getting Started

First of all, you need to create and configure a bot using [Botcamp App](http://app.botcamp.ai/). Right after it, you'll get a token for a newly created bot to communicate with Botcamp platform.

You have a choice of two different ways on how to communicate with our platform — HTTP API or Websockets. Please, keep in mind that these are alternative approaches, that cannot be used together.

## Request Authorization

Each HTTP-request to Botcamp API should contain your bot token within `Authorization` header property.

```
  Authorization: Bearer ${yourBotToken}
```

In case websockets are being used instead of HTTP, please, send us your bot token together with a payload object within `token` property.

## Configuring your bot

To configure your bot and to get it online on all the platforms  you need to send a `POST` request to `http://api.botcamp.ai/hi` with the following payload:

```javascript
// POST https://api.botcamp.ai/hi
// Authorization: Bearer ${yourBotToken}
{
  "protocol": "http",
  "webhook": "http://your-webdomain.com/bot-webhook",
  "meta": true
}
```

- **`protocol`**: *string*. Protocol you are going to use, `ws` or `http`.
- **`webhook`**: *string*, **optional in case of protocol='ws'**. Should contain an URL of your bot server webhook, that will be triggered each time we receive any message from your users. Required only if `protocol` is `http`.
- **`meta`**: *boolean*, **optional, false by default**. Defines whether to include meta information into a message or not. Meta information contains an initial message in the format of the platform, user and channel properties. Keep it turned on in case your bot is going to use any platform-specific message types Botcamp does not support yet.

Depending on the protocol chosen, the server responses with an object which contains URL to connect or post messages to:

```javascript
// POST https://api.botcamp.ai/hi
// Authorization: Bearer ${yourBotToken}
// Response example:
{
  "http": "https://api.botcamp.ai/"
}
```

In case of websockets:

```javascript
// POST https://api.botcamp.ai/hi
// Authorization: Bearer ${yourBotToken}
// Response example:
{
  "ws": "wss://api.botcamp.ai/FH67DSX" // URL to connect to Botcamp websocket server
}
```

## Receiving Messages

Botcamp transforms incoming messages from all the platforms, and unifies their format. Apart from the important information, you receive some helper properties to ease your work.

- **`platform`**: *platform string*. `slack`, `kik`, `telegram` or `messenger`.
- **`channel`**: *channel id string*. Channel id, where channel is a user or group of users.
- **`user`**: *user id string*. User id, where user is the user, who sends a message, uploads a file, or initiates an event.
- **`type`**: *enum*. Type of the message, one of the following `text`, `file`, `link`, `picture`, `video`, `location` or `event`.
- **`text`**: *string*, **optional**. Text message content or event type (if `type` of the message is `event`). Mentions of the users appear within the text message as `<@USERID>`. Mentions of your bot are marked as `<@ME>`.
- **`title`**: *string*, **optional**. Location title.
- **`url`**: *url string*, **optional**. URL of video, photo, link or file.
- **`mentions`**: *array of user id strings*. Array of the user ids mentioned in the message. Doesn't contain your bot id. If the bot was mentioned, see `mentioned` field.
- **`mentioned`**: *boolean*. Determines whether bot was mentioned in the message.
- **`direct`**: *bool*. True if it's a direct message to your bot.
- **`timestamp`**: *timestamp*. In milliseconds.
- **`latitude`**: *number*, **optional**. Latitude of a location shared. Only for messages with type `location`.
- **`longitude`**: *number*, **optional**. Longitude of a location shared. Only for messages with type `location`.
- **`meta`**: *object*, **optional**. Contains `message`, `channel` and `user` properties.

### Text Messages

Example of the incoming message (Botcamp makes a call to your bot's webhook or websocket client):

```javascript
// receiving a text message
{
  "platform": "messenger",
  "channel": "FKVF9KTZ", // id of the channel, where message was sent
  "user": "XFD7KDX0", // id of the user, who sent the message
  "type": "text", // this is a simple text message
  "text": "Hi! How's that feels to be a bot?", // your bot's username was replaced with <@ME>
  "mentions": [], // no mentions of other users were found in this message
  "mentioned": false, // your bot were not mentioned in the message
  "direct": true, // it's a group message, other users may be present on this channel
  "timestamp": 1463487634001
}
```

### Mentions

Botcamp provides you with the list of users mentioned in a message (`mentions` property of an incoming message, see [messages format](#messages) for more information), as well as with the information whether your bot is being mentioned or not (`mentioned` property). Your bot username is replaced with `<@ME>` placeholder, other users are represented in a format of `<@USERID>`, e.g. `<@YFD6F8X0>`. See [Users API](#users-api)) on how to retrieve the information about a specific user.

```javascript
// receiving a text message with mentions
{
  "platform": "messenger",
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

### Links

Remember, that `link` message doesn't contain `text` property. It has `url` instead.

```javascript
// receiving a link message
{
  "platform": "kik",
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

### Pictures

```javascript
//receiving a picture message
{
  "platform": "slack",
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

### Videos

```javascript
// receiving a video message
{
  "platform": "kik",
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

### Files

```javascript
// receiving a file message
{
  "platform": "telegram",
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

### Locations

```javascript
// receiving a location
{
  "platform": "messenger",
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0",
  "type": "location",
  "title": "Joe's current location",
  "latitude": 4.9167593510755,
  "longitude": 52.369026792616,
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```

### Events

Events are a special type of *only incoming messages*. It helps your bot better to understand the context of what's happening, e.g. user has left the channel or started typing something.

Botcamp now supports the following types of the events:
- **`start`**: start of the conversation, your bot was added
- **`join`**: user joined a channel
- **`leave`**: user left a channel
- **`end`**: end of the conversation, your bot was removed

```javascript
// receiving an event
// start of the conversation / added to a channel
{
  "platform": "messenger",
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0", // user who invited you or started a conversation
  "type": "event",
  "text": "start",
  "timestamp": 1463487634001
}
```

```javascript
// receiving an event
// end of the conversation / removed from a channel
{
  "platform": "slack",
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0", // user who removed you or closed the conversation
  "type": "event",
  "text": "end",
  "timestamp": 1463487634001
}
```

```javascript
// receiving an event
// new user joined
{
  "platform": "telegram",
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0", // user who joined
  "type": "event",
  "text": "join",
  "timestamp": 1463487634001
}
```

```javascript
// receiving an event
// user left a channel / group
{
  "platform": "slack",
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0", // user who left
  "type": "event",
  "text": "leave",
  "timestamp": 1463487634001
}
```

### Metadata

In order to receive additional information right together with Botcamp message payload, you've must been specified it during your bot configuration, setting `meta` to `true` (see [Configuring your bot](#configuring-your-bot) section).

In this case each message payload is going to be extended with a `meta` property, which contains:

- **`message`**: *object*. Unmodified incoming message in the format of the platform.
- **`channel`**: *object*. Additional channel properties such as `chatId` for kik or `channel` for slack. To get more information about the channels use [Channels API](#channels-api).
- **`user`**: *object*. Additional user properties such as `user` for slack or `username` for telegram. To get more information about the users use [Users API](#users-api).

```javascript
// receiving a text message with metadata
{
  "platform": "slack",
  "channel": "FKBRQGJL",
  "user": "FKEYWGC9",
  "type": "text",
  "text": "Hey mate!",
  "mentioned": false,
  "mentions": [],
  "direct": true,
  "timestamp": 1463487644001,
  "meta": {
    "message": {
      "type": "message",
      "channel": "D0XBUF960",
      "user": "U0WIAG4XF",
      "text": "Hey mate!",
      "ts": "1475070302.000002",
      "team": "T0XFNKJ4X"
    },
    "user": {
      "user": "U0WIAG4XF"
    },
    "channel": {
      "team": "T0XFNKJ4X",
      "channel": "D0XBUF960"
    }
  }
}
```

## Sending Messages

Outgoing messages should contain the next set of fields:

- **`channel`**: *channel id string*. Channel id, where channel is a user or group of users.
- **`type`**: *enum*. Type of the message, one of the following `text`, `file`, `link`, `picture`, `video`, `event`, `location` or `custom`.
- **`title`**: *string*, **optional**. Title of a shared location or link, if `type` of the message is `location` or `link`
- **`text`**: *string*, **optional**. Text message content or a shared link description, if `type` of the message is `link`. If you want to mention a user, use the construction `<@USERID>` anywhere within the text message. To mention your bot itself simply use `<@ME>`.
- **`url`**: *url string*, **optional**. URL of video, photo, link or file.
- **`latitude`**: *number*, **optional**. Latitude of a location shared. Only for messages with type `location`.
- **`longitude`**: *number*, **optional**. Longitude of a location shared. Only for messages with type `location`.
- **`suggestions`**: *array of strings*. A set of quick reply options for the user (custom keyboard).
- **`token`**: *token string*, **optional**. It's a required field in case you're using websockets. In case of HTTP API, please, use `Authorization` header.
- **`message`**: *object*, **optional**. Required only if message `type` is `custom`. Contains message payload in a platform-specific format, e.g. send a Messenger's receipt template message, which is not supported by Botcamp message types. See more in [Custom Messages](#custom-messages) section.

### <a name="sending-text-messages"></a>Text Messages

Here is an example of your bot's message to the user:

```javascript
// sending a text message
// POST https://api.botcamp.ai/
// Authorization: Bearer ${yourBotToken}
{
  "channel": "FKVF9KTZ", // send message to the channel with this id
  "type": "text", // send a text message
  "text": "Hi, nice to meet you."
}
```

### <a name="sending-mentions"></a>Mentions

Same rules for mentioning users apply for outgoing messages. Use `<@ME>` to mention your bot or `<@USERID>` to mention a user.

```javascript
// sending a text message with mentions
// POST https://api.botcamp.ai/
// Authorization: Bearer ${yourBotToken}
{
  "channel": "FKVF9KTZ", // send message to the channel with this id
  "type": "text", // send a text message
  "text": "Hi, <@ME> is here to help! What time do you prefer for the meeting with <@YFD6F8X0>?"
}
```

### <a name="sending-links"></a>Links

Pass a link you want to share within `url` property:

```javascript
// sending a link message
// POST https://api.botcamp.ai/
// Authorization: Bearer ${yourBotToken}
{
  "channel": "FKVF9KTZ",
  "type": "link",
  "url": "https://www.facebook.com"
}
```

```javascript
// sending a link with title and description
// POST https://api.botcamp.ai/
// Authorization: Bearer ${yourBotToken}
{
  "channel": "FKVF9KTZ",
  "type": "link",
  "title": "Facebook",
  "text": "A World's Leading Social Network",
  "url": "https://www.facebook.com"
}
```

### <a name="sending-pictures"></a>Pictures

```javascript
// sending a picture message
// POST https://api.botcamp.ai/
// Authorization: Bearer ${yourBotToken}
{
  "channel": "FKVF9KTZ",
  "type": "picture",
  "url": "http://www.aagga.com/wp-content/uploads/2016/02/Sample.jpg"
}
```

### <a name="sending-videos"></a>Videos

```javascript
// sending a video message; maximum video size is 15Mb
// POST https://api.botcamp.ai/
// Authorization: Bearer ${yourBotToken}
{
  "channel": "FKVF9KTZ",
  "type": "video",
  "url": "http://download.wavetlan.com/SVV/Media/HTTP/H264/Talkinghead_Media/H264_test1_Talkinghead_mp4_480x360.mp4"
}
```

### <a name="sending-files"></a>Files

```javascript
// sending a file message
// POST https://api.botcamp.ai/
// Authorization: Bearer ${yourBotToken}
{
  "channel": "FKVF9KTZ",
  "type": "file",
  "url": "http://www.pdf995.com/samples/pdf.pdf"
}
```

### <a name="sending-locations"></a>Locations

```javascript
// sending a location
// POST https://api.botcamp.ai/
// Authorization: Bearer ${yourBotToken}
{
  "channel": "FKVF9KTZ",
  "user": "XFD7KDX0",
  "type": "location",
  "title": "Bakers and Roasters",
  "latitude": 4.9167593510755,
  "longitude": 52.362026792616,
  "mentions": [],
  "mentioned": false,
  "direct": true,
  "timestamp": 1463487634001
}
```

### Custom Keyboards

To add a custom keyboard to the message, `suggestions` property should be specified within a message payload (works for any message type). It should contain a set of strings, that represent the options for a custom keyboard. This functionality works for all platforms, including a fallback for Slack.

```javascript
// sending a text message with a custom keyboard
// POST https://api.botcamp.ai/
// Authorization: Bearer ${yourBotToken}
{
  "channel": "FKVF9KTZ",
  "type": "text",
  "text": "Hi there. How do you feel using Botcamp?",
  "suggestions": ["Good", "It's amazing", "Botcamp rocks!"]
}
```

Botcamp utilizes [quick replies](https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies) for Facebook Messenger, [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) for Telegram, [suggested keyboards](https://dev.kik.com/#/docs/messaging#keyboards) for Kik and a fallback with a text message with options for Slack.

### Custom Messages

There is no limitation in only message types Botcamp supports. You are allowed to send custom messages for any platform. To do that specify message `type` as `custom` and add `message` property with an outgoing message in a format of the platform you're targeting.

```javascript
// sending a generic template message to messenger as a custom message
// POST https://api.botcamp.ai/
// Authorization: Bearer ${yourBotToken}
{
  "type": "custom",
  "message": {

    // messenger-specific message format
    "recipient": { "id": "826771253098362" },
    "message":{
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Welcome to Peter\'s Hats",
            "item_url": "https://petersfancybrownhats.com",
            "image_url": "https://petersfancybrownhats.com/company_image.png",
            "subtitle": "We\'ve got the right hat for everyone.",
            "buttons": [{
                "type": "web_url",
                "url": "https://petersfancybrownhats.com",
                "title": "View Website"
            }]
          }]
        }
      }
    }

  }
}
```

## Channels API

To get more information about the channel of a message, which could be a group chat or a direct one, make a `GET` request to `https://channel.botcamp.ai/${channelId}`. Do not forget to add a Botcamp token to `Authorization` header.

```javascript
// getting channel information
// GET https://channel.botcamp.ai/CGJ9KIX1
// Authorization: Bearer ${yourBotToken}
{
  "id": "CGJ9KIX1",
  "platform": "kik",
  "from": "johndoe",
  "chatId": "c9ca9a079e8db938394766e61cf92e9e78930e10f056cef9b61142c3e5af0e48"
}
```

## Users API

Botcamp provides an API to learn more about your users. Passing user id, you have received in any message, you can access such information like first name, last name, email and much more. Of course, it strictly depends on the type of the messenger being used to send the message.

Send `GET` request to `https://user.botcamp.ai/${userId}` and do not forget to add your token to `Authorization` header. We do not store any user information and provide it as a proxy, so please be sure you store it in some way on your side.

```javascript
// getting user information
// GET https://user.botcamp.ai/XFD7KDX0
// Authorization: Bearer ${yourBotToken}
{
  "id": "XFD7KDX0",
  "platform": "telegram",
  "username": "hoxyfoxy",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@doe.com",
  "image": "https://files.botcamp.ai/JGFY25FX"
}
```

## Files API

Probably you have already noticed, that for security reasons Botcamp hides all the incoming URLs behind its own proxy file server. Same as for the users we do not store any files on our servers. We always include a full URL to all files in any message in the format of `https://file.botcamp.ai/${fileId}`.

Do not forget to add your token to `Authorization` header.

## Questions, Feature Requests and Bug Reports

If you have a bug report, a feature request in your mind, or just stuck somewhere and need help, please, [file a ticket](https://github.com/BotcampAI/support). We will be happy to help you.
