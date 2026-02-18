/**
 * Command for reporting new events.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as newEvent from 'jooby-codec/analog/commands/uplink/newEvent.js';
 *
 * // event for MAGNET_ON
 * const bytes = [0x01, 0x02, 0x2b, 0xc0, 0x31, 0x60];
 *
 * // decoded payload
 * const parameters = newEvent.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     id: 1,
 *     sequenceNumber: 2,
 *     data: {time2000: 734015840}
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/NewEvent.md)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import * as events from '../../constants/events.js';
import eventNames from '../../constants/eventNames.js';
import * as hardwareTypes from '../../constants/hardwareTypes.js';
import {TTime2000} from '../../utils/time.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    IEventMtxStatus,
    IEventUSWaterMeterStatus,
    getExtendedValue,
    setExtendedValue,
    getTime,
    setTime,
    getChannelValue,
    setChannelValue,
    getEventStatus,
    setEventStatus
} from '../../utils/CommandBinaryBuffer.js';
import getHexFromBytes from '../../../utils/getHexFromBytes.js';
import getBytesFromHex from '../../../utils/getBytesFromHex.js';
import {newEvent as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IEventBase {}

interface IEventTime extends IEventBase {
    time2000: TTime2000;
}

interface IEventBatteryAlarm extends IEventBase {
    voltage: number;
}

/**
 * MTX meters activation event.
 */
interface IEventActivateMtx extends IEventTime {
    /**
     * hex string, 8 bytes contains unique meter ID
     * @example
     * '00 1A 79 88 17 01 23 56'
     */
    deviceId: string;
}

interface IEventConnection extends IEventBase {
    channel: number;
    value: number;
}

interface IEventMtx extends IEventBase {
    status: IEventMtxStatus;
}

interface IEventBinarySensor extends IEventBase {
    time2000: TTime2000;
    channel: types.TUint8
}

interface IEventTemperatureSensor extends IEventBase {
    time2000: TTime2000;
    channel: types.TUint8,
    temperature: types.TInt8
}

interface IEventUSWater extends IEventBase {
    time2000: TTime2000;
    status: IEventUSWaterMeterStatus;
}

interface IEventDepass extends IEventBase {
    /** depassivation duration (in seconds) */
    duration: types.TUint32;

    /**
     * `1` - successful completion
     * `2` - completed due to timeout
     * `4` - internal battery resistance stopped decreasing
     */
    status: types.TUint8,

    /** battery voltage without load */
    noLoadBatteryVoltage: number,

    /** battery voltage under load of the depassivation resistor */
    loadBatteryVoltage: number,

    /** internal battery resistance value */
    internalResistance: types.TUint16
}

type TEventData =
    IEventTime |
    IEventBatteryAlarm |
    IEventActivateMtx |
    IEventConnection |
    IEventMtx |
    IEventBinarySensor |
    IEventTemperatureSensor |
    IEventUSWater;

/**
 * NewEvent command parameters.
 */
interface INewEventParameters {
    id: number;
    name: string,
    sequenceNumber: types.TUint8;
    data: TEventData;
}

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

// ACTIVATE_MTX are biggest,1 byte event id, 1 byte sequence number, 4 bytes time, 8 bytes mtx address
const COMMAND_BODY_MAX_SIZE = 14;
const MTX_ADDRESS_SIZE = 8;

