import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {ITariffPlan, TARIFF_PLAN_SIZE} from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


interface IGetRatePlanInfoResponseParameters {
    tariffTable: number,
    activePlan: ITariffPlan,
    passivePlan: ITariffPlan
}


const COMMAND_ID = 0x2c;
const COMMAND_SIZE = 1 + 2 * TARIFF_PLAN_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'rate plan info response',
        parameters: {
            tariffTable: 8,
            activePlan: {
                id: 1,
                tariffSet: 2,
                activateYear: 3,
                activateMonth: 4,
                activateDay: 5,
                specialProfilesArraySize: 6,
                seasonProfilesArraySize: 7,
                dayProfilesArraySize: 8
            },
            passivePlan: {
                id: 10,
                tariffSet: 20,
                activateYear: 30,
                activateMonth: 40,
                activateDay: 50,
                specialProfilesArraySize: 60,
                seasonProfilesArraySize: 70,
                dayProfilesArraySize: 80
            }
        },
        hex: {
            header: '2c 17',
            body: '08 00 00 00 01 02 03 04 05 06 07 08 00 00 00 0a 14 1e 28 32 3c 46 50'
        }
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetRatePlanInfoResponse from 'jooby-codec/obis-observer/commands/uplink/GetRatePlanInfoResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x08, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
 *     0x00, 0x00, 0x00, 0x0a, 0x14, 0x1e, 0x28, 0x32, 0x3c, 0x46, 0x50
 * ]);
 * const command = GetRatePlanInfoResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     tariffTable: 8,
 *     activePlan: {
 *         id: 1,
 *         tariffSet: 2,
 *         activateYear: 3,
 *         activateMonth: 4,
 *         activateDay: 5,
 *         specialProfilesArraySize: 6,
 *         seasonProfilesArraySize: 7,
 *         dayProfilesArraySize: 8
 *     },
 *     passivePlan: {
 *         id: 10,
 *         tariffSet: 20,
 *         activateYear: 30,
 *         activateMonth: 40,
 *         activateDay: 50,
 *         specialProfilesArraySize: 60,
 *         seasonProfilesArraySize: 70,
 *         dayProfilesArraySize: 80
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetRatePlanInfoResponse.md)
 */
class GetRatePlanInfoResponse extends Command {
    constructor ( public parameters: IGetRatePlanInfoResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetRatePlanInfoResponse({
            tariffTable: buffer.getUint8(),
            activePlan: buffer.getTariffPlan(),
            passivePlan: buffer.getTariffPlan()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setUint8(parameters.tariffTable);
        buffer.setTariffPlan(parameters.activePlan);
        buffer.setTariffPlan(parameters.passivePlan);

        return buffer.toUint8Array();
    }
}


export default GetRatePlanInfoResponse;
