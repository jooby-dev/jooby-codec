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

import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    getTime,
    setTime,
    getChannelValue,
    setChannelValue
} from '../../utils/CommandBinaryBuffer.js';
import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000} from '../../utils/time.js';
import * as channelTypes from '../../constants/channelTypes.js';
import channelNames from '../../constants/channelNames.js';
import {getChannelsStatus as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


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


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;


export const examples: command.TCommandExamples = {
    'binary sensor, channel: 1, state: true': {
        id,
        name,
        headerSize,
        parameters: [
            {
                type: channelTypes.BINARY_SENSOR_CONFIGURABLE,
                typeName: 'BINARY_SENSOR_CONFIGURABLE',
                channel: 1,
                status: {
                    state: true
                }
            }
        ],
        bytes: [
            0x1f, 0x32, 0x03, 0x05, 0x00, 0x01
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
    'power channel and pulse, binary configurable and temperature sensors': {
        id,
        name,
        headerSize,
        parameters: [
            {
                type: channelTypes.POWER_CHANNEL,
                typeName: 'POWER_CHANNEL',
                channel: 1
            },
            {
                type: channelTypes.BINARY_SENSOR_CONFIGURABLE,
                typeName: 'BINARY_SENSOR_CONFIGURABLE',
                channel: 2,
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
            },
            {
                type: channelTypes.PULSE_SENSOR,
                typeName: 'PULSE_SENSOR',
                channel: 4
            }
        ],
        bytes: [
            0x1f, 0x32, 0x0e, 0x02, 0x00, 0x05, 0x01, 0x01, 0x04, 0x02, 0x14, 0x00, 0x00, 0x58, 0xc0, 0x01, 0x03
        ]
    }
};


const getBufferSize = ( channelsStatus: Array<IChannelStatus> ) => {
    let size = 0;

    for ( let index = 0; index < channelsStatus.length; index++ ) {
        size += 2;

        switch ( channelsStatus[index].type ) {
            case channelTypes.BINARY_SENSOR:
            case channelTypes.BINARY_SENSOR_CONFIGURABLE:
            case channelTypes.TEMPERATURE_SENSOR:
                size += 1;
                break;
            default:
                break;
        }
    }

    return size;
};

const getBinarySensorStatus = ( buffer: IBinaryBuffer ): IBinarySensorStatus => ({
    state: buffer.getUint8() !== 0
});

const setBinarySensorStatus = ( status: IBinarySensorStatus, buffer: IBinaryBuffer ) => {
    buffer.setUint8(status.state ? 1 : 0);
};

const getTemperatureSensorStatus = ( buffer: IBinaryBuffer ): ITemperatureSensorStatus => ({
    temperature: buffer.getInt8(),
    time2000: getTime(buffer)
});

const setTemperatureSensorStatus = ( status: ITemperatureSensorStatus, buffer: IBinaryBuffer ) => {
    buffer.setInt8(status.temperature);
    setTime(buffer, status.time2000);
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): Array<IChannelStatus> => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const result: Array<IChannelStatus> = [];

    while ( buffer.bytesLeft !== 0 ) {
        const type = buffer.getUint8();

        const channelStatus: IChannelStatus = {
            type,
            typeName: channelNames[type],
            channel: getChannelValue(buffer)
        };

        switch ( channelStatus.type ) {
            case channelTypes.POWER_CHANNEL:
            case channelTypes.PULSE_SENSOR:
            case channelTypes.IDLE:
                break;

            case channelTypes.BINARY_SENSOR:
            case channelTypes.BINARY_SENSOR_CONFIGURABLE:
                channelStatus.status = getBinarySensorStatus(buffer);
                break;

            case channelTypes.TEMPERATURE_SENSOR:
                channelStatus.status = getTemperatureSensorStatus(buffer);
                break;

            default:
                // prevent infinite loop
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
export const toBytes = ( parameters: Array<IChannelStatus> ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(getBufferSize(parameters), false);

    for ( let index = 0; index < parameters.length; index++ ) {
        const {type, channel, status} = parameters[index];

        buffer.setUint8(type);
        setChannelValue(buffer, channel);

        switch ( type ) {
            case channelTypes.POWER_CHANNEL:
            case channelTypes.PULSE_SENSOR:
            case channelTypes.IDLE:
                break;

            case channelTypes.BINARY_SENSOR:
            case channelTypes.BINARY_SENSOR_CONFIGURABLE:
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
