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
import CommandBinaryBuffer, {ICommandBinaryBuffer, IEventMtxStatus, IEventUSWaterMeterStatus} from '../../utils/CommandBinaryBuffer.js';
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
            0x15, 0x08, 0x13, 0x2e, 0x2f, 0x92, 0x31, 0x49, 0x04, 0x00
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
                    isNewTariffPlanReceived: false
                }
            }
        },
        bytes: [
            0x15, 0x04,
            0x11, 0x02, 0x83, 0x0a
        ]
    }
};


const getVoltage = ( buffer: ICommandBinaryBuffer ): number => buffer.getUint16();
const setVoltage = ( buffer: ICommandBinaryBuffer, value: number ): void => buffer.setUint16(value);

const getDeviceId = ( buffer: ICommandBinaryBuffer ): string => (
    getHexFromBytes(buffer.getBytes(MTX_ADDRESS_SIZE))
);

const setDeviceId = ( buffer: ICommandBinaryBuffer, value: string ): void => {
    getBytesFromHex(value).forEach(byte => buffer.setUint8(byte));
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): INewEventParameters => {
    if ( data.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
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
        case events.DEPASS_DONE:
        case events.WATER_NO_RESPONSE:
        case events.OPTOSENSOR_ERROR:
            eventData = {time2000: buffer.getTime()};
            break;

        case events.BATTERY_ALARM:
            eventData = {voltage: getVoltage(buffer)};
            break;

        case events.ACTIVATE_MTX:
            eventData = {time2000: buffer.getTime(), deviceId: getDeviceId(buffer)};
            break;

        case events.CONNECT:
        case events.DISCONNECT:
            eventData = {channel: buffer.getUint8() + 1, value: buffer.getExtendedValue()};
            break;

        case events.MTX:
            eventData = {status: buffer.getEventStatus(hardwareTypes.MTXLORA)};
            break;

        case events.BINARY_SENSOR_ON:
        case events.BINARY_SENSOR_OFF:
            eventData = {time2000: buffer.getTime(), channel: buffer.getChannelValue()};
            break;

        case events.TEMPERATURE_SENSOR_HYSTERESIS:
        case events.TEMPERATURE_SENSOR_LOW_TEMPERATURE:
        case events.TEMPERATURE_SENSOR_HIGH_TEMPERATURE:
            eventData = {time2000: buffer.getTime(), channel: buffer.getChannelValue(), temperature: buffer.getInt8()};
            break;

        case events.WATER_EVENT:
            eventData = {time2000: buffer.getTime(), status: buffer.getEventStatus(hardwareTypes.US_WATER)};
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
 * @returns encoded bytes
 */
export const toBytes = ( parameters: INewEventParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
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
        case events.DEPASS_DONE:
        case events.WATER_NO_RESPONSE:
        case events.OPTOSENSOR_ERROR:
            buffer.setTime((data as IEventTime).time2000);
            break;

        case events.BATTERY_ALARM:
            setVoltage(buffer, (data as IEventBatteryAlarm).voltage);
            break;

        case events.ACTIVATE_MTX:
            buffer.setTime((data as IEventActivateMtx).time2000);
            setDeviceId(buffer, (data as IEventActivateMtx).deviceId);
            break;

        case events.CONNECT:
        case events.DISCONNECT:
            buffer.setUint8((data as IEventConnection).channel - 1);
            buffer.setExtendedValue((data as IEventConnection).value);
            break;

        case events.MTX:
            buffer.setEventStatus(hardwareTypes.MTXLORA, (data as IEventMtx).status);
            break;

        case events.BINARY_SENSOR_ON:
        case events.BINARY_SENSOR_OFF:
            buffer.setTime((data as IEventBinarySensor).time2000);
            buffer.setChannelValue((data as IEventBinarySensor).channel);
            break;

        case events.TEMPERATURE_SENSOR_HYSTERESIS:
        case events.TEMPERATURE_SENSOR_LOW_TEMPERATURE:
        case events.TEMPERATURE_SENSOR_HIGH_TEMPERATURE:
            buffer.setTime((data as IEventTemperatureSensor).time2000);
            buffer.setChannelValue((data as IEventTemperatureSensor).channel);
            buffer.setInt8((data as IEventTemperatureSensor).temperature);
            break;

        case events.WATER_EVENT:
            buffer.setTime((data as IEventUSWater).time2000);
            buffer.setEventStatus(hardwareTypes.US_WATER, (data as IEventUSWater).status);
            break;

        default:
            throw new Error(`Event ${eventId} is not supported`);
    }

    return command.toBytes(id, buffer.getBytesToOffset());
};
