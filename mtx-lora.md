# Sending MTX commands via Lora


## Encoding

```js
import * as mtxMessage from 'jooby-codec/mtx/message/uplink';
import * as analogMessage from 'jooby-codec/analog/message/uplink';
import * as uplinkCommands from 'jooby-codec/mtx/commands/uplink';
import {dataSegment} from 'jooby-codec/analog/commands/downlink';
import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';
import {splitBytesToDataSegments} from 'jooby-codec/analog/utils/splitBytesToDataSegments.js';
import {accessLevels} from 'jooby-codec/mtx/constants/index.js';


const messageId = 2;
const accessLevel = accessLevels.UNENCRYPTED;
const segmentationSessionId = 1;
const maxSegmentSize = 40;

const commands = [
    {
        id: uplinkCommands.getDayMaxPower.id,
        parameters: {
            date: {
                year: 24,
                month: 1,
                date: 8
            },
            tariffs: [
                {
                    'A+': {hours: 1, minutes: 29, power: 8},
                    'A+R+': {hours: 0, minutes: 26, power: 8},
                    'A+R-': {hours: 0, minutes: 29, power: 8},
                    'A-': {hours: 1, minutes: 58, power: 8}
                },
                {
                    'A+': {hours: 1, minutes: 29, power: 8},
                    'A+R+': {hours: 0, minutes: 26, power: 8},
                    'A+R-': {hours: 0, minutes: 29, power: 8},
                    'A-': {hours: 1, minutes: 58, power: 8}
                },
                {
                    'A+': {hours: 1, minutes: 29, power: 8},
                    'A+R+': {hours: 0, minutes: 26, power: 8},
                    'A+R-': {hours: 0, minutes: 29, power: 8},
                    'A-': {hours: 1, minutes: 58, power: 8}
                },
                {
                    'A+': {hours: 1, minutes: 29, power: 8},
                    'A+R+': {hours: 0, minutes: 26, power: 8},
                    'A+R-': {hours: 0, minutes: 29, power: 8},
                    'A-': {hours: 1, minutes: 58, power: 8}
                }
            ]
        }
    }
];

// build a regular mtx message from source commands
const messageBytes = mtxMessage.toBytes(commands, {accessLevel, messageId});

// split mtx message to segments
const segments = splitBytesToDataSegments(messageBytes, {segmentationSessionId, maxSegmentSize});

// create analog message from each segment
segments.forEach(segmentParameters => {
    const segmentCommand = {id: dataSegment.id, parameters: segmentParameters};
    const bytes = analogMessage.toBytes([segmentCommand]);

    console.log(getHexFromBytes(bytes, {separator: ''}));
});
/*
output:
1e2a0131021010796430280fff011d00000008001a00000008001a00000008011d00000008001a0000000800b4
1e2a01321a00000008011d00000008001a00000008001a00000008011d00000008001a00000008001a00000048
1e1d01b308013a00000008013a00000008013a00000008013a0000000800b05c
*/
```


## Decoding

```js
import * as mtxMessage from 'jooby-codec/mtx/message/uplink';
import * as analogMessage from 'jooby-codec/analog/message/uplink';
import {dataSegment} from 'jooby-codec/analog/commands/downlink';
import getBytesFromHex from 'jooby-codec/utils/getBytesFromHex.js';
import {hardwareTypes} from 'jooby-codec/analog/constants/index.js';
import DataSegmentsCollector from 'jooby-codec/analog/utils/DataSegmentsCollector.js';
import {IDataSegment} from 'jooby-codec/analog/utils/CommandBinaryBuffer.js';


const segmentsBytes = [
    '1e28c4314d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a00000033',
    '1e28c43208001d00000008011d00000008001a00000008001d00000008011d00000008001a00000008009d',
    '1e21c4b31d00000008013a00000008013a00000008013a00000008013a00000008000063d0b9e5e7'
];

const collector = new DataSegmentsCollector();
let mtxBuffer = [];

segmentsBytes.forEach(segmentBytes => {
    // each segment should be treated as analog message
    const segmentMessage = analogMessage.fromBytes(
        getBytesFromHex(segmentBytes),
        {hardwareType: hardwareTypes.MTXLORA}
    );

    if ( 'error' in segmentMessage ) {
        console.error(segmentMessage.error);
    } else {
        // parsed successfully
        segmentMessage.commands.forEach(command => {
            if ( 'error' in command ) {
                console.error(command.error);
                return;
            }

            // valid command
            if ( command.id === dataSegment.id ) {
                // each segment command parameters should be used to fill the collector
                mtxBuffer = mtxBuffer.concat(collector.push(command.parameters as IDataSegment));
            } else {
                // some regular command
                console.log('regular command', command);
            }
        });
    }
});

// mtxBuffer is a complete message extracted from all segments
const parsedMessage = mtxMessage.fromBytes(mtxBuffer, {});

if ( 'commands' in parsedMessage ) {
    console.log(parsedMessage.commands);
    // output:
    [
        {
            id: 121,
            name: 'getDayMaxPower',
            headerSize: 2,
            bytes: [Array],
            parameters: {date: [Object], tariffs: [Array]}
        }
    ]
}
```
