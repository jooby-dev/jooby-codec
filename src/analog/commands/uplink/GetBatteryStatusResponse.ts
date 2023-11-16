import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * GetBatteryStatusResponse command parameters
 */
interface IGetBatteryStatusResponse {
    /**
     * battery voltage value at low consumption, in mV
     *
     * `4095` - unknown value and becomes `undefined`
     */
    voltageUnderLowLoad: number,

    /**
     * battery voltage value at high consumption, in mV
     *
     * `4095` - unknown value and becomes `undefined`
     */
    voltageUnderHighLoad: number,
    internalResistance: number,
    temperature: number,
    remainingCapacity: number,
    isLastDayOverconsumption: boolean,
    averageDailyOverconsumptionCounter: number
}


const COMMAND_ID = 0x051f;
const COMMAND_BODY_MAX_SIZE = 11;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            voltageUnderLowLoad: 3600,
            voltageUnderHighLoad: 3600,
            internalResistance: 1034,
            temperature: 15,
            remainingCapacity: 41,
            isLastDayOverconsumption: false,
            averageDailyOverconsumptionCounter: 34
        },
        hex: {header: '1f 05 0b', body: '10 0e 10 0e 0a 04 0f 29 00 22 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetBatteryStatusResponse from 'jooby-codec/analog/commands/uplink/GetBatteryStatusResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x0b, 0x10, 0x0e, 0x10, 0x0e, 0x0a, 0x04, 0x0f, 0x29, 0x00, 0x22, 0x00
 * ]);
 * const command = GetBatteryStatusResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     voltageUnderLowLoad: 3600,
 *     voltageUnderHighLoad: 3600,
 *     internalResistance: 1034,
 *     temperature: 15,
 *     remainingCapacity: 41,
 *     isLastDayOverconsumption: false,
 *     averageDailyOverconsumptionCounter: 34
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetBatteryStatus.md#response)
 */
class GetBatteryStatusResponse extends Command {
    constructor ( public parameters: IGetBatteryStatusResponse ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetBatteryStatusResponse {
        const buffer = new CommandBinaryBuffer(data);

        const parameters = {
            voltageUnderLowLoad: buffer.getUint16(),
            voltageUnderHighLoad: buffer.getUint16(),
            internalResistance: buffer.getUint16(),
            temperature: buffer.getUint8(),
            remainingCapacity: buffer.getUint8(),
            isLastDayOverconsumption: buffer.getUint8() === 1,
            averageDailyOverconsumptionCounter: buffer.getUint16()
        };

        return new GetBatteryStatusResponse(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);

        buffer.setUint16(parameters.voltageUnderLowLoad);
        buffer.setUint16(parameters.voltageUnderHighLoad);
        buffer.setUint16(parameters.internalResistance);
        buffer.setUint8(parameters.temperature);
        buffer.setUint8(parameters.remainingCapacity);
        buffer.setUint8(parameters.isLastDayOverconsumption ? 1 : 0);
        buffer.setUint16(parameters.averageDailyOverconsumptionCounter);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetBatteryStatusResponse;
