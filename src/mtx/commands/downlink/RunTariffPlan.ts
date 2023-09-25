import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


interface IRunTariffPlanParameters {
    tariffTable: number
}


const COMMAND_ID = 0x06;
const COMMAND_SIZE = 1;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            tariffTable: 5
        },
        hex: {header: '06 01', body: '05'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import RunTariffPlan from 'jooby-codec/mtx/commands/downlink/RunTariffPlan.js';
 *
 * const parameters = {
 *     tariffTable: 5
 * };
 * const command = new RunTariffPlan(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 06 01 05
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/RunTariffPlan.md#request)
 */
class RunTariffPlan extends Command {
    constructor ( public parameters: IRunTariffPlanParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_WRITE;


    // data - only body (without header)
    static fromBytes ( [tariffTable]: Uint8Array ) {
        return new RunTariffPlan({tariffTable});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([
            COMMAND_ID,
            this.size,
            this.parameters.tariffTable
        ]);
    }
}


export default RunTariffPlan;
