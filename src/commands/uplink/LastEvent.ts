import Command from '../../Command.js';
import * as hardwareTypes from '../../constants/hardwareTypes.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import * as bitSet from '../../utils/bitSet.js';
import {UPLINK} from '../../constants/directionTypes.js';


interface ILastEventGasStatus {
    /** the battery voltage has dropped below the set threshold */
    isBatteryLow?: boolean,
    /** there is a magnetic field influence */
    isMagneticInfluence?: boolean,
    /** button is release (device is unmounted) */
    isButtonReleased?: boolean,
    /** the device has detected a loss of connection to the server */
    isConnectionLost?: boolean
}

interface ILastEvent2ChannelStatus {
    /** the battery voltage has dropped below the set threshold */
    isBatteryLow?: boolean,
    /** the device has detected a loss of connection to the server */
    isConnectionLost?: boolean,
    /** the first channel is not active */
    isFirstChannelInactive?: boolean,
    /** the second channel is not active */
    isSecondChannelInactive?: boolean
}

interface ILastEventElimpStatus {
    /** the device has detected a loss of connection to the server */
    isConnectionLost?: boolean
}

interface ILastEventWaterStatus {
    /** the battery voltage has dropped below the set threshold */
    isBatteryLow?: boolean,
    /** the device has detected a loss of connection to the server */
    isConnectionLost?: boolean
}

interface ILastEvent4ChannelStatus {
    /** the battery voltage has dropped below the set threshold */
    isBatteryLow?: boolean,
    /** the device has detected a loss of connection to the server */
    isConnectionLost?: boolean,
    /** the first channel is not active */
    isFirstChannelInactive?: boolean,
    /** the second channel is not active */
    isSecondChannelInactive?: boolean,
    /** the third channel is not active */
    isThirdChannelInactive?: boolean,
    /** the forth channel is not active */
    isForthChannelInactive?: boolean
}

interface ILastEventMtxStatus {
    /** meter case is open */
    isMeterCaseOpen?: boolean,
    /** there is a magnetic field influence */
    isMagneticInfluence?: boolean,
    /** parameters set remotely */
    isParametersSetRemotely?: boolean,
    /** parameters set locally */
    isParametersSetLocally?: boolean,
    /** meter program restart */
    isMeterProgramRestarted?: boolean,
    /** incorrect password and lockout */
    isLockedOut?: boolean,
    /** time set */
    isTimeSet?: boolean,
    /** time correction */
    isTimeCorrected?: boolean,
    /** meter failure */
    isMeterFailure?: boolean,
    /** meter terminal box is open */
    isMeterTerminalBoxOpen?: boolean,
    /** meter module compartment is open */
    isModuleCompartmentOpen?: boolean,
    /** tariff plan changed */
    isTariffPlanChanged?: boolean,
    /** new tariff plan received */
    isNewTariffPlanReceived?: boolean
}

type TLastEventStatus =
    ILastEventGasStatus |
    ILastEvent2ChannelStatus |
    ILastEventElimpStatus |
    ILastEventWaterStatus |
    ILastEvent4ChannelStatus |
    ILastEventMtxStatus;

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
    status: TLastEventStatus
}


const COMMAND_ID = 0x60;
const COMMAND_TITLE = 'LAST_EVENT';

const GAS_HARDWARE_TYPES = [
    hardwareTypes.GAZM0,
    hardwareTypes.GAZM0NEW,
    hardwareTypes.GAZM3,
    hardwareTypes.GAZWLE
];
const TWO_CHANNELS_HARDWARE_TYPES = [
    hardwareTypes.IMP2AS,
    hardwareTypes.IMP2EU,
    hardwareTypes.IMP2IN,
    hardwareTypes.NOVATOR
];
const ELIMP_HARDWARE_TYPES = [
    hardwareTypes.ELIMP
];
const WATER_HARDWARE_TYPES = [
    hardwareTypes.WATER
];
const FOUR_CHANNELS_HARDWARE_TYPES = [
    hardwareTypes.IMP4EU,
    hardwareTypes.IMP4IN
];
const MTX_HARDWARE_TYPES = [
    hardwareTypes.MTXLORA
];

