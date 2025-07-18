/**
 * Information about multi-channel currents.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as currentMc from 'jooby-codec/analog/commands/uplink/currentMc.js';
 *
 * // 4 channels for IMP4EU
 * const bytes = [0x0f, 0x83, 0x01, 0x08, 0x0a, 0x0c];
 *
 * // decoded payload
 * const parameters = currentMc.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     channelList: [
 *         {index: 1, value: 131},
 *         {index: 2, value: 8},
 *         {index: 3, value: 10},
 *         {index: 4, value: 12}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetCurrentMC.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    IChannelValue,
    getExtendedValue,
    setExtendedValue,
    getChannels,
    setChannels
} from '../../utils/CommandBinaryBuffer.js';
import {currentMc as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export interface ICurrentMcResponseParameters {
    /**
     * Max channels: `32`.
     */
    channelList: Array<IChannelValue>;
}

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

// 2 bytes for 7 channelList + (7 channelList * 5 byte for current value of channel)
const COMMAND_BODY_MAX_SIZE = 37;

export const examples: command.TCommandExamples = {
    '4 channels for IMP4EU': {
        id,
        name,
        headerSize,
        parameters: {
            channelList: [
                {value: 131, index: 1},
                {value: 8, index: 2},
                {value: 10, index: 3},
                {value: 12, index: 4}
            ]
        },
        bytes: [
            0x18, 0x06,
            0x0f, 0x83, 0x01, 0x08, 0x0a, 0x0c
        ]
    },
    'single channel for IMP2EU': {
        id,
        name,
        headerSize,
        parameters: {
            channelList: [
                {value: 50, index: 2}
            ]
        },
        bytes: [
            0x18, 0x02,
            0x02, 0x32
        ]
    },
    '3 channels for IMP4EU': {
        id,
        name,
        headerSize,
        parameters: {
            channelList: [
                {value: 8146, index: 1},
                {value: 164, index: 3},
                {value: 75, index: 4}
            ]
        },
        bytes: [
            0x18, 0x06,
            0x0d, 0xd2, 0x3f, 0xa4, 0x01, 0x4b
        ]
    },
    'single channel for ELIMP - max module value': {
        id,
        name,
        headerSize,
        parameters: {
            channelList: [
                {value: 4294967295, index: 1}
            ]
        },
        bytes: [
            0x18, 0x06,
            0x01, 0xff, 0xff, 0xff, 0xff, 0x0f
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ICurrentMcResponseParameters => {
    if ( bytes.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const parameters: ICurrentMcResponseParameters = {channelList: []};
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const channelList = getChannels(buffer);

    parameters.channelList = channelList.map(channelIndex => ({
        value: getExtendedValue(buffer),
        index: channelIndex
    }) as IChannelValue);

    return parameters;
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ICurrentMcResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_MAX_SIZE, false);
    const {channelList} = parameters;

    setChannels(buffer, channelList);
    channelList.forEach(({value}) => {
        setExtendedValue(buffer, value);
    });

    return command.toBytes(id, buffer.getBytesToOffset());
};
