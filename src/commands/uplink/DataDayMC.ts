/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannelValue} from '../../CommandBinaryBuffer.js';
import {getSecondsFromDate} from '../../utils/time.js';
import GetCurrentMC, {IGetCurrentMCParameters} from './GetCurrentMC.js';
import {UPLINK} from '../../constants/directionTypes.js';


/**
 * DataDayMC command parameters.
 */
interface IDataDayMCParameters extends IGetCurrentMCParameters {
    /**
     * Seconds since year 2000, i.e. timestamp (in seconds) - 946684800
     */
    startTime: number
}


const COMMAND_ID = 0x16;
const COMMAND_TITLE = 'DATA_DAY_MC';

// 2 byte for date + 2 for channels (max channels: 7)
// 4 + (7 * 4)
const COMMAND_BODY_MAX_SIZE = 32;


class DataDayMC extends GetCurrentMC {
    constructor ( public parameters: IDataDayMCParameters ) {
        super(parameters);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): DataDayMC {
        const parameters: IDataDayMCParameters = {channelList: [], startTime: 0};

        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const channels = buffer.getChannels();

        parameters.channelList = channels.map(channelIndex => ({
            value: buffer.getExtendedValue(),
            index: channelIndex
        }) as IChannelValue);

        parameters.startTime = getSecondsFromDate(date);

        return new DataDayMC(parameters);
    }

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
