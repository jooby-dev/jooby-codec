/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IChannelValue} from '../../CommandBinaryBuffer.js';
import {getSecondsFromDate, TTime2000} from '../../utils/time.js';
import CurrentMC, {ICurrentMCParameters} from './CurrentMC.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * DataDayMC command parameters.
 */
interface IDataDayMCParameters extends ICurrentMCParameters {
    startTime: TTime2000
}


const COMMAND_ID = 0x16;

// 2 byte for date + 2 for channels (max channels: 7)
// 4 + (7 * 4)
const COMMAND_BODY_MAX_SIZE = 32;

const examples: TCommandExampleList = [
    {
        name: '4 channels at 2023.12.23 00:00:00 GMT',
        parameters: {
            startTime: 756604800,
            channelList: [
                {index: 3, value: 131},
                {index: 5, value: 8},
                {index: 7, value: 10},
                {index: 1, value: 12}
            ]
        },
        hex: {header: '16 09', body: '2f 97 aa 01 0c 83 01 08 0a'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import DataDayMC from 'jooby-codec/commands/uplink/DataDayMC';
 *
 * const commandBody = new Uint8Array([
 *     0x2f, 0x97, 0xaa, 0x01, 0x0c, 0x83, 0x01, 0x08, 0x0a
 * ]);
 * const command = DataDayMC.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime: 756604800,
 *     channelList: [
 *         {value: 131, index: 3},
 *         {value: 8, index: 5},
 *         {value: 10, index: 7},
 *         {value: 12, index: 1}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/DataDayMC.md#event)
 */
class DataDayMC extends CurrentMC {
    constructor ( public parameters: IDataDayMCParameters ) {
        super(parameters);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): DataDayMC {
        const parameters: IDataDayMCParameters = {channelList: [], startTime: 0};
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channelList = buffer.getChannels();

        parameters.channelList = channelList.map(channelIndex => ({
            value: buffer.getExtendedValue(),
            index: channelIndex
        }) as IChannelValue);

        parameters.startTime = getSecondsFromDate(date);

        return new DataDayMC(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList, startTime} = this.parameters;

        buffer.setDate(startTime);
        buffer.setChannels(channelList);
        channelList.forEach(({value}) => buffer.setExtendedValue(value));

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default DataDayMC;
