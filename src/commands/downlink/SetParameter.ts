/**
 * [[include:commands/downlink/SetParameter.md]]
 *
 * @packageDocumentation
 */

import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directionTypes.js';
import * as deviceParameters from '../../constants/deviceParameters.js';


/**
 * Initial values for pulse devices.
 */
interface IParameterInitialData {
    /**
     * 4 byte int BE
     */
    value: number

    /**
     * 4 byte int BE
     */
    meterValue: number,

    pulseCoefficient: number,
}

interface IParameterInitialDataMultiChannel extends IParameterInitialData {
    /**
     * Channel that accept initial values.
     */
    channel: number
}

interface IParameterAbsoluteDataStatus {
    /* 1 - absolute data sending enabled, 0 - disabled, device send pulse counter  */
    status: number
}

type TParameter =
    IParameterInitialData |
    IParameterInitialDataMultiChannel |
    IParameterAbsoluteDataStatus;

/**
 * SetParameter command parameters
 *
 * @example
 * import {constants} from 'jooby-codec';
 * {id: constants.deviceParameters.INITIAL_DATA, data: {value: 2023, meterValue: 204, pulseCoefficient: 100}}
 */
interface ISetParameterParameters {
    /**
     * Parameter id - one of `constants/deviceParameters`.
     */
    id: number,

    /**
     * Parameter data, different - depending on id.
     */
    data: TParameter
}


const COMMAND_ID = 0x03;
const COMMAND_TITLE = 'SET_PARAMETER';

// max size for current implementation
const COMMAND_MAX_BODY_SIZE = 11;

const byteToPulseCoefficientMap = new Map([
    [0x80, 1000],
    [0x81, 5000],
    [0x82, 100],
    [0x83, 10],
    [0x84, 1],
    [0x85, 0.1],
    [0x86, 0.01]
]);

const pulseCoefficientToByteMap = new Map(
    [...byteToPulseCoefficientMap.entries()].map(([key, value]) => [value, key])
);

const isMSBSet = ( value: number ): boolean => !!(value & 0x80);

const getPulseCoefficient = ( buffer: CommandBinaryBuffer ): number => {
    const pulseCoefficient = buffer.getUint8();

    if ( isMSBSet(pulseCoefficient) ) {
        const value = byteToPulseCoefficientMap.get(pulseCoefficient);

        if ( value ) {
            return value;
        }

        throw new Error('pulseCoefficient MSB is set, but value unknown');
    }

    return pulseCoefficient;
};

const setPulseCoefficient = ( buffer: CommandBinaryBuffer, value: number ): void => {
    if ( pulseCoefficientToByteMap.has(value) ) {
        const byte = pulseCoefficientToByteMap.get(value);

        if ( byte ) {
            buffer.setUint8(byte);
        } else {
            throw new Error('pulseCoefficient MSB is set, but value unknown');
        }
    } else {
        buffer.setUint8(value);
    }
};


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
    constructor ( public parameters: ISetParameterParameters ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly title = COMMAND_TITLE;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const id = buffer.getUint8();
        let parameterData;

        switch ( id ) {
            case deviceParameters.INITIAL_DATA:
                parameterData = {
                    meterValue: buffer.getUint32(false),
                    pulseCoefficient: getPulseCoefficient(buffer),
                    value: buffer.getUint32(false)
                } as IParameterInitialData;
                break;

            case deviceParameters.INITIAL_DATA_MULTI_CHANNEL:
                parameterData = {
                    channel: buffer.getUint8(),
                    meterValue: buffer.getUint32(false),
                    pulseCoefficient: getPulseCoefficient(buffer),
                    value: buffer.getUint32(false)
                } as IParameterInitialData;
                break;

            case deviceParameters.ABSOLUTE_DATA_STATUS:
                parameterData = {
                    status: buffer.getUint8()
                } as IParameterAbsoluteDataStatus;
                break;

            default:
                throw new Error(`${SetParameter.getId()}: parameter ${id} is not supported`);
        }

        return new SetParameter({id, data: parameterData});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {id, data} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_MAX_BODY_SIZE);

        let parameterData;

        buffer.setUint8(id);

        switch ( id ) {
            case deviceParameters.INITIAL_DATA:
                parameterData = data as IParameterInitialData;

                buffer.setUint32(parameterData.meterValue, false);
                setPulseCoefficient(buffer, parameterData.pulseCoefficient);
                buffer.setUint32(parameterData.value, false);
                break;

            case deviceParameters.INITIAL_DATA_MULTI_CHANNEL:
                parameterData = data as IParameterInitialDataMultiChannel;

                buffer.setUint8(parameterData.channel);
                buffer.setUint32(parameterData.meterValue, false);
                setPulseCoefficient(buffer, parameterData.pulseCoefficient);
                buffer.setUint32(parameterData.value, false);
                break;

            case deviceParameters.ABSOLUTE_DATA_STATUS:
                parameterData = data as IParameterAbsoluteDataStatus;

                buffer.setUint8(parameterData.status);
                break;

            default:
                throw new Error(`${SetParameter.getId()}: parameter ${id} is not supported`);
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default SetParameter;