export const examples: command.TCommandExamples = {
    'event for MAGNET_ON': {
        id,
        name,
        headerSize,
        parameters: {
            id: 1,
            name: 'MAGNET_ON',
            sequenceNumber: 2,
            data: {time2000: 734015840}
        },
        bytes: [
            0x15, 0x06,
            0x01, 0x02, 0x2b, 0xc0, 0x31, 0x60
        ]
    },
    'event for BATTERY_ALARM': {
        id,
        name,
        headerSize,
        parameters: {
            id: 5,
            name: 'BATTERY_ALARM',
            sequenceNumber: 2,
            data: {voltage: 3308}
        },
        bytes: [
            0x15, 0x04,
            0x05, 0x02, 0x0c, 0xec
        ]
    },
    'event for ACTIVATE_MTX': {
        id,
        name,
        headerSize,
        parameters: {
            id: 11,
            name: 'ACTIVATE_MTX',
            sequenceNumber: 2,
            data: {time2000: 734015840, deviceId: '00 1a 79 88 17 01 23 56'}
        },
        bytes: [
            0x15, 0x0e,
            0x0b, 0x02, 0x2b, 0xc0, 0x31, 0x60, 0x00, 0x1a, 0x79, 0x88, 0x17, 0x01, 0x23, 0x56
        ]
    },
    'event for WATER_EVENT': {
        id,
        name,
        headerSize,
        parameters: {
            id: 19,
            name: 'WATER_EVENT',
            sequenceNumber: 46,
            data: {
                time2000: 798110025,
                status: {
                    event: {
                        transportMode: false,
                        frequencyOutput: false,
                        reverseFlow: true,
                        tamperBreak: false,
                        leakage: false,
                        pipeBreak: false,
                        pipeEmpty: false,
                        batteryDischarge: false
                    },
                    error: 0
                }
            }
        },
        bytes: [
            0x15, 0x08,
            0x13, 0x2e, 0x2f, 0x92, 0x31, 0x49, 0x04, 0x00
        ]
    },
    'event for CONNECT': {
        id,
        name,
        headerSize,
        parameters: {
            id: 12,
            name: 'CONNECT',
            sequenceNumber: 2,
            data: {channel: 1, value: 131}
        },
        bytes: [
            0x15, 0x05,
            0x0c, 0x02, 0x00, 0x83, 0x01
        ]
    },
    'event for DISCONNECT': {
        id,
        name,
        headerSize,
        parameters: {
            id: 13,
            name: 'DISCONNECT',
            sequenceNumber: 2,
            data: {channel: 1, value: 131}
        },
        bytes: [
            0x15, 0x05,
            0x0d, 0x02, 0x00, 0x83, 0x01
        ]
    },
    'event for DEPASS_DONE': {
        id,
        name,
        headerSize,
        parameters: {
            id: 14,
            name: 'DEPASS_DONE',
            sequenceNumber: 107,
            data: {
                duration: 83,
                status: 4,
                noLoadBatteryVoltage: 3564,
                loadBatteryVoltage: 2748,
                internalResistance: 44541
            }
        },
        bytes: [
            0x15, 0x0c,
            0x0e, 0x6b,
            0x00, 0x00, 0x00, 0x53, 0x04, 0xde, 0xca, 0xbc, 0xad, 0xfd
        ]
    },
    'event for EV_MTX': {
        id,
        name,
        headerSize,
        parameters: {
            id: 17,
            name: 'MTX',
            sequenceNumber: 2,
            data: {
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
                    isNewTariffPlanReceived: false,
                    isElectromagneticInfluenceReset: false,
                    isMagneticInfluenceReset: false
                }
            }
        },
        bytes: [
            0x15, 0x04,
            0x11, 0x02, 0x83, 0x0a
        ]
    }
};


const getVoltage = ( buffer: IBinaryBuffer ): number => buffer.getUint16();
const setVoltage = ( buffer: IBinaryBuffer, value: number ): void => buffer.setUint16(value);

const getDeviceId = ( buffer: IBinaryBuffer ): string => (
    getHexFromBytes(buffer.getBytes(MTX_ADDRESS_SIZE))
);

const setDeviceId = ( buffer: IBinaryBuffer, value: string ): void => {
    getBytesFromHex(value).forEach(byte => buffer.setUint8(byte));
};

const getBatteryVoltageValues = ( buffer: IBinaryBuffer ): {noLoadBatteryVoltage:number, loadBatteryVoltage:number} => {
    const byte1 = buffer.getUint8();
    const byte2 = buffer.getUint8();
    const byte3 = buffer.getUint8();

    // first 12-bit value
    const noLoadBatteryVoltage = (byte1 << 4) | (byte2 >> 4);

    // second 12-bit value
    const loadBatteryVoltage = ((byte2 & 0x0f) << 8) | byte3;

    return {noLoadBatteryVoltage, loadBatteryVoltage};
};

