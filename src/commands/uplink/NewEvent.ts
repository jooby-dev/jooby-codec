import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IEventMtxStatus} from '../../CommandBinaryBuffer.js';
import getHexFromBytes from '../../utils/getHexFromBytes.js';
import getBytesFromHex from '../../utils/getBytesFromHex.js';
import {TTime2000} from '../../utils/time.js';
import * as events from '../../constants/events.js';
import {UPLINK} from '../../constants/directions.js';
import * as hardwareTypes from '../../constants/hardwareTypes.js';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEventBase {}

interface IEventTime extends IEventBase {
    time: TTime2000
}

interface IEventBatteryAlarm extends IEventBase {
    voltage: number
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
    deviceId: string
}

interface IEventConnection extends IEventBase {
    channel: number,
    value: number
}

interface IEventMtx extends IEventBase {
    status: IEventMtxStatus
}

type TEventData =
    IEventTime |
    IEventBatteryAlarm |
    IEventActivateMtx |
    IEventConnection |
    IEventMtx;


/**
 * NewEvent command parameters
 *
 * @example
 * ```js
 * import {constants} from 'jooby-codec'
 *
 * // `MAGNET_ON` event at 2023-04-05 13:17:20 GMT
 * {id: constants.events.MAGNET_ON, sequenceNumber: 1, data: {time: 734015840}}
 */
interface INewEventParameters {
    id: number,
    sequenceNumber: number,
    data: TEventData
}


const COMMAND_ID = 0x15;

// ACTIVATE_MTX are biggest,1 byte event id, 1 byte sequence number, 4 bytes time, 8 bytes mtx address
const COMMAND_BODY_MAX_SIZE = 14;
const MTX_ADDRESS_SIZE = 8;

const examples: TCommandExampleList = [
    {
        name: 'event for MAGNET_ON',
        parameters: {
            id: events.MAGNET_ON,
            sequenceNumber: 2,
            data: {time: 734015840}
        },
        hex: {header: '15 06', body: '01 02 2b c0 31 60'}
    },
    {
        name: 'event for BATTERY_ALARM',
        parameters: {
            id: events.BATTERY_ALARM,
            sequenceNumber: 2,
            data: {voltage: 3308}
        },
        hex: {header: '15 04', body: '05 02 0c ec'}
    },
    {
        name: 'event for ACTIVATE_MTX',
        parameters: {
            id: events.ACTIVATE_MTX,
            sequenceNumber: 2,
            data: {time: 734015840, deviceId: '00 1a 79 88 17 01 23 56'}
        },
        hex: {header: '15 0e', body: '0b 02 2b c0 31 60 00 1a 79 88 17 01 23 56'}
    },
    {
        name: 'event for CONNECT',
        parameters: {
            id: events.CONNECT,
            sequenceNumber: 2,
            data: {channel: 0, value: 131}
        },
        hex: {header: '15 05', body: '0c 02 00 83 01'}
    },
    {
        name: 'event for DISCONNECT',
        parameters: {
            id: events.DISCONNECT,
            sequenceNumber: 2,
            data: {channel: 0, value: 131}
        },
        hex: {header: '15 05', body: '0d 02 00 83 01'}
    },
    {
        name: 'event for EV_MTX',
        parameters: {
            id: events.MTX,
            sequenceNumber: 2,
            data: {
                status: {
                    // first byte: 10000011 = 83 (131)
                    isMeterCaseOpen: true,
                    isMagneticInfluence: true,
                    isParametersSetRemotely: false,
                    isParametersSetLocally: false,
                    isMeterProgramRestarted: false,
                    isLockedOut: false,
                    isTimeSet: false,
                    isTimeCorrected: true,
                    // second byte: 00001010 = 0a (10)
                    isMeterFailure: false,
                    isMeterTerminalBoxOpen: true,
                    isModuleCompartmentOpen: false,
                    isTariffPlanChanged: true,
                    isNewTariffPlanReceived: false
                }
            }
        },
        hex: {header: '15 04', body: '11 02 83 0a'}
    }
];

const getVoltage = ( buffer: CommandBinaryBuffer ): number => buffer.getUint16(false);
const setVoltage = ( buffer: CommandBinaryBuffer, value: number ): void => buffer.setUint16(value, false);

const getDeviceId = ( buffer: CommandBinaryBuffer ): string => {
    const bytes = [];

    for ( let i = 0; i < MTX_ADDRESS_SIZE; ++i ) {
        bytes.push(buffer.getUint8());
    }

    return getHexFromBytes(new Uint8Array(bytes));
};

const setDeviceId = ( buffer: CommandBinaryBuffer, value: string ): void => {
    const bytes = getBytesFromHex(value);

    bytes.forEach(byte => buffer.setUint8(byte));
};


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import NewEvent from 'jooby-codec/commands/uplink/NewEvent';
 *
 * const commandBody = new Uint8Array([
 *     0x05, 0x02, 0x0c, 0xec
 * ]);
 * const command = NewEvent.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     id: 5,
 *     sequenceNumber: 2,
 *     data: {voltage: 3308}
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/uplink/NewEvent.md)
 */
class NewEvent extends Command {
    constructor ( public parameters: INewEventParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): NewEvent {
        const buffer = new CommandBinaryBuffer(data);
        const id = buffer.getUint8();
        const sequenceNumber = buffer.getUint8();
        let eventData;

        switch ( id ) {
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
                eventData = {time: buffer.getTime()} as IEventTime;
                break;

            case events.BATTERY_ALARM:
                eventData = {voltage: getVoltage(buffer)} as IEventBatteryAlarm;
                break;

            case events.ACTIVATE_MTX:
                eventData = {time: buffer.getTime(), deviceId: getDeviceId(buffer)} as IEventActivateMtx;
                break;

            case events.CONNECT:
            case events.DISCONNECT:
                eventData = {channel: buffer.getUint8(), value: buffer.getExtendedValue()} as IEventConnection;
                break;

            case events.MTX:
                eventData = {status: buffer.getEventStatus(hardwareTypes.MTXLORA)} as IEventMtx;
                break;

            default:
                throw new Error(`${this.getId()}: event ${id} is not supported`);
        }

        return new NewEvent({id, sequenceNumber, data: eventData});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {id, sequenceNumber, data} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        let eventData;

        buffer.setUint8(id);
        buffer.setUint8(sequenceNumber);

        switch ( id ) {
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
                eventData = data as IEventTime;
                buffer.setTime(eventData.time);
                break;

            case events.BATTERY_ALARM:
                eventData = data as IEventBatteryAlarm;
                setVoltage(buffer, eventData.voltage);
                break;

            case events.ACTIVATE_MTX:
                eventData = data as IEventActivateMtx;
                buffer.setTime(eventData.time);
                setDeviceId(buffer, eventData.deviceId);
                break;

            case events.CONNECT:
            case events.DISCONNECT:
                eventData = data as IEventConnection;
                buffer.setUint8(eventData.channel);
                buffer.setExtendedValue(eventData.value);
                break;

            case events.MTX:
                eventData = data as IEventMtx;
                buffer.setEventStatus(hardwareTypes.MTXLORA, eventData.status);
                break;

            default:
                throw new Error(`${NewEvent.getId()}: event ${id} is not supported`);
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default NewEvent;
