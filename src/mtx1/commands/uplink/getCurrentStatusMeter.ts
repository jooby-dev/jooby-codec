/**
 * Uplink command to get current parameters.
 *
 * The corresponding downlink command: `getCurrentStatusMeter`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getCurrentStatusMeter from 'jooby-codec/mtx1/commands/uplink/getCurrentStatusMeter.js';
 *
 * // simple response
 * const bytes = [
 *     0x00, 0x01, 0x22, 0x50, 0x00, 0x00, 0x87, 0x07, 0x00, 0x0e, 0x99, 0x36, 0x00, 0x00, 0x01, 0x54,
 *     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xb4, 0x61, 0x85, 0x10, 0x01, 0x01, 0x03, 0x01
 * ];
 *
 * // decoded payload
 * const parameters = getCurrentStatusMeter.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     operatingSeconds: 74320,
 *     tbadVAVB: 34567,
 *     tbadImaxAll: 956726,
 *     tbadPmaxAll: 340,
 *     tbadFREQ: 436,
 *     relayStatus: {
 *         RELAY_STATE: true,
 *         RELAY_UBAD: false,
 *         RELAY_UNEQ_CURRENT: false,
 *         RELAY_OFF_CENTER: true,
 *         RELAY_IMAX: true,
 *         RELAY_PMAX: false
 *     },
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
 *     calibrationFlags: {
 *         calibrationEnable: true,
 *         hardkey: false,
 *         keyPressTest: false,
 *         keyOpenkeyTest: false,
 *         keyGerkonTest: false,
 *         keyOpenKlemaTest: false,
 *         keyOpenModuleTest: false,
 *         keyPress2Test: false
 *     },
 *     currentTariffs: {
 *         'A+': 1,
 *         'A-': 3
 *     },
 *     isSummerTime: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetCurrentStatusMeter.md#response)
 */

import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    IExtendedCurrentValues2RelayStatus,
    IEventStatus,
    extendedCurrentValues2RelayStatusMask,
    eventStatusMask
} from '../../utils/CommandBinaryBuffer.js';
import * as bitSet from '../../../utils/bitSet.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getCurrentStatusMeter as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetCurrentStatusMeterResponseParameters {
    /** Total operating duration of the meter from the first power-on, in seconds. */
    operatingSeconds: types.TUint32,

    /** Duration of poor voltage during the accounting period, in seconds. */
    tbadVAVB: types.TUint32,

    /** Duration of maximum current during the accounting period, in seconds. */
    tbadImaxAll: types.TUint32,

    /** Duration of maximum power during the accounting period, in seconds. */
    tbadPmaxAll: types.TUint32,

    /** Duration of frequency deviation from normal during the accounting period, in seconds. */
    tbadFREQ: types.TUint32,

    /** Relay status. */
    relayStatus: IExtendedCurrentValues2RelayStatus,

    /** Critical event status. */
    statusEvent: IEventStatus,

    /** Calibration enable flag. */
    calibrationFlags: ICalibrationFlags,

    currentTariffs: ITariffs,

    /** Is it DST or Standard time. */
    isSummerTime: boolean
}

interface ICalibrationFlags {
    /** Is calibration enabled or not. */
    calibrationEnable: boolean,

    /** For factory testing only.  */
    hardkey: boolean,

    /** For factory testing only.  */
    keyPressTest: boolean,

    /** For factory testing only.  */
    keyOpenkeyTest: boolean,

    /** For factory testing only.  */
    keyGerkonTest: boolean,

    /** For factory testing only.  */
    keyOpenKlemaTest: boolean,

    /** For factory testing only.  */
    keyOpenModuleTest: boolean,

    /** For factory testing only.  */
    keyPress2Test: boolean
}

interface ITariffs {
    /** Current tariff `A+`. */
    'A+': types.TUint8;

