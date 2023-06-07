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

interface ILastEventConfig {
    hardwareType?: number
}


const COMMAND_ID = 0x60;

const examples: TCommandExampleList = [
    {
        name: 'status for GASI3',
        parameters: {
            sequenceNumber: 32,
            status: {
                isBatteryLow: true,
                isButtonReleased: false,
                isConnectionLost: true,
                isMagneticInfluence: false
            }
        },
        config: {
            hardwareType: hardwareTypes.GASI3
        },
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
        config: {
            hardwareType: hardwareTypes.IMP4EU
        },
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
        config: {
            hardwareType: hardwareTypes.MTXLORA
        },
        hex: {header: '63', body: '30 83 0a'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import LastEvent from 'jooby-codec/analog/commands/uplink/LastEvent.js';
 * import * as hardwareTypes from 'jooby-codec/analog/constants/hardwareTypes.js';
 *
 * const commandBody = new Uint8Array([0x10, 0xe1, 0x01]);
 * const command = LastEvent.fromBytes(commandBody, hardwareTypes.IMP4EU);
 *
 * console.log(command.parameters);
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
class LastEvent extends Command {
    constructor ( public parameters: ILastEventParameters, public config: ILastEventConfig ) {
        if ( !config.hardwareType ) {
            throw new Error('hardwareType in config is mandatory');
        }

        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array, config: ILastEventConfig ) {
        if ( !config.hardwareType ) {
            throw new Error('hardwareType in config is mandatory');
        }

        const buffer = new CommandBinaryBuffer(data);
        const sequenceNumber = buffer.getUint8();
        const status = buffer.getEventStatus(config.hardwareType);

        return new LastEvent({sequenceNumber, status}, config);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {sequenceNumber, status} = this.parameters;
        const {hardwareType} = this.config;
        const buffer = new CommandBinaryBuffer(
            // sequenceNumber size + status size
            1 + CommandBinaryBuffer.getEventStatusSize(hardwareType!)
        );

        buffer.setUint8(sequenceNumber);
        buffer.setEventStatus(hardwareType!, status);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default LastEvent;
