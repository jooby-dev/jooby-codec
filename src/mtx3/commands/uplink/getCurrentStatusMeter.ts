/**
 * Uplink command to get current parameters.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getCurrentStatusMeter from 'jooby-codec/mtx3/commands/uplink/getCurrentStatusMeter.js';
 *
 * // simple response
 * const bytes = [
 *     0x00, 0x01, 0x22, 0x50, 0x00, 0x00, 0x87, 0x07, 0x00, 0x00, 0x30, 0x39, 0x00, 0x01, 0x09, 0x32,
 *     0x00, 0x0e, 0x99, 0x36, 0x00, 0x00, 0x01, 0x54, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xb4,
 *     0x01, 0x85, 0x01, 0x01, 0x01, 0x02, 0x03, 0x10, 0x01
 * ];
 *
 * // decoded payload
 * const parameters = getCurrentStatusMeter.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     operatingSeconds: 74320,
 *     tbadVAAll: 34567,
 *     tbadVBAll: 12345,
 *     tbadVCAll: 67890,
 *     tbadIMAXAll: 956726,
 *     tbadPMAXAll: 340,
 *     tbadFREQ: 436,
 *     relayStatus: true,
 *     statusEvent: {
 *         CASE_OPEN: true,
 *         MAGNETIC_ON: false,
 *         PARAMETERS_UPDATE_REMOTE: true,
 *         PARAMETERS_UPDATE_LOCAL: false,
 *         RESTART: false,
 *         ERROR_ACCESS: false,
 *         TIME_SET: false,
 *         TIME_CORRECT: true,
 *         DEVICE_FAILURE: false,
 *         CASE_TERMINAL_OPEN: false,
 *         CASE_MODULE_OPEN: false,
 *         TARIFF_TABLE_SET: false,
 *         TARIFF_TABLE_GET: true,
 *         PROTECTION_RESET_EM: false,
 *         PROTECTION_RESET_MAGNETIC: false
 *     },
 *     centerAlert: true,
 *     calEnableFlag: true,
 *     currentTariffs: {
 *         'A+': 1,
 *         maximumPowers: 2,
 *         'A-': 3
 *     },
 *     isSummerTime: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetCurrentStatusMeter.md#response)
 */

import * as command from '../../../mtx1/utils/command.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import {IEventStatus, eventStatusMask} from '../../../mtx1/utils/CommandBinaryBuffer.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import * as bitSet from '../../../utils/bitSet.js';
import * as types from '../../types.js';


interface ITariffs {
    /**
     * Tariff for the group of consumed energies (`1st` grid).
     */
    'A+': types.TUint8;

    /**
     * Tariff for the group of maximum powers (`2nd` grid).
     */
    maximumPowers: types.TUint8;

    /**
     * Tariff for the group of generated energies (`3rd` grid).
     */
    'A-': types.TUint8;
}

interface IGetCurrentStatusMeterResponseParameters {
    /**
     * Total operating duration of the meter since first power-on, in seconds.
     */
    operatingSeconds: types.TUint32;

    /**
     * Duration of poor voltage in phase A during the billing period, in seconds.
     */
    tbadVAAll: types.TUint32;

    /**
     * Duration of poor voltage in phase B during the billing period, in seconds.
     */
    tbadVBAll: types.TUint32;

    /**
     * Duration of poor voltage in phase C during the billing period, in seconds.
     */
    tbadVCAll: types.TUint32;

    /**
     * Duration of maximum current during the billing period, in seconds.
     */
    tbadIMAXAll: types.TUint32;

    /**
     * Duration of maximum power during the billing period, in seconds.
     */
    tbadPMAXAll: types.TUint32;

    /**
     * Duration of frequency deviation from normal during the billing period, in seconds.
     */
    tbadFREQ: types.TUint32;

    /**
     * Relay state.
     *
     * `true` - on
     */
    relayStatus: boolean;

    /**
     * Critical event status.
     */
    statusEvent: IEventStatus;

    /**
     * Alert from the central system.
     *
     * `true` indicates an alert from the center
     */
    centerAlert: boolean;

    /**
     * Calibration enable flag.
     */
    calEnableFlag: boolean;

    /**
     * Current tariffs for the 1st to 3rd tariff grids.
     */
    currentTariffs: ITariffs;

    /**
     * Is it DST or Standard time.
     */
    isSummerTime: boolean;
}


export const id: types.TCommandId = 0x39;
export const name: types.TCommandName = 'getCurrentStatusMeter';
export const headerSize = 2;
export const maxSize = 41;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;


