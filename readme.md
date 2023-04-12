Jooby message encoders/decoders
===============================

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/jooby-dev/jooby-codec/test.yml?label=test&style=flat-square)](https://github.com/jooby-dev/jooby-codec/actions)
[![npm version](https://img.shields.io/npm/v/jooby-codec.svg?style=flat-square)](https://www.npmjs.com/package/jooby-codec)
[![Docs](https://img.shields.io/badge/docs-orange.svg?style=flat-square)](https://jooby-dev.github.io/jooby-codec)

This library contains message encoders and decoders for [Jooby](https://jooby.eu) LoRaWAN devices.


## Usage

Install required dependencies:

```sh
npm install jooby-codec
```

Add to the project:

```js
import {commands, message} from 'jooby-codec';

// output all available commands tree
console.log(commands);
// all uplink commands
console.log(commands.uplink);
// one particular command
console.log(commands.uplink.getCurrentMul.default);

// output main namespace for work with messages
console.log(message);
```

But it's better to add only necessary commands to the project:

```js
// to get only downlink commands
import {downlink} from 'jooby-codec/commands';
// or slightly more efficient
import * as downlink from 'jooby-codec/commands/downlink';

// to get one particular command
import SetTime2000 from 'jooby-codec/commands/downlink/SetTime2000';
```

The last approach is preferred as it is more efficient and will init only a necessary commands.

It's possible to parse messages either from raw [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) or HEX string:

Parse downlink message:

```js
// from byte array
const messageData = message.fromBytes(
    new Uint8Array([
        0x02, 0x05, 0x4e, 0x00, 0x01, 0xe2, 0x40,
        0x02, 0x05, 0x4e, 0x00, 0x01, 0xe2, 0x40,
        0x55
    ]),
    message.TYPE_DOWNLINK
);
// or from hex string
const messageData = message.fromHex(
    '02 05 4e 00 01 e2 40  02 05 4e 00 01 e2 40  55',
    message.TYPE_DOWNLINK
);

// decoded data with commands and checksum
console.log(messageData);
/*{
    commands: [
        { data: [Object], command: [SetTime2000] },
        { data: [Object], command: [SetTime2000] }
    ],
    lrc: { expected: 85, actual: 85 },
    isValid: true
}*/
```

Parse uplink message:

```js
const messageData = message.fromHex(
    '02 01 01  18 06 0f 83 01 08 0a 0c  16 08 2f 97 0f 83 01 08 0a 0c  ef',
    message.TYPE_UPLINK
);
```

It's possible to parse message with autodetect direction:

```js
const messageData = message.fromHex(
    '02 01 01  18 06 0f 83 01 08 0a 0c  16 08 2f 97 0f 83 01 08 0a 0c  ef',
    message.TYPE_AUTO
);
// or even shorter as message.TYPE_AUTO is default behavior
const messageData = message.fromHex(
    '02 01 01  18 06 0f 83 01 08 0a 0c  16 08 2f 97 0f 83 01 08 0a 0c  ef'
);
```
It's best to avoid using message.TYPE_AUTO due to performance penalty.

Prepare command and get encoded data:

```js
import SetTime2000 from 'jooby-codec/commands/downlink/SetTime2000';

const command = new SetTime2000({sequenceNumber: 5, seconds: 9462957});

// output command binary in hex representation
// 02 05 05 00 90 64 ad
console.log(command.toHex());
// [2, 5, 5, 0, 144, 100, 173]
console.log(command.toBytes());
```

Combine a message from commands:

```js
const messageBytes = message.toBytes([
    new SetTime2000({sequenceNumber: 78, seconds: 123456}),
    new GetCurrent()
]);
```

or to get in a hex format:

```js
const commandInstancesArray = [
    new SetTime2000({status: 1}),
    new DataDayMul({
        channels: [
            {value: 131, index: 0},
            {value: 8, index: 1},
            {value: 10, index: 2},
            {value: 12, index: 3}
        ],
        seconds: 75660480
    })
];

const messageBytes = message.toHex(commandInstancesArray, {prefix: '0x'});
// 0x02 0x05 0x05 0x00 0x90 ...
```
