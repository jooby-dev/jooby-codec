# Jooby message encoders/decoders

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/jooby-dev/jooby-codec/test.yml?label=test&style=flat-square)](https://github.com/jooby-dev/jooby-codec/actions)
[![npm version](https://img.shields.io/npm/v/jooby-codec.svg?style=flat-square)](https://www.npmjs.com/package/jooby-codec)
[![Docs](https://img.shields.io/badge/docs-orange.svg?style=flat-square)](https://jooby-dev.github.io/jooby-codec)

This library contains message encoders and decoders for [Jooby](https://jooby.eu) LoRaWAN devices.


## Installation

Install required dependencies:

```sh
npm install jooby-codec
```

This will provide 4 protocols of codecs:

- Analog
- MTX1
- MTX3
- OBIS Observer

There is a low-level documentation available in a separate [repository](https://github.com/jooby-dev/jooby-docs).

It's also possible to send MTX commands [via Lora](./mtx-lora.md).


## Usage of Analog codecs

Add to the project:

```js
import {commands, message} from 'jooby-codec/analog';

// output all available downlink and uplink commands tree
console.log(commands);
// all uplink commands
console.log(commands.uplink);
// one particular command
console.log(commands.uplink.correctTime2000);

// output main namespace for work with messages
console.log(message);
```

But it's better to add only necessary commands to the project:

```js
// to get only downlink commands
import {downlink} from 'jooby-codec/analog/commands';
// or slightly more efficient
import * as downlink from 'jooby-codec/analog/commands/downlink';

// to get one particular command
import * as setTime2000 from 'jooby-codec/analog/commands/downlink/setTime2000.js';
```

The last approach is preferred as it is more efficient and will init only a necessary commands.

Prepare and parse downlink message:

```js
import * as message from 'jooby-codec/analog/message/downlink';
import * as downlinkCommands from 'jooby-codec/analog/commands/downlink';
import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';

const commands = [
    {
        id: downlinkCommands.correctTime2000.id,
        parameters: {sequenceNumber: 45, seconds: -120}
    }
];
const bytes = message.toBytes(commands);

console.log('message encoded:', JSON.stringify(bytes));
// output:
[12,2,45,136,254]

console.log('message encoded in HEX:', getHexFromBytes(bytes));
// output:
'0c 02 2d 88 fe'

// decode message back from bytes
const parsedMessage = message.fromBytes(bytes);

console.log('parsedMessage:', parsedMessage);
// output:
{
    commands: [
      {
        id: 12,
        name: 'correctTime2000',
        headerSize: 2,
        bytes: [Array],
        parameters: [Object]
      }
    ],
    bytes: [ 12, 2, 45, 136, 254 ],
    lrc: { received: 254, calculated: 254 }
}
```

Parse uplink message:

```js
import * as message from 'jooby-codec/analog/message/uplink';

// binary data received from a device
const bytes = [0x0c, 0x01, 0x00, 0x58];

// decode it
const payload = message.fromBytes(bytes);

if ( 'error' in payload ) {
    console.log('decode failure:', payload.error, payload.message);
} else {
    console.log('message decoded:', payload.commands);
    // output:
    [
        {
            id: 12,
            headerSize: 2,
            bytes: [ 12, 1, 0 ],
            parameters: { status: 0 }
        }
    ]
}
```

There may be necessary to pass an additional config with hardware type:

```js
import * as message from 'jooby-codec/analog/message/uplink';
import * as hardwareTypes from 'jooby-codec/analog/constants/hardwareTypes.js';

// binary data received from a device
const bytes = [0x62, 0x20, 0x09, 0x1e];

const config = {
    hardwareType: hardwareTypes.GASI3
};

// decode it
const payload = message.fromBytes(bytes, config);

if ( 'error' in payload ) {
    console.log('decode failure:', payload.error, payload.message);
} else {
    console.log('message decoded:', payload.commands[0]);
    // output:
    [
        {
            id: 96,
            name: 'lastEvent',
            headerSize: 1,
            bytes: [98, 32, 9],
            config: {hardwareType: 3},
            parameters: {
                sequenceNumber: 32,
                status: {
                    isBatteryLow: true,
                    isMagneticInfluence: false,
                    isButtonReleased: false,
                    isConnectionLost: true
                }
            }
        }
    ]
}
```


## Usage of MTX codecs

Add to the project:

```js
import {commands, message} from 'jooby-codec/mtx1';

// output all available downlink and uplink commands tree
console.log(commands);
// all uplink commands
console.log(commands.uplink);
// one particular command
console.log(commands.uplink.setDateTime);

// output main namespace for work with messages
console.log(message);
```

But it's better to add only necessary commands to the project:

```js
// to get only downlink commands
import {downlink} from 'jooby-codec/mtx1/commands';
// or slightly more efficient
import * as downlink from 'jooby-codec/mtx1/commands/downlink';

// to get one particular command
import * as setDateTime from 'jooby-codec/mtx1/commands/downlink/setDateTime.js';
```

The last approach is preferred as it is more efficient and will init only a necessary commands.

Prepare and parse downlink message and frame:

```js
import * as message from 'jooby-codec/mtx1/message/downlink';
import * as frame from 'jooby-codec/mtx1/utils/frame.js';
import * as downlinkCommands from 'jooby-codec/mtx1/commands/downlink';
import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';
import * as frameTypes from 'jooby-codec/mtx1/constants/frameTypes.js';

const aesKey = [...Array(16).keys()];
const messageId = 10;

const commands = [
    {
        id: downlinkCommands.setDateTime.id,
        parameters: {
            isSummerTime: false,
            seconds: 55,
            minutes: 31,
            hours: 18,
            day: 2,
            date: 19,
            month: 2,
            year: 24
        }
    }
];
const messageBytes = message.toBytes(
    commands,
    {
        messageId,
        accessLevel: downlinkCommands.setDateTime.accessLevel,
        aesKey
    }
);

console.log('message encoded:', JSON.stringify(messageBytes));
// output:
[10,19,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132]

console.log('message encoded in HEX:', getHexFromBytes(messageBytes));
// output:
'0a 13 ed 74 0a ae 4a ba c8 42 c4 1b e7 f5 0d 3c 28 84'

const frameBytes = frame.toBytes(
    messageBytes,
    {
        type: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    }
);

console.log('frame encoded:', frameBytes);
// output:
[126,80,170,170,255,255,10,125,51,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132,97,187,126]

console.log('frame encoded in HEX:', getHexFromBytes(frameBytes));
// output:
'7e 50 aa aa ff ff 0a 7d 33 ed 74 0a ae 4a ba c8 42 c4 1b e7 f5 0d 3c 28 84 61 bb 7e'


// decode message back from bytes
const parsedMessage = message.fromBytes(messageBytes, {aesKey});

console.log('parsed message:', parsedMessage);
// output:
/* {
    messageId: 3,
    accessLevel: 3,
    commands: [
    {
        id: 8,
        name: 'setDateTime',
        headerSize: 2,
        bytes: [Array],
        parameters: [Object]
    }
    ],
    bytes: [3,19,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132],
    lrc: {received: 119, calculated: 119}
} */

// decode message back from frame
const parsedFrame = frame.fromBytes(frameBytes);

console.log('parsedFrame:', parsedFrame);
// output:
/* {
    bytes: [10,19,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132],
    crc: {calculated: 47969, received: 47969},
    header: {type: 80, destination: 43690, source: 65535}
} */

if ( 'bytes' in parsedFrame ) {
    const parsedMessage2 = message.fromBytes(parsedFrame.bytes, {aesKey});

    console.log('parsedMessage2:', parsedMessage2);
    // output:
    /* {
        messageId: 10,
        accessLevel: 3,
        commands: [
            {
                id: 8,
                name: 'setDateTime',
                headerSize: 2,
                bytes: [Array],
                parameters: [Object]
            }
        ],
        bytes: [10,19,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132],
        lrc: {received: 119, calculated: 119}
    } */
}
```

Parse uplink message:

```js
import * as message from 'jooby-codec/mtx1/message/uplink';
import * as frame from 'jooby-codec/mtx1/utils/frame.js';
import getBytesFromHex from 'jooby-codec/utils/getBytesFromHex.js';

const aesKey = [...Array(16).keys()];

// a message with one getBuildVersion command
const messageBytes = getBytesFromHex('0a 13 9b 4b f7 2a d1 e5 49 a5 09 50 9a 59 7e c2 b5 88');
// the same message as a frame
const frameBytes = getBytesFromHex('7e 51 aa aa ff ff 0a 7d 33 9b 4b f7 2a d1 e5 49 a5 09 50 9a 59 7d 5e c2 b5 88 21 54 7e');

const parsedMessage = message.fromBytes(messageBytes, {aesKey});

console.log('parsed message:', parsedMessage);
// output:
/* {
    messageId: 10,
    accessLevel: 3,
    commands: [
        {
            id: 112,
            name: 'getBuildVersion',
            headerSize: 2,
            bytes: [Array],
            parameters: [Object]
        }
    ],
    bytes: [10,19,155,75,247,42,209,229,73,165,9,80,154,89,126,194,181,136],
    lrc: {received: 53, calculated: 53}
} */

const parsedFrame = frame.fromBytes(frameBytes);

console.log('parsed frame:', parsedFrame);
// output:
/* {
    bytes: [10,19,155,75,247,42,209,229,73,165,9,80,154,89,126,194,181,136],
    crc: {calculated: 21537, received: 21537},
    header: {type: 81, destination: 43690, source: 65535}
} */

// parsed successfully
if ( 'bytes' in parsedFrame ) {
    const parsedMessage2 = message.fromBytes(parsedFrame.bytes, {aesKey});

    if ( JSON.stringify(parsedMessage) === JSON.stringify(parsedMessage2) ) {
        console.log('correct message');
    } else {
        throw new Error('parsedMessage and parsedMessage2 should be identical!');
    }
}
```


## Usage of OBIS Observer

Add to the project:

```js
import {commands, message} from 'jooby-codec/obis-observer';

// output all available downlink and uplink commands tree
console.log(commands);
// all uplink commands
console.log(commands.uplink);
// one particular command
console.log(commands.uplink.getMeterId);

// output main namespace for work with messages
console.log(message);
```

But it's better to add only necessary commands to the project:

```js
// to get only downlink commands
import {downlink} from 'jooby-codec/obis-observer/commands';
// or slightly more efficient
import * as downlink from 'jooby-codec/obis-observer/commands/downlink';

// to get one particular command
import * as getMeterInfo from 'jooby-codec/obis-observer/commands/downlink/getMeterInfo.js';
```

The last approach is preferred as it is more efficient and will init only a necessary commands.

Prepare and parse downlink message:

```js
import * as message from 'jooby-codec/obis-observer/message/downlink';
import * as downlinkCommands from 'jooby-codec/obis-observer/commands/downlink';
import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';

const commands = [
    {
        id: downlinkCommands.getMeterProfile.id,
        parameters: {requestId: 3, meterProfileId: 4}
    }
];
const bytes = message.toBytes(commands);

console.log('message encoded:', JSON.stringify(bytes));
// output:
[102,2,3,4]

console.log('message encoded in HEX:', getHexFromBytes(bytes));
// output:
'66 02 03 04'

// decode message back from bytes
const parsedMessage = message.fromBytes(bytes);

console.log('parsedMessage:', parsedMessage);
// output:
{
    commands: [
        {
            id: 102,
            name: 'getMeterProfile',
            headerSize: 2,
            bytes: [Array],
            parameters: [Object]
        }
    ],
    bytes: [102, 2, 3, 4]
}
```

Parse uplink message:

```js
import * as message from 'jooby-codec/obis-observer/message/uplink';

// binary data received from a device
const bytes = [0x10, 0x0d, 0x02, 0x00, 0x00, 0x00, 0x51, 0x2c, 0x2d, 0xea, 0xae, 0x2c, 0x2f, 0x0a, 0xf6];

// decode it
const payload = message.fromBytes(bytes);

if ( 'error' in payload ) {
    console.log('decode failure:', payload.error, payload.message);
} else {
    console.log('message decoded:', payload.commands);
    // output:
    [
        {
            id: 16,
            name: 'getArchiveState',
            headerSize: 2,
            bytes: [
                16, 13, 2, 0, 0, 0, 81, 44, 45, 234, 174, 44, 47, 10, 246
            ],
            parameters: {
                requestId: 2,
                archiveRecordsNumber: 81,
                eldestTime2000: 741206702,
                newestTime2000: 741280502
            }
        }
    ]
}
```
