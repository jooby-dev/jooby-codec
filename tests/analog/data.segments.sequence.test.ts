import * as uplinkMessage from '../../src/analog/message/uplink.js';
import {IMessage} from '../../src/analog/message/types.js';
import {ICommand} from '../../src/analog/utils/command.js';
import {IDataSegment} from '../../src/analog/utils/binary/buffer.js';
import * as uplinkCommands from '../../src/analog/commands/uplink/index.js';
import DataSegmentsCollector from '../../src/analog/utils/DataSegmentsCollector.js';
import {MTXLORA} from '../../src/analog/constants/hardwareTypes.js';
import permutations from '../../src/utils/permutations.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


const expectedMtxBuffer = `
    4d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a000000
    08001d00000008011d00000008001a00000008001d00000008011d00000008001a0000000800
    1d00000008013a00000008013a00000008013a00000008013a000000080000
`;

const messages = [
    '1e28c4314d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a00000033',
    '1e28c43208001d00000008011d00000008001a00000008001d00000008011d00000008001a00000008009d',
    '1e21c4b31d00000008013a00000008013a00000008013a00000008013a00000008000063d0b9e5e7'
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const expectedCommands = {
    [uplinkCommands.lastEvent.id]: {
        sequenceNumber: 208,
        status: {
            isLockedOut: true,
            isMagneticInfluence: false,
            isMeterCaseOpen: true,
            isMeterFailure: true,
            isMeterProgramRestarted: true,
            isMeterTerminalBoxOpen: false,
            isModuleCompartmentOpen: true,
            isNewTariffPlanReceived: false,
            isParametersSetLocally: true,
            isParametersSetRemotely: false,
            isTariffPlanChanged: false,
            isTimeCorrected: true,
            isTimeSet: false,
            isElectromagneticInfluenceReset: true,
            isMagneticInfluenceReset: true
        }
    }
};


const checkMessages = ( sequence: Array<string> ) => {
    const collector = new DataSegmentsCollector();
    const commands: Record<string, object | null> = {};
    let actualMtxBuffer = '';

    for ( const hex of sequence ) {
        const anyMessage = uplinkMessage.fromBytes(getBytesFromHex(hex), {hardwareType: MTXLORA});
        const message = anyMessage as IMessage;

        for ( const anyCommand of message.commands ) {
            const command = anyCommand as ICommand;
            const {id, parameters: anyParameters} = command;

            if ( id === uplinkCommands.dataSegment.id ) {
                const parameters = anyParameters as IDataSegment;
                actualMtxBuffer += getHexFromBytes(collector.push(parameters), {separator: ''});
            } else {
                commands[id] = anyParameters || null;
            }
        }
    }

    expect(expectedCommands).toStrictEqual(commands);
    expect(getBytesFromHex(actualMtxBuffer)).toStrictEqual(getBytesFromHex(expectedMtxBuffer));
};


describe('valid sequences', () => {
    permutations<string>(messages).forEach((sequence, index) => {
        test(`test case #${index}`, () => {
            checkMessages(sequence);
        });
    });
});