    /** Current tariff `A-`. */
    'A-': types.TUint8;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 31;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

const calibrationFlagsMask = {
    calibrationEnable: 0x01,
    hardkey: 0x02,
    keyPressTest: 0x04,
    keyOpenkeyTest: 0x08,
    keyGerkonTest: 0x10,
    keyOpenKlemaTest: 0x20,
    keyOpenModuleTest: 0x40,
    keyPress2Test: 0x80
};

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            operatingSeconds: 74320,
            tbadVAVB: 34567,
            tbadImaxAll: 956726,
            tbadPmaxAll: 340,
            tbadFREQ: 436,
            relayStatus: {
                RELAY_STATE: true,
                RELAY_UBAD: false,
                RELAY_UNEQ_CURRENT: false,
                RELAY_OFF_CENTER: true,
                RELAY_IMAX: true,
                RELAY_PMAX: false
            },
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
            calibrationFlags: {
                calibrationEnable: true,
                hardkey: false,
                keyPressTest: false,
                keyOpenkeyTest: false,
                keyGerkonTest: false,
                keyOpenKlemaTest: false,
                keyOpenModuleTest: false,
                keyPress2Test: false
            },
            currentTariffs: {
                'A+': 1,
                'A-': 3
            },
            isSummerTime: true
        },
        bytes: [
            0x39, 0x1f,
            0x00, 0x01, 0x22, 0x50, 0x00, 0x00, 0x87, 0x07, 0x00, 0x0e, 0x99, 0x36, 0x00, 0x00, 0x01, 0x54,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xb4, 0x61, 0x85, 0x10, 0x01, 0x01, 0x03, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetCurrentStatusMeterResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    const operatingSeconds = buffer.getUint32();
    const tbadVAVB = buffer.getUint32();
    const tbadImaxAll = buffer.getUint32();
    const tbadPmaxAll = buffer.getUint32();

    // reserved
    buffer.getUint32();

    const tbadFREQ = buffer.getUint32();
    const relayStatus = bitSet.toObject(extendedCurrentValues2RelayStatusMask, buffer.getUint8()) as unknown as IExtendedCurrentValues2RelayStatus;
    const statusEvent1 = buffer.getUint8();
    const statusEvent2 = buffer.getUint8();
    const calibrationFlags = bitSet.toObject(calibrationFlagsMask, buffer.getUint8()) as unknown as ICalibrationFlags;
    const currentTariffs = {
        'A+': buffer.getUint8(),
        'A-': buffer.getUint8()
    };

    const isSummerTime = !!(buffer.getUint8() & 1);

    const statusEventValue = statusEvent1 | (statusEvent2 << 8);

    return {
        operatingSeconds,
        tbadVAVB,
        tbadImaxAll,
        tbadPmaxAll,
        tbadFREQ,
        relayStatus,
        statusEvent: (bitSet.toObject(eventStatusMask, statusEventValue) as unknown) as IEventStatus,
        calibrationFlags,
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
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);
    const statusEventValue = bitSet.fromObject(eventStatusMask, (parameters.statusEvent as unknown) as bitSet.TBooleanObject);

    // body
    buffer.setUint32(parameters.operatingSeconds);
    buffer.setUint32(parameters.tbadVAVB);
    buffer.setUint32(parameters.tbadImaxAll);
    buffer.setUint32(parameters.tbadPmaxAll);

    // reserved
    buffer.setUint32(0);

    buffer.setUint32(parameters.tbadFREQ);
    buffer.setUint8(bitSet.fromObject(extendedCurrentValues2RelayStatusMask, (parameters.relayStatus as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(statusEventValue & 0xff);
    buffer.setUint8((statusEventValue >> 8) & 0xff);
    buffer.setUint8(bitSet.fromObject(calibrationFlagsMask, (parameters.calibrationFlags as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(parameters.currentTariffs['A+']);
    buffer.setUint8(parameters.currentTariffs['A-']);
    buffer.setUint8(parameters.isSummerTime ? 1 : 0);

    return command.toBytes(id, buffer.data);
};
