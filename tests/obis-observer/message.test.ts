/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import * as message from '../../src/obis-observer/message/index.js';
import {IMessage, IInvalidMessage, TMessageExamples} from '../../src/obis-observer/message/types.js';
import * as downlinkCommands from '../../src/obis-observer/commands/downlink/index.js';
import * as uplinkCommands from '../../src/obis-observer/commands/uplink/index.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import {TBytes} from '../../src/types.js';


const downlinkMessages: TMessageExamples = {
    'getObisIdList + getMeterIdList': {
        bytes: getBytesFromHex('40 03 03 05 01  74 02 05 03'),
        commands: [
            {
                id: downlinkCommands.getObisIdList.id,
                name: 'getObisIdList',
                headerSize: 2,
                parameters: {
                    requestId: 3,
                    meterProfileId: 5,
                    index: 1
                },
                bytes: getBytesFromHex('40 03 03 05 01')
            },
            {
                id: downlinkCommands.getMeterIdList.id,
                name: 'getMeterIdList',
                headerSize: 2,
                parameters: {
                    requestId: 5,
                    index: 3
                },
                bytes: getBytesFromHex('74 02 05 03')
            }
        ]
    }
};

const uplinkMessages: TMessageExamples = {
    'setupObis + observationReport': {
        bytes: getBytesFromHex('43 01 07  53 12 00 00 00 04 2d 18 df 80 32 42 09 51 ec 38 42 35 51 ec'),
        commands: [
            {
                id: uplinkCommands.setupObis.id,
                name: 'setupObis',
                headerSize: 2,
                parameters: {
                    requestId: 7
                },
                bytes: getBytesFromHex('43 01 07')
            },
            {
                id: uplinkCommands.observationReport.id,
                name: 'observationReport',
                headerSize: 2,
                parameters: {
                    meterId: 4,
                    time2000: 756604800,
                    obisValueList: [
                        {code: 50, content: 34.33},
                        {code: 56, content: 45.33}
                    ]
                },
                bytes: getBytesFromHex('53 12 00 00 00 04 2d 18 df 80 32 42 09 51 ec 38 42 35 51 ec')
            }
        ]
    }
};


const checkMessage = ( implementation, exampleMessage: IMessage | IInvalidMessage ) => {
    let messageFromBytes: IMessage | IInvalidMessage;
    let bytesFromMessage: TBytes;

    if ( 'bytes' in exampleMessage ) {
        // valid message
        messageFromBytes = implementation.fromBytes(exampleMessage.bytes);
        bytesFromMessage = implementation.toBytes(exampleMessage.commands);

        expect(getHexFromBytes(bytesFromMessage)).toBe(getHexFromBytes(exampleMessage.bytes));
    } else if ( 'message' in exampleMessage ) {
        // invalid message
        messageFromBytes = implementation.fromBytes(exampleMessage.message.bytes);
    } else {
        // everything else
        throw new Error('wrong message format');
    }

    expect(messageFromBytes).toStrictEqual(exampleMessage);
};


describe('downlink messages', () => {
    for ( const [exampleName, exampleMessage] of Object.entries(downlinkMessages) ) {
        test(exampleName, () => {
            checkMessage(message.downlink, exampleMessage);
        });
    }
});

describe('uplink messages', () => {
    for ( const [exampleName, exampleMessage] of Object.entries(uplinkMessages) ) {
        test(exampleName, () => {
            checkMessage(message.uplink, exampleMessage);
        });
    }
});
