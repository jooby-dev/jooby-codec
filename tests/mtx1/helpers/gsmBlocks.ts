import * as types from '../../../src/mtx1/types.js';
import * as frameTypes from '../../../src/mtx1/constants/frameTypes.js';
import * as frame from '../../../src/mtx1/utils/frame.js';
import getBytesFromHex from '../../../src/utils/getBytesFromHex.js';
import * as mtx1 from '../../../src/mtx1/index.js';
import {IGsmBlock} from '../../../src/mtx1/utils/binary/gsm.js';
import {Collector, Parameters} from '../../../src/mtx1/utils/gsmParameters.js';
import {isValidFrame, isValidMessage, isValidCommand} from './frameValidation.js';


const aesKey = getBytesFromHex('000102030405060708090a0b0c0d0e0f');


export const toFrames = (
    isDownlink: boolean,
    blocks: Array<IGsmBlock>,
    messageId: types.TUint8 = 1
): Array<types.TBytes> => {
    const frames: Array<types.TBytes> = [];
    const codec = isDownlink ? mtx1.message.downlink : mtx1.message.uplink;
    const command = isDownlink ? mtx1.commands.downlink.setGsmParameters : mtx1.commands.uplink.getGsmParameters;

    for ( let index = 0; index < blocks.length; index++ ) {
        const messageBytes = codec.toBytes(
            [{...command, parameters: blocks[index]}],
            {messageId, aesKey}
        );
        const header = {
            type: isDownlink ? frameTypes.DATA_REQUEST : frameTypes.DATA_RESPONSE,
            source: 0xffff,
            destination: 0xffff
        };

        frames.push(frame.toBytes(messageBytes, header));
    }

    return frames;
};

export const fromFrame = ( bytes: types.TBytes ): IGsmBlock => {
    const parsedFrame = isValidFrame(frame.fromBytes(bytes));

    expect(
        parsedFrame.header?.type === frameTypes.DATA_REQUEST
        || parsedFrame.header?.type === frameTypes.DATA_RESPONSE
    ).toBe(true);

    const codec = parsedFrame.header?.type === frameTypes.DATA_REQUEST
        ? mtx1.message.downlink
        : mtx1.message.uplink;
    const message = isValidMessage(codec.fromBytes(parsedFrame.payload, {aesKey}));

    expect(message.commands.length).toBe(1);

    const command = isValidCommand(message.commands[0]);

    expect(command.parameters).toHaveProperty('index');
    expect(command.parameters).toHaveProperty('data');

    return command.parameters as IGsmBlock;
};

export const collect = ( collector: Collector, blocks: Array<IGsmBlock> ): Parameters => {
    let parameters: Parameters = {type: 'incomplete'};

    for ( let index = 0; index < blocks.length; index++ ) {
        parameters = collector.push(blocks[index]);

        if ( parameters.type !== 'incomplete' ) {
            break;
        }
    }

    return parameters;
};
