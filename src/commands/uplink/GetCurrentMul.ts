import Command from '../../Command.js';


const COMMAND_ID = 0x18;
const COMMAND_TITLE = 'GET_CURRENT_MUL';
const LAST_BIT_INDEX = 7;
const EXTENDED_BIT = 0x80;
const COUNTER_SIZE = 0x7f;
const CHANNELS_MASK = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40];


/**
 * GetCurrentMul command channel.
 */
export interface IChannel {
    index: number,
    value: number
}

/**
 * GetCurrentMul command parameters.
 */
export interface IGetCurrentMulParameters {
    channels: Array<IChannel>
}


class GetCurrentMul extends Command {
    constructor ( public parameters: IGetCurrentMulParameters ) {
        super();

        this.parameters.channels = this.parameters.channels.sort((a, b) => a.index - b.index);
    }

    static id = COMMAND_ID;

    static readonly isUplink = true;

    static title = COMMAND_TITLE;

    protected static getChannels ( data: Uint8Array, startPosition = 0 ) {
        const channels = [];

        let extended = 1;
        let channelIndex = 0;
        let position = startPosition;

        for ( ; extended && position < data.length; position++ ) {
            extended = data[position] & EXTENDED_BIT;

            for ( let index = 0; index < CHANNELS_MASK.length; index++ ) {
                if ( data[position] & CHANNELS_MASK[index] ) {
                    channels.push((channelIndex * LAST_BIT_INDEX) + index);
                }
            }

            ++channelIndex;
        }

        return {channels, position};
    }

    protected static getChannelValue ( data: Uint8Array, startPosition: number ) {
        let value = 0;
        let extended = 1;
        let position;

        for ( position = startPosition; extended && position < data.length; position++ ) {
            extended = data[position] & EXTENDED_BIT;
            value += (data[position] & COUNTER_SIZE) << (LAST_BIT_INDEX * (position - startPosition));
        }

        return {value, position};
    }

    protected static getChannelMap ( channels: Array<number>, data: Uint8Array, startPosition: number ): Map<number, IChannel> {
        const map = new Map();
        let position = startPosition;
        let value;

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for ( let index = 0; index < channels.length; index++ ) {
            ({value, position} = this.getChannelValue(data, position));

            const channelIndex = channels[index];
            const channel: IChannel = {value, index: channelIndex};

            map.set(channelIndex, channel);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return map;
    }

    protected static setChannels ( channels: Map<number, number> ) : Array<number> {
        if ( channels.size === 0 ) {
            throw new Error(`${this.getName()}. Channel map is empty, nothing to do.`);
        }

        const lastChannel = Array.from(channels.keys()).pop();

        if ( !lastChannel ) {
            // just to solve "lastChannel is possibly 'undefined'." error
            throw new Error(`${this.getName()}. Channel map is empty, nothing to do.`);
        }

        const size = Math.ceil(lastChannel / LAST_BIT_INDEX) + (lastChannel % LAST_BIT_INDEX) ? 1 : 0;
        const data = Array(size).fill(EXTENDED_BIT);

        channels.forEach((_, channelIndex) => {
            data[Math.floor(channelIndex / LAST_BIT_INDEX)] |= CHANNELS_MASK[channelIndex % LAST_BIT_INDEX];
        });

        data[data.length - 1] &= COUNTER_SIZE;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
    }

    protected static setValue ( value: number, data: Array<number> ) {
        let channelValue = value;

        while ( channelValue ) {
            data.push(EXTENDED_BIT | (channelValue & COUNTER_SIZE));
            // eslint-disable-next-line no-param-reassign
            channelValue >>= LAST_BIT_INDEX;
        }

        const lastValue = data.pop();

        if ( lastValue ) {
            // just to solve "lastValue is possibly 'undefined'" error
            data.push(lastValue & COUNTER_SIZE);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected static setValues ( channels: Map<number, number>, data: Array<number> ): any {
        channels.forEach(value => {
            this.setValue(value, data);
        });
    }

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetCurrentMul {
        const parameters: IGetCurrentMulParameters = {channels: []};

        const {channels, position} = this.getChannels(data);
        const channelMap = this.getChannelMap(channels, data, position);

        channels.forEach(channelIndex => {
            const channel = channelMap.get(channelIndex);

            if ( channel ) {
                parameters.channels.push(channel);
            }
        });

        return new GetCurrentMul(parameters);
    }

    toBytes () {
        const {channels} = this.parameters;
        // eslint-disable-next-line @typescript-eslint/consistent-generic-constructors
        const channelMap: Map<number, number> = new Map(
            channels.map((channel: IChannel) => [channel.index, channel.value])
        );

        const data = GetCurrentMul.setChannels(channelMap);
        GetCurrentMul.setValues(channelMap, data);

        return Command.toBytes(COMMAND_ID, new Uint8Array(data));
    }
}


export default GetCurrentMul;