const setBatteryVoltageValues = ( buffer: IBinaryBuffer, noLoadBatteryVoltage: number, loadBatteryVoltage: number ): void => {
    // ensure values fit in 12 bits
    const value0 = noLoadBatteryVoltage & 0x0fff;
    const value1 = loadBatteryVoltage & 0x0fff;

    // byte 0: 8 most significant bits of noLoadBatteryVoltage
    const byte0 = value0 >> 4;

    // byte 1: 4 least significant bits of noLoadBatteryVoltage + 4 most significant bits of loadBatteryVoltage
    const byte1 = ((value0 & 0x0f) << 4) | (value1 >> 8);

    // byte 2: 8 least significant bits of loadBatteryVoltage
    const byte2 = value1 & 0xff;

    [byte0, byte1, byte2].forEach(byte => buffer.setUint8(byte));
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): INewEventParameters => {
    if ( bytes.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const eventId = buffer.getUint8();
    const eventName = eventNames[eventId];
    const sequenceNumber = buffer.getUint8();
    let eventData;

    switch ( eventId ) {
        case events.MAGNET_ON:
        case events.MAGNET_OFF:
        case events.ACTIVATE:
        case events.DEACTIVATE:
        case events.CAN_OFF:
        case events.INSERT:
        case events.REMOVE:
        case events.COUNTER_OVER:
        case events.OPTOLOW:
        case events.OPTOFLASH:
        case events.JOIN_ACCEPT:
        case events.WATER_NO_RESPONSE:
        case events.OPTOSENSOR_ERROR:
            eventData = {time2000: getTime(buffer)};
            break;

        case events.DEPASS_DONE:
            eventData = {
                duration: buffer.getUint32(),
                status: buffer.getUint8(),
                ...getBatteryVoltageValues(buffer),
                internalResistance: buffer.getUint16()
            };
            break;

        case events.BATTERY_ALARM:
            eventData = {voltage: getVoltage(buffer)};
            break;

        case events.ACTIVATE_MTX:
            eventData = {time2000: getTime(buffer), deviceId: getDeviceId(buffer)};
            break;

        case events.CONNECT:
        case events.DISCONNECT:
            eventData = {channel: buffer.getUint8() + 1, value: getExtendedValue(buffer)};
            break;

        case events.MTX:
            eventData = {status: getEventStatus(buffer, hardwareTypes.MTXLORA)};
            break;

        case events.BINARY_SENSOR_ON:
        case events.BINARY_SENSOR_OFF:
            eventData = {time2000: getTime(buffer), channel: getChannelValue(buffer)};
            break;

        case events.TEMPERATURE_SENSOR_HYSTERESIS:
        case events.TEMPERATURE_SENSOR_LOW_TEMPERATURE:
        case events.TEMPERATURE_SENSOR_HIGH_TEMPERATURE:
            eventData = {time2000: getTime(buffer), channel: getChannelValue(buffer), temperature: buffer.getInt8()};
            break;

        case events.WATER_EVENT:
            eventData = {time2000: getTime(buffer), status: getEventStatus(buffer, hardwareTypes.US_WATER)};
            break;

        default:
            throw new Error(`Event ${eventId} is not supported`);
    }

    return {id: eventId, name: eventName, sequenceNumber, data: eventData};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: INewEventParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_MAX_SIZE, false);
    const {id: eventId, sequenceNumber, data} = parameters;

    buffer.setUint8(eventId);
    buffer.setUint8(sequenceNumber);

    switch ( eventId ) {
        case events.MAGNET_ON:
        case events.MAGNET_OFF:
        case events.ACTIVATE:
        case events.DEACTIVATE:
        case events.CAN_OFF:
        case events.INSERT:
        case events.REMOVE:
        case events.COUNTER_OVER:
        case events.OPTOLOW:
        case events.OPTOFLASH:
        case events.JOIN_ACCEPT:
        case events.WATER_NO_RESPONSE:
        case events.OPTOSENSOR_ERROR:
            setTime(buffer, (data as IEventTime).time2000);
            break;

        case events.DEPASS_DONE:
            buffer.setUint32((data as IEventDepass).duration);
            buffer.setUint8((data as IEventDepass).status);
            setBatteryVoltageValues(buffer, (data as IEventDepass).noLoadBatteryVoltage, (data as IEventDepass).loadBatteryVoltage);
            buffer.setUint16((data as IEventDepass).internalResistance);
            break;

        case events.BATTERY_ALARM:
            setVoltage(buffer, (data as IEventBatteryAlarm).voltage);
            break;

        case events.ACTIVATE_MTX:
            setTime(buffer, (data as IEventActivateMtx).time2000);
            setDeviceId(buffer, (data as IEventActivateMtx).deviceId);
            break;

        case events.CONNECT:
        case events.DISCONNECT:
            buffer.setUint8((data as IEventConnection).channel - 1);
            setExtendedValue(buffer, (data as IEventConnection).value);
            break;

        case events.MTX:
            setEventStatus(buffer, hardwareTypes.MTXLORA, (data as IEventMtx).status);
            break;

        case events.BINARY_SENSOR_ON:
        case events.BINARY_SENSOR_OFF:
            setTime(buffer, (data as IEventBinarySensor).time2000);
            setChannelValue(buffer, (data as IEventBinarySensor).channel);
            break;

        case events.TEMPERATURE_SENSOR_HYSTERESIS:
        case events.TEMPERATURE_SENSOR_LOW_TEMPERATURE:
        case events.TEMPERATURE_SENSOR_HIGH_TEMPERATURE:
            setTime(buffer, (data as IEventTemperatureSensor).time2000);
            setChannelValue(buffer, (data as IEventTemperatureSensor).channel);
            buffer.setInt8((data as IEventTemperatureSensor).temperature);
            break;

        case events.WATER_EVENT:
            setTime(buffer, (data as IEventUSWater).time2000);
            setEventStatus(buffer, hardwareTypes.US_WATER, (data as IEventUSWater).status);
            break;

        default:
            throw new Error(`Event ${eventId} is not supported`);
    }

    return command.toBytes(id, buffer.getBytesToOffset());
};
