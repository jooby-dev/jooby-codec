/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {describe, expect, test} from '@jest/globals';

import {TMessage, TMessageExamples} from '../../src/analog-ultrasound/message/types.js';
import * as message from '../../src/analog-ultrasound/message/index.js';
import * as downlinkCommands from '../../src/analog-ultrasound/commands/downlink/index.js';
import * as uplinkCommands from '../../src/analog-ultrasound/commands/uplink/index.js';
import * as resultCodes from '../../src/analog-ultrasound/constants/resultCodes.js';
import resultNames from '../../src/analog-ultrasound/constants/resultNames.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import {TBytes} from '../../src/types.js';


const validDownlinkMessages: TMessageExamples = {
    getDepassivationConfig: {
        bytes: getBytesFromHex('03 22 18'),
        commands: [
            {
                id: downlinkCommands.getDepassivationConfig.id,
                name: 'getDepassivationConfig',
                headerSize: 3,
                parameters: {},
                bytes: getBytesFromHex('03 22 18')
            }
        ]
    },
    'getDepassivationConfig x2': {
        bytes: getBytesFromHex('03 22 18 ff ff 03 22 18'),
        commands: [
            {
                id: downlinkCommands.getDepassivationConfig.id,
                name: 'getDepassivationConfig',
                headerSize: 3,
                parameters: {},
                bytes: getBytesFromHex('03 22 18')
            },
            {
                id: downlinkCommands.getDepassivationConfig.id,
                name: 'getDepassivationConfig',
                headerSize: 3,
                parameters: {},
                bytes: getBytesFromHex('03 22 18')
            }
        ]
    },
    'getDepassivationConfig x3': {
        bytes: getBytesFromHex('03 22 18 ff ff 03 22 18 ff ff 03 22 18'),
        commands: [
            {
                id: downlinkCommands.getDepassivationConfig.id,
                name: 'getDepassivationConfig',
                headerSize: 3,
                parameters: {},
                bytes: getBytesFromHex('03 22 18')
            },
            {
                id: downlinkCommands.getDepassivationConfig.id,
                name: 'getDepassivationConfig',
                headerSize: 3,
                parameters: {},
                bytes: getBytesFromHex('03 22 18')
            },
            {
                id: downlinkCommands.getDepassivationConfig.id,
                name: 'getDepassivationConfig',
                headerSize: 3,
                parameters: {},
                bytes: getBytesFromHex('03 22 18')
            }
        ]
    },
    setDepassivationConfig: {
        bytes: getBytesFromHex('07 22 19 c0 5d 20 4e'),
        commands: [
            {
                id: downlinkCommands.setDepassivationConfig.id,
                name: 'setDepassivationConfig',
                headerSize: 3,
                parameters: {
                    resistanceStartThreshold: 24000,
                    resistanceStopThreshold: 20000
                },
                bytes: getBytesFromHex('07 22 19 c0 5d 20 4e')
            }
        ]
    },
    'setDepassivationConfig + getDepassivationConfig': {
        bytes: getBytesFromHex('07 22 19 b8 88 a8 61 ff ff 03 22 18'),
        commands: [
            {
                id: downlinkCommands.setDepassivationConfig.id,
                name: 'setDepassivationConfig',
                headerSize: 3,
                parameters: {
                    resistanceStartThreshold: 35000,
                    resistanceStopThreshold: 25000
                },
                bytes: getBytesFromHex('07 22 19 b8 88 a8 61')
            },
            {
                id: downlinkCommands.getDepassivationConfig.id,
                name: 'getDepassivationConfig',
                headerSize: 3,
                parameters: {},
                bytes: getBytesFromHex('03 22 18')
            }
        ]
    }
};

