/**
 * Uplink command to get get current parameters.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getCurrentStatusMeter from 'jooby-codec/mtx/commands/uplink/getCurrentStatusMeter.js';
 *
 * // simple response
 * const bytes = [
 *     0x00, 0x01, 0x22, 0x50, 0x00, 0x00, 0x87, 0x07, 0x00, 0x0e, 0x99, 0x36, 0x00, 0x00, 0x01, 0x54,
 *     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xb4, 0x61, 0x02, 0x05, 0x01, 0x01, 0x03, 0x01
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
 *     tbadIdiff: 0,
 *     tbadFREQ: 436,
 *     relayStatus: {
 *         RELAY_STATE: true,
 *         RELAY_UBAD: false,
 *         RELAY_UNEQ_CURRENT: false,
 *         RELAY_OFF_CENTER: true,
 *         RELAY_IMAX: true,
 *         RELAY_PMAX: false
 *     },
 *     statusEvent: 2,
 *     statusEvent2: 5,
 *     calEnableFlag: {
 *         calibrationEnable: true,
 *         hardkey: false,
 *         keyPressTest: false,
 *         keyOpenkeyTest: false,
 *         keyGerkonTest: false,
 *         keyOpenKlemaTest: false,
 *         keyOpenModuleTest: false,
 *         keyPress2Test: false
 *     },
 *     curTariff: 1,
 *     curTariffExp: 3,
 *     isSummerTime: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetCurrentStatusMeter.md#response)
 */

import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IExtendedCurrentValues2RelayStatus, extendedCurrentValues2RelayStatusMask} from '../../utils/CommandBinaryBuffer.js';
import * as bitSet from '../../../utils/bitSet.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetCurrentStatusMeterResponseParameters {
    /** Total operating duration of the meter from the first power-on, in seconds. */
    operatingSeconds: types.TUint32,

    /** Duration of poor voltage during the accounting period, in seconds. */
    tbadVAVB: types.TUint32,

    /** Duration of maximum current during the accounting period, in seconds. */
    tbadImaxAll: types.TUint32,

    /** Duration of maximum power during the accounting period, in seconds. */
    tbadPmaxAll: types.TUint32,

    /** Reserved. */
    tbadIdiff: types.TUint32,

    /** Duration of frequency deviation from normal during the accounting period, in seconds. */
    tbadFREQ: types.TUint32,

    /** Relay status. */
    relayStatus: IExtendedCurrentValues2RelayStatus,

    /** Event status. */
    statusEvent: types.TUint8,

    /** Event status 2. */
    statusEvent2: types.TUint8,

    /** Calibration enable flag. */
    calEnableFlag: ICalibrationEnableFlagParameters,

    /** Current tariff `A+`. */
    curTariff: types.TUint8,

    /** Current tariff `A-`. */
    curTariffExp: types.TUint8,

    /** Is it DST or Standard time. */
    isSummerTime: boolean,
}

interface ICalibrationEnableFlagParameters {
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


export const id: types.TCommandId = 0x39;
export const name: types.TCommandName = 'getCurrentStatusMeter';
export const headerSize = 2;
export const maxSize = 31;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

const calibrationEnableFlagMask = {
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
            tbadIdiff: 0,
            tbadFREQ: 436,
            relayStatus: {
                RELAY_STATE: true,
                RELAY_UBAD: false,
                RELAY_UNEQ_CURRENT: false,
                RELAY_OFF_CENTER: true,
                RELAY_IMAX: true,
                RELAY_PMAX: false
            },
            statusEvent: 2,
            statusEvent2: 5,
            calEnableFlag: {
                calibrationEnable: true,
                hardkey: false,
                keyPressTest: false,
                keyOpenkeyTest: false,
                keyGerkonTest: false,
                keyOpenKlemaTest: false,
                keyOpenModuleTest: false,
                keyPress2Test: false
            },
            curTariff: 1,
            curTariffExp: 3,
            isSummerTime: true
        },
        bytes: [
            0x39, 0x1f,
            0x00, 0x01, 0x22, 0x50, 0x00, 0x00, 0x87, 0x07, 0x00, 0x0e, 0x99, 0x36, 0x00, 0x00, 0x01, 0x54,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xb4, 0x61, 0x02, 0x05, 0x01, 0x01, 0x03, 0x01
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

    return {
        operatingSeconds: buffer.getUint32(),
        tbadVAVB: buffer.getUint32(),
        tbadImaxAll: buffer.getUint32(),
        tbadPmaxAll: buffer.getUint32(),
        tbadIdiff: buffer.getUint32(),
        tbadFREQ: buffer.getUint32(),
        relayStatus: bitSet.toObject(extendedCurrentValues2RelayStatusMask, buffer.getUint8()) as unknown as IExtendedCurrentValues2RelayStatus,
        statusEvent: buffer.getUint8(),
        statusEvent2: buffer.getUint8(),
        calEnableFlag: bitSet.toObject(calibrationEnableFlagMask, buffer.getUint8()) as unknown as ICalibrationEnableFlagParameters,
        curTariff: buffer.getUint8(),
        curTariffExp: buffer.getUint8(),
        isSummerTime: !!buffer.getUint8()
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

    // body
    buffer.setUint32(parameters.operatingSeconds);
    buffer.setUint32(parameters.tbadVAVB);
    buffer.setUint32(parameters.tbadImaxAll);
    buffer.setUint32(parameters.tbadPmaxAll);
    buffer.setUint32(parameters.tbadIdiff);
    buffer.setUint32(parameters.tbadFREQ);
    buffer.setUint8(bitSet.fromObject(extendedCurrentValues2RelayStatusMask, (parameters.relayStatus as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(parameters.statusEvent);
    buffer.setUint8(parameters.statusEvent2);
    buffer.setUint8(bitSet.fromObject(calibrationEnableFlagMask, (parameters.calEnableFlag as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(parameters.curTariff);
    buffer.setUint8(parameters.curTariffExp);
    buffer.setUint8(parameters.isSummerTime ? 1 : 0);

    return command.toBytes(id, buffer.data);
};
