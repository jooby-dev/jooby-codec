/**
 * Uplink command to restart PLC modem.
 *
 * The corresponding downlink command: `restart`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as restart from 'jooby-codec/plc/commands/uplink/restart.js';
 *
 * // get feeders status response
 * const bytes = [
 *     0x0e, 0x01, 0x01
 * ];
 *
 * // decoded payload
 * const parameters = restart.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     reason: {
 *        FIREWALL: true
 *        OPTION_BYTE_LOADER: false,
 *        NRST: false,
 *        POWER_ON: false,
 *        SOFTWARE: false,
 *        INDEPENDENT_WATCHDOG: false,
 *        WINDOW_WATCHDOG: false,
 *        LOW_POWER: false
 *     }
 * }
 */

import * as types from '../../types.js';
import * as bitSet from '../../../utils/bitSet.js';
import * as command from '../../../mtx1/utils/command.js';
import {validateFixedCommandPayload} from '../../../utils/validateCommandPayload.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {restart as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 1;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'restart response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            reason: {
                FIREWALL: true,
                OPTION_BYTE_LOADER: false,
                NRST: false,
                POWER_ON: false,
                SOFTWARE: false,
                INDEPENDENT_WATCHDOG: false,
                WINDOW_WATCHDOG: false,
                LOW_POWER: false
            }
        },
        bytes: [
            0x0e, 0x1,
            0x01
        ]
    }
};


const restartReasonMask = {
    FIREWALL: 0x01,
    OPTION_BYTE_LOADER: 0x02,
    NRST: 0x04,
    POWER_ON: 0x08,
    SOFTWARE: 0x10,
    INDEPENDENT_WATCHDOG: 0x20,
    WINDOW_WATCHDOG: 0x40,
    LOW_POWER: 0x80
};

export interface IRestartReason {
    FIREWALL: boolean,
    OPTION_BYTE_LOADER: boolean,
    NRST: boolean,
    POWER_ON: boolean,
    SOFTWARE: boolean,
    INDEPENDENT_WATCHDOG: boolean,
    WINDOW_WATCHDOG: boolean,
    LOW_POWER: boolean
}

export interface IRestartParameters {
    reason: IRestartReason
}


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IRestartParameters => {
    validateFixedCommandPayload(name, bytes, maxSize);

    return {reason: (bitSet.toObject(restartReasonMask, bytes[0]) as unknown) as IRestartReason};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IRestartParameters ): types.TBytes => (
    command.toBytes(
        id,
        [bitSet.fromObject(restartReasonMask, (parameters.reason as unknown) as bitSet.TBooleanObject)]
    )
);
