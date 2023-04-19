import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {TEventStatus} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import * as hardwareTypes from '../../constants/hardwareTypes.js';


/**
 * LastEvent command parameters
 *
 * @example
 * {sequenceNumber: 3, status: {isBatteryLow: true}}
 */
interface ILastEventParameters {
    /** unique event number */
    sequenceNumber: number,
    /** object with boolean values depending on the device hardware type */
    status: TEventStatus
}


const COMMAND_ID = 0x60;

const examples: TCommandExampleList = [
    {
        name: 'status for GAZM0NEW',
        parameters: {
            sequenceNumber: 32,
            status: {
                isBatteryLow: true,
                isButtonReleased: false,
                isConnectionLost: true,
                isMagneticInfluence: false
            }
        },
        hardwareType: hardwareTypes.GAZM0NEW,
        hex: {header: '62', body: '20 09'}
    },
    {
        name: 'status for IMP4EU',
        parameters: {
            sequenceNumber: 16,
            status: {
                // first byte: 11100001 = e1 (225)
                isBatteryLow: true,
                isConnectionLost: false,
                isFirstChannelInactive: false,
                isSecondChannelInactive: true,
                isThirdChannelInactive: true,
                // second byte: 00000001 = 01
                isForthChannelInactive: true
            }
        },
        hardwareType: hardwareTypes.IMP4EU,
        hex: {header: '63', body: '10 e1 01'}
    },
    {
        name: 'status for MTXLORA',
        parameters: {
            sequenceNumber: 48,
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
        },
        hardwareType: hardwareTypes.MTXLORA,
        hex: {header: '63', body: '30 83 0a'}
    }
];


/**
 * Uplink command.
 *
 * @example
 * ```js
 * import LastEvent from 'jooby-codec/commands/downlink/LastEvent';
 * import hardwareTypes from 'jooby-codec/constants/hardwareTypes';
 *
 * const command = new LastEvent(
 *     {sequenceNumber: 8, status: {isBatteryLow: true}},
 *     hardwareTypes.IMP2EU
 * );
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 62 08 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/uplink/LastEvent.md)
 */
class LastEvent extends Command {
    constructor ( public parameters: ILastEventParameters, public hardwareType: number ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array, hardwareType?: number ) {
        if ( !hardwareType ) {
            throw new Error('hardwareType argument is mandatory');
        }

        const buffer = new CommandBinaryBuffer(data);
        const sequenceNumber = buffer.getUint8();
        const status = buffer.getEventStatus(hardwareType);

        return new LastEvent({sequenceNumber, status}, hardwareType);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {sequenceNumber, status} = this.parameters;
        const buffer = new CommandBinaryBuffer(
            // sequenceNumber size + status size
            1 + CommandBinaryBuffer.getEventStatusSize(this.hardwareType)
        );

        buffer.setUint8(sequenceNumber);
        buffer.setEventStatus(this.hardwareType, status);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default LastEvent;