const gasBitMask = {
    isBatteryLow: 2 ** 0,
    isMagneticInfluence: 2 ** 1,
    isButtonReleased: 2 ** 2,
    isConnectionLost: 2 ** 3
};
const twoChannelBitMask = {
    isBatteryLow: 2 ** 0,
    isConnectionLost: 2 ** 3,
    isFirstChannelInactive: 2 ** 4,
    isSecondChannelInactive: 2 ** 5
};
const elimpBitMask = {
    isConnectionLost: 2 ** 3
};
const waterBitMask = {
    isBatteryLow: 2 ** 0,
    isConnectionLost: 2 ** 3
};
const fourChannelBitMask = {
    isBatteryLow: 2 ** 0,
    isConnectionLost: 2 ** 3,
    isFirstChannelInactive: 2 ** 4,
    isSecondChannelInactive: 2 ** 5,
    isThirdChannelInactive: 2 ** 6,
    isForthChannelInactive: 2 ** 7
};
const mtxBitMask = {
    isMeterCaseOpen: 2 ** 0,
    isMagneticInfluence: 2 ** 1,
    isParametersSetRemotely: 2 ** 2,
    isParametersSetLocally: 2 ** 3,
    isMeterProgramRestarted: 2 ** 4,
    isLockedOut: 2 ** 5,
    isTimeSet: 2 ** 6,
    isTimeCorrected: 2 ** 7,
    isMeterFailure: 2 ** 8,
    isMeterTerminalBoxOpen: 2 ** 9,
    isModuleCompartmentOpen: 2 ** 10,
    isTariffPlanChanged: 2 ** 11,
    isNewTariffPlanReceived: 2 ** 12
};


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

    static readonly title = COMMAND_TITLE;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array, hardwareType?: number ) {
        if ( !hardwareType ) {
            throw new Error('hardwareType argument is mandatory');
        }

        const buffer = new CommandBinaryBuffer(data);
        const sequenceNumber = buffer.getUint8();
        let status: TLastEventStatus;

        if ( GAS_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(gasBitMask, buffer.getUint8());
        } else if ( TWO_CHANNELS_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(twoChannelBitMask, buffer.getUint8());
        } else if ( ELIMP_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(elimpBitMask, buffer.getUint8());
        } else if ( WATER_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(waterBitMask, buffer.getUint8());
        } else if ( FOUR_CHANNELS_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(fourChannelBitMask, buffer.getExtendedValue());
        } else if ( MTX_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(mtxBitMask, buffer.getUint16());
        } else {
            throw new Error('wrong hardwareType');
        }

        return new LastEvent({sequenceNumber, status}, hardwareType);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {sequenceNumber, status} = this.parameters;
        const buffer = new CommandBinaryBuffer(
            [...FOUR_CHANNELS_HARDWARE_TYPES, ...MTX_HARDWARE_TYPES].includes(this.hardwareType) ? 3 : 2
        );

        buffer.setUint8(sequenceNumber);

        if ( GAS_HARDWARE_TYPES.includes(this.hardwareType) ) {
            buffer.setUint8(bitSet.fromObject(gasBitMask, status as bitSet.TBooleanObject));
        } else if ( TWO_CHANNELS_HARDWARE_TYPES.includes(this.hardwareType) ) {
            buffer.setUint8(bitSet.fromObject(twoChannelBitMask, status as bitSet.TBooleanObject));
        } else if ( ELIMP_HARDWARE_TYPES.includes(this.hardwareType) ) {
            buffer.setUint8(bitSet.fromObject(elimpBitMask, status as bitSet.TBooleanObject));
        } else if ( WATER_HARDWARE_TYPES.includes(this.hardwareType) ) {
            buffer.setUint8(bitSet.fromObject(waterBitMask, status as bitSet.TBooleanObject));
        } else if ( FOUR_CHANNELS_HARDWARE_TYPES.includes(this.hardwareType) ) {
            buffer.setExtendedValue(bitSet.fromObject(fourChannelBitMask, status as bitSet.TBooleanObject));
        } else if ( MTX_HARDWARE_TYPES.includes(this.hardwareType) ) {
            buffer.setUint16(bitSet.fromObject(mtxBitMask, status as bitSet.TBooleanObject));
        } else {
            throw new Error('wrong hardwareType');
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default LastEvent;
