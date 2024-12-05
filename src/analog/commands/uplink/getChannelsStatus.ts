/**
 * Information about the current status of channels on the device.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getChannelsStatus from 'jooby-codec/analog/commands/uplink/getChannelsStatus.js';
 *
 * const bytes = [0x1f, 0x32, 0x03, 0x02, 0x00, 0x01];
 *
 * // decoded payload
 * const parameters = getChannelsStatus.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * [{
 *     type: 2,
 *     typeName: 'POWER_CHANNEL',
 *     channel: 0,
 *     status: {
 *         state: true
 *     }
 * }]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetChannelsStatus.md#response)
 */

import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000} from '../../utils/time.js';
import * as channelTypes from '../../constants/channelTypes.js';
import channelNames from '../../constants/channelNames.js';


interface IBinarySensorStatus {
    state: boolean
}

interface ITemperatureSensorStatus {
    temperature: types.TInt8,
    time2000: TTime2000
}

interface IChannelStatus {
    type: types.TUint8;
    typeName?: string,
    channel: types.TUint8,
    status?: IBinarySensorStatus | ITemperatureSensorStatus;
}


export const id: types.TCommandId = 0x321f;
export const name: types.TCommandName = 'getChannelsStatus';
export const headerSize = 3;


export const examples: command.TCommandExamples = {
    'binary sensor, channel: 1, state: true': {
        id,
        name,
        headerSize,
        parameters: [
            {
                type: channelTypes.BINARY_SENSOR,
                typeName: 'BINARY_SENSOR',
                channel: 1,
                status: {
                    state: true
                }
            }
        ],
        bytes: [
            0x1f, 0x32, 0x03, 0x03, 0x00, 0x01
        ]
    },
    'temperature sensor, channel: 3, temperature: 24': {
        id,
        name,
        headerSize,
        parameters: [
            {
                type: channelTypes.TEMPERATURE_SENSOR,
                typeName: 'TEMPERATURE_SENSOR',
                channel: 3,
                status: {
                    temperature: 24,
                    time2000: 22720
                }
            }
        ],
        bytes: [
            0x1f, 0x32, 0x07, 0x04, 0x02, 0x18, 0x00, 0x00, 0x58, 0xc0
        ]
    },
    'binary and temperature sensors': {
        id,
        name,
        headerSize,
        parameters: [
            {
                type: channelTypes.BINARY_SENSOR,
                typeName: 'BINARY_SENSOR',
                channel: 1,
                status: {
                    state: true
                }
            },
            {
                type: channelTypes.TEMPERATURE_SENSOR,
                typeName: 'TEMPERATURE_SENSOR',
                channel: 3,
                status: {
                    temperature: 20,
                    time2000: 22720
                }
            }
        ],
        bytes: [
            0x1f, 0x32, 0x0a, 0x03, 0x00, 0x01, 0x04, 0x02, 0x14, 0x00, 0x00, 0x58, 0xc0
        ]
    }

};


const getBufferSize = ( channelsStatus: Array<IChannelStatus> ) => {
    let size = 0;

    for ( let index = 0; index < channelsStatus.length; index++ ) {
        size += 2;

        switch ( channelsStatus[index].type ) {
            case channelTypes.BINARY_SENSOR:
            case channelTypes.TEMPERATURE_SENSOR:
                size += 1;
                break;
            default:
                break;
        }
    }

    return size;
};

const getBinarySensorStatus = ( buffer: ICommandBinaryBuffer ): IBinarySensorStatus => ({
    state: buffer.getUint8() !== 0
});

const setBinarySensorStatus = ( status: IBinarySensorStatus, buffer: ICommandBinaryBuffer ) => {
    buffer.setUint8(status.state ? 1 : 0);
};

const getTemperatureSensorStatus = ( buffer: ICommandBinaryBuffer ): ITemperatureSensorStatus => ({
    temperature: buffer.getInt8(),
    time2000: buffer.getTime()
});

const setTemperatureSensorStatus = ( status: ITemperatureSensorStatus, buffer: ICommandBinaryBuffer ) => {
    buffer.setInt8(status.temperature);
    buffer.setTime(status.time2000);
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): Array<IChannelStatus> => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const result: Array<IChannelStatus> = [];

    while ( buffer.bytesLeft !== 0 ) {
        const type = buffer.getUint8();

        const channelStatus: IChannelStatus = {
            type,
            typeName: channelNames[type],
            channel: buffer.getChannelValue()
        };

        switch (channelStatus.type) {
            case channelTypes.BINARY_SENSOR:
                channelStatus.status = getBinarySensorStatus(buffer);
                break;

            case channelTypes.TEMPERATURE_SENSOR:
                channelStatus.status = getTemperatureSensorStatus(buffer);
                break;

            default:
                return result;
        }

        result.push(channelStatus);
    }

    return result;
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( channelsStatus: Array<IChannelStatus> ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(getBufferSize(channelsStatus));

    for ( let index = 0; index < channelsStatus.length; index++ ) {
        const {type, channel, status} = channelsStatus[index];

        buffer.setUint8(type);
        buffer.setChannelValue(channel);

        switch ( type ) {
            case channelTypes.BINARY_SENSOR:
                setBinarySensorStatus(status as IBinarySensorStatus, buffer);
                break;

            case channelTypes.TEMPERATURE_SENSOR:
                setTemperatureSensorStatus(status as ITemperatureSensorStatus, buffer);
                break;

            default:
                break;
        }
    }

    return command.toBytes(id, buffer.data);
};
