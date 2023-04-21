import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IParameter} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import * as deviceParameters from '../../constants/deviceParameters.js';


const COMMAND_ID = 0x03;

const examples: TCommandExampleList = [
    {
        name: 'set minimal interval for data sending to 1 hour',
        parameters: {
            id: deviceParameters.DATA_SENDING_INTERVAL,
            data: {value: 3600}
        },
        hex: {header: '03 04', body: '01 00 00 06'}
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
        name: 'set output data type to "day"',
        parameters: {
            id: deviceParameters.OUTPUT_DATA_TYPE,
            data: {type: 1}
        },
        hex: {header: '03 02', body: '05 01'}
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
        name: 'initial data setup',
        parameters: {
            id: deviceParameters.INITIAL_DATA,
            data: {value: 2023, meterValue: 204, pulseCoefficient: 100}
        },
        hex: {header: '03 0a', body: '17 00 00 00 cc 82 00 00 07 e7'}
    },
    {
        name: 'enable sending absolute data',
        parameters: {id: deviceParameters.ABSOLUTE_DATA_STATUS, data: {status: 1}},
        hex: {header: '03 02', body: '18 01'}
    },
    {
        name: 'initial data setup for 1 channel',
        parameters: {
            id: deviceParameters.INITIAL_DATA_MULTI_CHANNEL,
            data: {value: 2032, meterValue: 402, pulseCoefficient: 1000, channel: 1}
        },
        hex: {header: '03 0b', body: '1d 01 00 00 01 92 80 00 00 07 f0'}
    },
    {
        name: 'disable sending absolute data from 2 channel',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_STATUS_MULTI_CHANNEL,
            data: {status: 0, channel: 2}
        },
        hex: {header: '03 03', body: '1e 02 00'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetParameter from 'jooby-codec/commands/downlink/SetParameter';
 *
 * const parameters = {id: constants.deviceParameters.INITIAL_DATA, data: {value: 2023, meterValue: 204, pulseCoefficient: 100}};
 * const command = new SetParameter(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 03 0a 17 00 00 00 cc 82 00 00 07 e7
 * ```
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