const invalidDownlinkMessages: TMessageExamples = {
    'empty message': {
        bytes: getBytesFromHex(''),
        commands: []
    },
    'unsupported command': {
        bytes: getBytesFromHex('03 22 00'),
        commands: [
            {
                command: {
                    id: 8704,
                    name: undefined,
                    headerSize: 3,
                    bytes: getBytesFromHex('03 22 00')
                },
                error: {
                    code: resultCodes.UNKNOWN_COMMAND,
                    name: resultNames[resultCodes.UNKNOWN_COMMAND],
                    message: 'Unsupported command id: 8704!'
                }
            }
        ]
    }
};

const validUplinkMessages: TMessageExamples = {
    getDepassivationConfig: {
        bytes: getBytesFromHex('07 22 18 c0 5d 20 4e'),
        commands: [
            {
                id: uplinkCommands.getDepassivationConfig.id,
                name: 'getDepassivationConfig',
                headerSize: 3,
                parameters: {
                    resistanceStartThreshold: 24000,
                    resistanceStopThreshold: 20000
                },
                bytes: getBytesFromHex('07 22 18 c0 5d 20 4e')
            }
        ]
    },
    setDepassivationConfig: {
        bytes: getBytesFromHex('03 22 19'),
        commands: [
            {
                id: uplinkCommands.setDepassivationConfig.id,
                name: 'setDepassivationConfig',
                headerSize: 3,
                parameters: {},
                bytes: getBytesFromHex('03 22 19')
            }
        ]
    },
    'setDepassivationConfig + getDepassivationConfig': {
        bytes: getBytesFromHex('03 22 19 ff ff 07 22 18 c0 5d 20 4e'),
        commands: [
            {
                id: uplinkCommands.setDepassivationConfig.id,
                name: 'setDepassivationConfig',
                headerSize: 3,
                parameters: {},
                bytes: getBytesFromHex('03 22 19')
            },
            {
                id: uplinkCommands.getDepassivationConfig.id,
                name: 'getDepassivationConfig',
                headerSize: 3,
                parameters: {
                    resistanceStartThreshold: 24000,
                    resistanceStopThreshold: 20000
                },
                bytes: getBytesFromHex('07 22 18 c0 5d 20 4e')
            }
        ]
    }
};

const invalidUplinkMessages: TMessageExamples = {
    'setDepassivationConfig failed response': {
        bytes: getBytesFromHex('04 a2 19 05'),
        commands: [
            {
                command: {
                    id: 8729,
                    name: 'setDepassivationConfig',
                    headerSize: 3,
                    bytes: getBytesFromHex('04 a2 19 05')
                },
                error: {
                    code: resultCodes.PARAMETER_ERROR,
                    name: resultNames[resultCodes.PARAMETER_ERROR],
                    message: 'Error response for command 0x2219 (setDepassivationConfig): 5 (PARAMETER_ERROR)!'
                }
            }
        ]
    },

    'unimplemented command response': {
        bytes: getBytesFromHex('04 a8 19 03'),
        commands: [
            {
                command: {
                    id: 10265,
                    name: undefined,
                    headerSize: 3,
                    bytes: getBytesFromHex('04 a8 19 03')
                },
                error: {
                    code: resultCodes.FUNCTION_NOT_FOUND,
                    name: resultNames[resultCodes.FUNCTION_NOT_FOUND],
                    message: 'Error response for command 0x2819 (undefined): 3 (FUNCTION_NOT_FOUND)!'
                }
            }
        ]
    }
};


const checkDownlinkMessage = ( implementation, exampleMessage: TMessage ) => {
    let messageFromBytes: TMessage;
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

const checkMessages = ( description: string, implementation, messagesExamples: TMessageExamples ) => (
    describe(description, () => {
        for ( const [exampleName, exampleMessage] of Object.entries(messagesExamples) ) {
            test(exampleName, () => {
                checkDownlinkMessage(implementation, exampleMessage);
            });
        }
    })
);


checkMessages('valid downlink messages', message.downlink, validDownlinkMessages);
checkMessages('invalid downlink messages', message.downlink, invalidDownlinkMessages);
checkMessages('valid uplink messages', message.uplink, validUplinkMessages);
checkMessages('invalid uplink messages', message.uplink, invalidUplinkMessages);
