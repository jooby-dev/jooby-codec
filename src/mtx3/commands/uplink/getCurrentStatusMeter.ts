/**
 * Uplink command to get current parameters.
 *
 * The corresponding downlink command: `getCurrentStatusMeter`.
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
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import {IEventStatus, eventStatusMask} from '../../../mtx1/utils/binary/buffer.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as bitSet from '../../../utils/bitSet.js';
import * as types from '../../types.js';
import {getCurrentStatusMeter as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IRelayStatus {
    /** Current relay state: 1 - on, 0 - off. */
    RELAY_STATE: boolean,

    /** Relay turned off due to poor voltage. */
    RELAY_UBAD: boolean,

    /** Relay turned off due to exceeding allowable power in net balance limit mode. */
    RELAY_SALDO_OFF_ON_MAX_POWER: boolean,

    /** Relay switched off from the control center. */
    RELAY_OFF_CENTER: boolean,

    /** Relay turned off due to maximum current. */
    RELAY_IMAX: boolean,

    /** Relay turned off due to maximum power. */
    RELAY_PMAX: boolean
}

interface IRelayStatus2 {
    /** Relay turned off due to cos φ. */
    RELAY_COSFI: boolean,

    /** Relay turned off due to balance. */
    RELAY_SALDO_OFF_FLAG: boolean,

    /** Relay turned off due to magnet interference. */
    RELAY_MAGNET_OFF: boolean,

    RELAY_HARD_STATE1: boolean,
    RELAY_HARD_STATE2: boolean,
    RELAY_HARD_STATE3: boolean,

    /** Relay turned off due to maximum negative power exceeded. */
    RELAY_P_MINUS_MAX_OFF: boolean

    /** Relay turned off due to maximum reactive power exceeded. */
    RELAY_P_REACTIVE_MAX: boolean
}

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
     * Relay status 2.
     */
    relayStatus2: IRelayStatus2,

    /**
     * Duration of frequency deviation from normal during the billing period, in seconds.
     */
    tbadFREQ: types.TUint32;

    /**
     * Relay status.
     */
    relayStatus: IRelayStatus;

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


const relayStatusMask = {
    RELAY_STATE: 2 ** 0,
    RELAY_UBAD: 2 ** 1,
    RELAY_SALDO_OFF_ON_MAX_POWER: 2 ** 4,
    RELAY_OFF_CENTER: 2 ** 5,
    RELAY_IMAX: 2 ** 6,
    RELAY_PMAX: 2 ** 7
};

const relayStatus2Mask = {
    RELAY_COSFI: 2 ** 0,
    RELAY_SALDO_OFF_FLAG: 2 ** 1,
    RELAY_MAGNET_OFF: 2 ** 2,
    RELAY_HARD_STATE_1: 2 ** 3,
    RELAY_HARD_STATE_2: 2 ** 4,
    RELAY_HARD_STATE_3: 2 ** 5,
    RELAY_P_MINUS_MAX_OFF: 2 ** 6,
    RELAY_P_REACTIVE_MAX: 2 ** 7
};


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
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
            relayStatus2: {
                RELAY_COSFI: false,
                RELAY_SALDO_OFF_FLAG: false,
                RELAY_MAGNET_OFF: false,
                RELAY_HARD_STATE_1: false,
                RELAY_HARD_STATE_2: false,
                RELAY_HARD_STATE_3: false,
                RELAY_P_MINUS_MAX_OFF: false,
                RELAY_P_REACTIVE_MAX: false
            },
            tbadFREQ: 436,
            relayStatus: {
                RELAY_STATE: true,
                RELAY_UBAD: false,
                RELAY_SALDO_OFF_ON_MAX_POWER: false,
                RELAY_OFF_CENTER: false,
                RELAY_IMAX: false,
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
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetCurrentStatusMeterResponseParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    const operatingSeconds = buffer.getUint32();
    const tbadVAAll = buffer.getUint32();
    const tbadVBAll = buffer.getUint32();
    const tbadVCAll = buffer.getUint32();
    const tbadIMAXAll = buffer.getUint32();
    const tbadPMAXAll = buffer.getUint32();
    const relayStatus2 = bitSet.toObject(relayStatus2Mask, buffer.getUint8()) as unknown as IRelayStatus2;

    // reserved bytes
    buffer.getUint8();
    buffer.getUint16();

    const tbadFREQ = buffer.getUint32();
    const relayStatus = bitSet.toObject(relayStatusMask, buffer.getUint8()) as unknown as IRelayStatus;
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
        relayStatus2,
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
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);
    const statusEventValue = bitSet.fromObject(eventStatusMask, (parameters.statusEvent as unknown) as bitSet.TBooleanObject);

    // body
    buffer.setUint32(parameters.operatingSeconds);
    buffer.setUint32(parameters.tbadVAAll);
    buffer.setUint32(parameters.tbadVBAll);
    buffer.setUint32(parameters.tbadVCAll);
    buffer.setUint32(parameters.tbadIMAXAll);
    buffer.setUint32(parameters.tbadPMAXAll);
    buffer.setUint8(bitSet.fromObject(relayStatus2Mask, (parameters.relayStatus2 as unknown) as bitSet.TBooleanObject));

    // reserved bytes
    buffer.setUint8(0);
    buffer.setUint16(0);

    buffer.setUint32(parameters.tbadFREQ);
    buffer.setUint8(bitSet.fromObject(relayStatusMask, (parameters.relayStatus as unknown) as bitSet.TBooleanObject));
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
