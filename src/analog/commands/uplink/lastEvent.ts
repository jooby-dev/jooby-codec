/**
 * Command for reporting the last event.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as lastEvent from 'jooby-codec/analog/commands/uplink/lastEvent.js';
 * import * as hardwareTypes from 'jooby-codec/analog/constants/hardwareTypes.js';
 *
 * const bytes = [0x10, 0xe1, 0x01];
 *
 * // decoded payload
 * const parameters = lastEvent.fromBytes(bytes, {hardwareType: hardwareTypes.IMP4EU});
 *
 * console.log(parameters);
 * // output:
 * {
 *     sequenceNumber: 16,
 *     status: {
 *         isBatteryLow: true,
 *         isConnectionLost: false,
 *         isFirstChannelInactive: false,
 *         isSecondChannelInactive: true,
 *         isThirdChannelInactive: true,
 *         isForthChannelInactive: true
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/LastEvent.md)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {TEventStatus, ICommandBinaryBuffer, getEventStatusSize} from '../../utils/CommandBinaryBuffer.js';
import * as hardwareTypes from '../../constants/hardwareTypes.js';


interface ILastEventParameters {
    sequenceNumber: types.TUint8;
    status: TEventStatus;
}

interface ILastEventConfig {
    hardwareType?: number;
}

export const id: types.TCommandId = 0x60;
export const name: types.TCommandName = 'lastEvent';
export const headerSize = 1;

export const examples: command.TCommandExamples = {
    'status for GASI3': {
        id,
        name,
        headerSize,
        parameters: {
            sequenceNumber: 32,
            status: {
                isBatteryLow: true,
                isMagneticInfluence: false,
                isButtonReleased: false,
                isConnectionLost: true
            }
        },
        config: {
            hardwareType: hardwareTypes.GASI3
        },
        bytes: [
            0x62,
            0x20, 0x09
        ]
    },
    'status for IMP4EU': {
        id,
        name,
        headerSize,
        parameters: {
            sequenceNumber: 16,
            status: {
                isBatteryLow: true,
                isConnectionLost: false,
                isFirstChannelInactive: false,
                isSecondChannelInactive: true,
                isThirdChannelInactive: true,
                isForthChannelInactive: true
            }
        },
        config: {
            hardwareType: hardwareTypes.IMP4EU
        },
        bytes: [
            0x63,
            0x10, 0xe1, 0x01
        ]
    },
    'status for IMP4EU (all false)': {
        id,
        name,
        headerSize,
        parameters: {
            sequenceNumber: 16,
            status: {
                isBatteryLow: false,
                isConnectionLost: false,
                isFirstChannelInactive: false,
                isSecondChannelInactive: false,
                isThirdChannelInactive: false,
                isForthChannelInactive: false
            }
        },
        config: {
            hardwareType: hardwareTypes.IMP4EU
        },
        bytes: [
            0x63,
            0x10, 0x80, 0x00
        ]
    },
    'status for MTXLORA': {
        id,
        name,
        headerSize,
        parameters: {
            sequenceNumber: 48,
            status: {
                isMeterCaseOpen: true,
                isMagneticInfluence: true,
                isParametersSetRemotely: false,
                isParametersSetLocally: false,
                isMeterProgramRestarted: false,
                isLockedOut: false,
                isTimeSet: false,
                isTimeCorrected: true,
                isMeterFailure: false,
                isMeterTerminalBoxOpen: true,
                isModuleCompartmentOpen: false,
                isTariffPlanChanged: true,
                isNewTariffPlanReceived: false
            }
        },
        config: {
            hardwareType: hardwareTypes.MTXLORA
        },
        bytes: [
            0x63,
            0x30, 0x83, 0x0a
        ]
    },
    'status for Ultrasound water meter': {
        id,
        name,
        headerSize,
        parameters: {
            sequenceNumber: 48,
            status: {
                event: {
                    transportMode: false,
                    frequencyOutput: false,
                    reverseFlow: true,
                    tamperBreak: false,
                    leakage: true,
                    pipeBreak: true,
                    pipeEmpty: false,
                    batteryDischarge: false
                },
                error: 0
            }
        },
        config: {
            hardwareType: hardwareTypes.US_WATER
        },
        bytes: [
            0x63,
            0x30, 0x34, 0x00
        ]
    }
};

/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @param config - command configuration
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes, config: ILastEventConfig ): ILastEventParameters => {
    if ( !config.hardwareType ) {
        throw new Error('hardwareType in config is mandatory');
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const sequenceNumber = buffer.getUint8();
    const status = buffer.getEventStatus(config.hardwareType);

    return {sequenceNumber, status};
};

/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @param config - command configuration
 * @returns encoded bytes
 */
export const toBytes = ( parameters: ILastEventParameters, config: ILastEventConfig ): types.TBytes => {
    if ( !config.hardwareType ) {
        throw new Error('hardwareType in config is mandatory');
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(
        // sequenceNumber size + status size
        1 + getEventStatusSize(config.hardwareType)
    );
    const {sequenceNumber, status} = parameters;

    buffer.setUint8(sequenceNumber);
    buffer.setEventStatus(config.hardwareType, status);

    return command.toBytes(id, buffer.data);
};
