/**
 * Information about the current status of channels on the device,
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
 *     status: {
 *         channel: 0,
 *         state: true
 *     }
 * }]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetChannelsStatus.md#response)
 */

import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import * as channelsTypes from '../../constants/channelsTypes.js';


export const id: types.TCommandId = 0x321f;
export const name: types.TCommandName = 'getChannelsStatus';
export const headerSize = 3;


interface IBinarySensorStatus {
    state: boolean
}

interface ITemperatureSensorStatus {
    temperature: types.TInt8,
}

interface IChannelStatus {
    type: types.TUint8;
    channel: types.TUint8,
    status?: IBinarySensorStatus | ITemperatureSensorStatus;
}


export const examples: command.TCommandExamples = {
    'binary sensor, channel: 0, state: true': {
        id,
        name,
        headerSize,
        parameters: [
            {
                type: channelsTypes.BINARY_SENSOR,
                channel: 0,
                status: {
                    state: true
                }
            }
        ],
        bytes: [
            0x1f, 0x32, 0x03, 0x03, 0x00, 0x01
        ]
    },
    'temperature sensor, channel: 1, temperature: 20': {
        id,
        name,
        headerSize,
        parameters: [
            {
                type: channelsTypes.TEMPERATURE_SENSOR,
                channel: 1,
                status: {
                    temperature: 20
                }
            }
        ],
        bytes: [
            0x1f, 0x32, 0x03, 0x04, 0x01, 0x14
        ]
    },
    'binary and temperature sensors': {
        id,
        name,
        headerSize,
        parameters: [
            {
                type: channelsTypes.BINARY_SENSOR,
                channel: 0,
                status: {
                    state: true
                }
            },
            {
                type: channelsTypes.TEMPERATURE_SENSOR,
                channel: 1,
                status: {
                    temperature: 20
                }
            }
        ],
        bytes: [
            0x1f, 0x32, 0x06, 0x03, 0x00, 0x01, 0x04, 0x01, 0x14
        ]
    }

};


const getBufferSize = ( channelsStatus: Array<IChannelStatus> ) => {
    let size = 0;

    for ( let index = 0; index < channelsStatus.length; index++ ) {
        size += 2;

        switch ( channelsStatus[index].type ) {
            case channelsTypes.BINARY_SENSOR:
            case channelsTypes.TEMPERATURE_SENSOR:
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
    temperature: buffer.getInt8()
});

const setTemperatureSensorStatus = ( status: ITemperatureSensorStatus, buffer: IBinaryBuffer ) => {
    buffer.setInt8(status.temperature);
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): Array<IChannelStatus> => {
    const buffer: IBinaryBuffer = new BinaryBuffer(data);
    const result: Array<IChannelStatus> = [];


    while ( buffer.bytesLeft !== 0 ) {
        const channelStatus: IChannelStatus = {
            type: buffer.getUint8(),
            channel: buffer.getUint8()
        };

        switch (channelStatus.type) {
            case channelsTypes.BINARY_SENSOR:
                channelStatus.status = getBinarySensorStatus(buffer);
                break;

            case channelsTypes.TEMPERATURE_SENSOR:
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
    const buffer: IBinaryBuffer = new BinaryBuffer(getBufferSize(channelsStatus));

    for ( let index = 0; index < channelsStatus.length; index++ ) {
        const {type, channel, status} = channelsStatus[index];

        buffer.setUint8(type);
        buffer.setUint8(channel);

        switch ( type ) {
            case channelsTypes.BINARY_SENSOR:
                setBinarySensorStatus(status as IBinarySensorStatus, buffer);
                break;

            case channelsTypes.TEMPERATURE_SENSOR:
                setTemperatureSensorStatus(status as ITemperatureSensorStatus, buffer);
                break;

            default:
                break;
        }
    }

    return command.toBytes(id, buffer.data);
};