export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            operatingSeconds: 74320,
            tbadVAAll: 34567,
            tbadVBAll: 12345,
            tbadVCAll: 67890,
            tbadIMAXAll: 956726,
            tbadPMAXAll: 340,
            tbadFREQ: 436,
            relayStatus: true,
            statusEvent: {
                CASE_OPEN: true,
                MAGNETIC_ON: false,
                PARAMETERS_UPDATE_REMOTE: true,
                PARAMETERS_UPDATE_LOCAL: false,
                RESTART: false,
                ERROR_ACCESS: false,
                TIME_SET: false,
                TIME_CORRECT: true,
                DEVICE_FAILURE: false,
                CASE_TERMINAL_OPEN: false,
                CASE_MODULE_OPEN: false,
                TARIFF_TABLE_SET: false,
                TARIFF_TABLE_GET: true,
                PROTECTION_RESET_EM: false,
                PROTECTION_RESET_MAGNETIC: false
            },
            centerAlert: true,
            calEnableFlag: true,
            currentTariffs: {
                'A+': 1,
                maximumPowers: 2,
                'A-': 3
            },
            isSummerTime: true
        },
        bytes: [
            0x39, 0x29,
            0x00, 0x01, 0x22, 0x50,
            0x00, 0x00, 0x87, 0x07,
            0x00, 0x00, 0x30, 0x39,
            0x00, 0x01, 0x09, 0x32,
            0x00, 0x0e, 0x99, 0x36,
            0x00, 0x00, 0x01, 0x54,
            0x00, 0x00, 0x00, 0x00, // reserved
            0x00, 0x00, 0x01, 0xb4,
            0x01,
            0x85, // statusEvent part 1
            0x01,
            0x01,
            0x01,
            0x02,
            0x03,
            0x10, // statusEvent part 2
            0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetCurrentStatusMeterResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    const operatingSeconds = buffer.getUint32();
    const tbadVAAll = buffer.getUint32();
    const tbadVBAll = buffer.getUint32();
    const tbadVCAll = buffer.getUint32();
    const tbadIMAXAll = buffer.getUint32();
    const tbadPMAXAll = buffer.getUint32();

    // reserved
    buffer.getUint32();

    const tbadFREQ = buffer.getUint32();
    const relayStatus = !!(buffer.getUint8() & 1);
    const statusEvent1 = buffer.getUint8();
    const centerAlert = !!(buffer.getUint8() & 1);
    const calEnableFlag = !!(buffer.getUint8() & 1);
    const currentTariffs = {
        'A+': buffer.getUint8(),
        maximumPowers: buffer.getUint8(),
        'A-': buffer.getUint8()
    };

    const statusEvent2 = buffer.getUint8();
    const isSummerTime = !!(buffer.getUint8() & 1);

    const statusEventValue = statusEvent1 | (statusEvent2 << 8);

    return {
        operatingSeconds,
        tbadVAAll,
        tbadVBAll,
        tbadVCAll,
        tbadIMAXAll,
        tbadPMAXAll,
        tbadFREQ,
        relayStatus,
        statusEvent: (bitSet.toObject(eventStatusMask, statusEventValue) as unknown) as IEventStatus,
        centerAlert,
        calEnableFlag,
        currentTariffs,
        isSummerTime
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetCurrentStatusMeterResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);
    const statusEventValue = bitSet.fromObject(eventStatusMask, (parameters.statusEvent as unknown) as bitSet.TBooleanObject);

    // body
    buffer.setUint32(parameters.operatingSeconds);
    buffer.setUint32(parameters.tbadVAAll);
    buffer.setUint32(parameters.tbadVBAll);
    buffer.setUint32(parameters.tbadVCAll);
    buffer.setUint32(parameters.tbadIMAXAll);
    buffer.setUint32(parameters.tbadPMAXAll);

    // reserved
    buffer.setUint32(0);

    buffer.setUint32(parameters.tbadFREQ);
    buffer.setUint8(parameters.relayStatus ? 1 : 0);
    buffer.setUint8(statusEventValue & 0xff);
    buffer.setUint8(parameters.centerAlert ? 1 : 0);
    buffer.setUint8(parameters.calEnableFlag ? 1 : 0);
    buffer.setUint8(parameters.currentTariffs['A+']);
    buffer.setUint8(parameters.currentTariffs.maximumPowers);
    buffer.setUint8(parameters.currentTariffs['A-']);
    buffer.setUint8((statusEventValue >> 8) & 0xff);
    buffer.setUint8(parameters.isSummerTime ? 1 : 0);

    return command.toBytes(id, buffer.data);
};
