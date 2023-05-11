import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IParameter} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import * as deviceParameters from '../../constants/deviceParameters.js';
import * as rx2SpreadFactors from '../../constants/rx2SpreadFactors.js';


const COMMAND_ID = 0x03;

const examples: TCommandExampleList = [
    {
        name: 'set minimal reporting data interval to 1 hour',
        parameters: {
            id: deviceParameters.REPORTING_DATA_INTERVAL,
            data: {value: 3600}
        },
        hex: {header: '03 05', body: '01 00 00 00 06'}
    },
    {
        name: 'set day checkout hour to 12:00',
        parameters: {
            id: deviceParameters.DAY_CHECKOUT_HOUR,
            data: {value: 12}
        },
        hex: {header: '03 02', body: '04 0c'}
    },
    {
        name: 'set reporting data type to "day"',
        parameters: {
            id: deviceParameters.REPORTING_DATA_TYPE,
            data: {type: 1}
        },
        hex: {header: '03 02', body: '05 01'}
    },
    {
        name: 'set "with confirmation" for delivery of priority data',
        parameters: {
            id: deviceParameters.PRIORITY_DATA_DELIVERY_TYPE,
            data: {value: 0}
        },
        hex: {header: '03 02', body: '08 00'}
    },
    {
        name: 'set activation method to "ABP"',
        parameters: {
            id: deviceParameters.ACTIVATION_METHOD,
            data: {type: 1}
        },
        hex: {header: '03 02', body: '09 01'}
    },
    {
        name: 'set battery depassivation info',
        parameters: {
            id: deviceParameters.BATTERY_DEPASSIVATION_INFO,
            data: {loadTime: 100, internalResistance: 3222, lowVoltage: 233}
        },
        hex: {header: '03 07', body: '0a 00 64 0c 96 00 e9'}
    },
    {
        name: 'set battery minimal load time to "100"',
        parameters: {
            id: deviceParameters.BATTERY_MINIMAL_LOAD_TIME,
            data: {value: 100}
        },
        hex: {header: '03 05', body: '0b 00 00 00 64'}
    },
    {
        name: 'enable 1-4 channels, and disable serial channel for device',
        parameters: {
            id: deviceParameters.CHANNELS_CONFIG,
            data: {value: 0}
        },
        hex: {header: '03 02', body: '0d 00'}
    },
    {
        name: 'set spread factor and frequency for RX2 window',
        parameters: {
            id: deviceParameters.RX2_CONFIG,
            data: {spreadFactor: rx2SpreadFactors.SF7B125, frequency: 20000}
        },
        hex: {header: '03 05', body: '12 05 00 00 c8'}
    },
    {
        name: 'set absolute data (not multichannel device)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA,
            data: {value: 2023, meterValue: 204, pulseCoefficient: 100}
        },
        hex: {header: '03 0a', body: '17 00 00 00 cc 83 00 00 07 e7'}
    },
    {
        name: 'enable absolute data (not multichannel device)',
        parameters: {id: deviceParameters.ABSOLUTE_DATA_ENABLE, data: {state: 1}},
        hex: {header: '03 02', body: '18 01'}
    },
    {
        name: 'set device serial number',
        parameters: {
            id: deviceParameters.SERIAL_NUMBER,
            data: {value: '1b 0a 3e dc 3e 22'}
        },
        hex: {header: '03 07', body: '19 1b 0a 3e dc 3e 22'}
    },
    {
        name: 'set device geolocation',
        parameters: {
            id: deviceParameters.GEOLOCATION,
            data: {latitude: 34.43, longitude: 43.43, altitude: 23}
        },
        hex: {header: '03 0b', body: '1a 52 b8 09 42 52 b8 2d 42 17 00'}
    },
    {
        name: 'set interval to send EXTRA FRAME',
        parameters: {
            id: deviceParameters.EXTRA_FRAME_INTERVAL,
            data: {value: 3600}
        },
        hex: {header: '03 03', body: '1c 10 0e'}
    },
    {
        name: 'set absolute data for multichannel device (1 channel)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL,
            data: {value: 2032, meterValue: 402, pulseCoefficient: 1000, channel: 1}
        },
        hex: {header: '03 0b', body: '1d 00 00 00 01 92 84 00 00 07 f0'}
    },
    {
        name: 'enable absolute data for multichannel device (2 channel)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL,
            data: {state: 1, channel: 2}
        },
        hex: {header: '03 03', body: '1e 01 01'}
    },
    {
        name: 'set pulse channels config',
        parameters: {
            id: deviceParameters.PULSE_CHANNELS_SCAN_CONFIG,
            data: {channelList: [1, 4], pullUpTime: 18, scanTime: 23}
        },
        hex: {header: '03 04', body: '1f 09 12 17'}
    },
    {
        name: 'enable channels: 1, 2, disable channels: 3, 4, for pulse device',
        parameters: {
            id: deviceParameters.PULSE_CHANNELS_SET_CONFIG,
            data: {channel1: true, channel2: true, channel3: false, channel4: false}
        },
        hex: {header: '03 02', body: '20 03'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetParameter from 'jooby-codec/analog/commands/downlink/SetParameter';
 *
 * const parameters = {id: constants.deviceParameters.ABSOLUTE_DATA, data: {value: 2023, meterValue: 204, pulseCoefficient: 100}};
 * const command = new SetParameter(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 03 0a 17 00 00 00 cc 83 00 00 07 e7
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/downlink/SetParameter.md)
 */
class SetParameter extends Command {
    constructor ( public parameters: IParameter ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetParameter(buffer.getParameter());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getParameterSize(this.parameters));

        buffer.setParameter(this.parameters);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default SetParameter;
