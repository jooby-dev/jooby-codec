/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {getSecondsFromDate} from '../../utils/time.js';
import GetCurrentMul, {IGetCurrentMulParameters} from './GetCurrentMul.js';
import {DIRECTION_TYPE_UPLINK} from '../../constants/directionTypes.js';


/**
 * DataDayMul command parameters.
 */
interface IDataDayMulParameters extends IGetCurrentMulParameters {
    /**
     * Seconds since year 2000, i.e. timestamp (in seconds) - 946684800
     */
    time: number
}


const COMMAND_ID = 0x16;
const COMMAND_TITLE = 'DATA_DAY_MUL';

// 2 byte for date + 2 for channels (max channels: 7)
// 4 + (7 * 4)
const COMMAND_BODY_MAX_SIZE = 32;


class DataDayMul extends GetCurrentMul {
    constructor ( public parameters: IDataDayMulParameters ) {
        super(parameters);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DIRECTION_TYPE_UPLINK;

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): DataDayMul {
        const parameters: IDataDayMulParameters = {channels: [], time: 0};

        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const channelArray = buffer.getChannels(false);

        parameters.channels = channelArray.map(channelIndex => ({
            value: buffer.getExtendedValue(),
            index: channelIndex
        }));

        parameters.time = getSecondsFromDate(date);

        return new DataDayMul(parameters);
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channels, time} = this.parameters;

        buffer.setDate(time);
        buffer.setChannels(channels.map(({index}) => index));
        channels.forEach(({value}) => buffer.setExtendedValue(value));

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default DataDayMul;
