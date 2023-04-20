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
console.log(commands.uplink.GetCurrentMC);

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
import {directions, hardwareTypes} from 'jooby-codec/constants';

// from byte array
const messageData = message.fromBytes(
    new Uint8Array([
        0x02, 0x05, 0x4e, 0x00, 0x01, 0xe2, 0x40,
        0x02, 0x05, 0x4e, 0x00, 0x01, 0xe2, 0x40,
        0x55
    ]),
    directions.DOWNLINK
);
// or from hex string
const messageData = message.fromHex(
    '02 05 4e 00 01 e2 40  02 05 4e 00 01 e2 40  55',
    directions.DOWNLINK
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
    directions.UPLINK
);
```

It's possible to parse message with autodetect direction:

```js
const messageData = message.fromHex(
    '02 01 01  18 06 0f 83 01 08 0a 0c  16 08 2f 97 0f 83 01 08 0a 0c  ef',
    directions.AUTO
);
// or even shorter as message.TYPE_AUTO is default behavior
const messageData = message.fromHex(
    '02 01 01  18 06 0f 83 01 08 0a 0c  16 08 2f 97 0f 83 01 08 0a 0c  ef'
);
```
It's best to avoid using message.TYPE_AUTO due to performance penalty.

Prepare command and get encoded data:

```js
import SoftRestart from 'jooby-codec/commands/downlink/SoftRestart';
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
    new SoftRestart()
]);
```

or to get in a hex format:

```js
import DataDayMC from 'jooby-codec/commands/uplink/DataDayMC';
import LastEvent from 'jooby-codec/commands/uplink/LastEvent';

const commandInstancesArray = [
    new LastEvent(
        {
            sequenceNumber: 32,
            status: {
                isBatteryLow: true,
                isButtonReleased: false,
                isConnectionLost: true,
                isMagneticInfluence: false
            }
        },
        hardwareTypes.GAZM0NEW
    ),
    new DataDayMC({
        startTime: 756604800,
        channelList: [
            {value: 131, index: 3},
            {value: 8, index: 5},
            {value: 10, index: 7},
            {value: 12, index: 1}
        ]
    })
];

const messageBytes = message.toHex(commandInstancesArray, {prefix: '0x'});
// 0x62 0x20 0x09 0x16 0x09 0x2f 0x97 0xaa 0x01 0x0c 0x83 0x01 0x08 0x0a 0x9e
```
