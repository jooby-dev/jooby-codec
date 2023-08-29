import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetArchiveProfileResponseParameters command parameters
 */
interface IGetArchiveProfileResponseParameters extends ICommandParameters {
    archive1Period: number,
    archive2Period: number
}


const COMMAND_ID = 0x67;
const COMMAND_SIZE = REQUEST_ID_SIZE + 4;

const examples: TCommandExampleList = [
    {
        name: 'response to GetMeterArchiveProfile',
        parameters: {
            requestId: 3,
            archive1Period: 600,
            archive2Period: 45
        },
        hex: {header: '67 05', body: '03 02 58 00 2d'}
    },
    {
        name: 'response to GetMeterArchiveProfile without data',
        parameters: {
            requestId: 3
        },
        hex: {header: '67 01', body: '03'}
    }
];

const isValidParameterSet = ( parameters: IGetArchiveProfileResponseParameters | ICommandParameters ): boolean => {
    const {requestId, archive1Period, archive2Period} = parameters as IGetArchiveProfileResponseParameters;

    return requestId !== undefined
        && archive1Period !== undefined
        && archive2Period !== undefined;
};


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetArchiveProfileResponse from 'jooby-codec/obis-observer/commands/uplink/GetArchiveProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x03, 0x02, 0x58, 0x00, 0x2d]);
 * const command = GetArchiveProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     archiveProfile1Period: 600,
 *     archiveProfile2Period: 45
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetArchiveProfile.md#response)
 */
class GetArchiveProfileResponse extends Command {
    constructor ( public parameters: IGetArchiveProfileResponseParameters | ICommandParameters ) {
        super();

        this.size = isValidParameterSet(parameters) ? COMMAND_SIZE : REQUEST_ID_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();

        return buffer.isEmpty
            ? new GetArchiveProfileResponse({requestId})
            : new GetArchiveProfileResponse({
                requestId,
                archive1Period: buffer.getUint16(),
                archive2Period: buffer.getUint16()
            });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( !isValidParameterSet(this.parameters) ) {
            return Command.toBytes(COMMAND_ID, new Uint8Array([this.parameters.requestId]));
        }

        const {requestId, archive1Period, archive2Period} = this.parameters as IGetArchiveProfileResponseParameters;

        const buffer = new CommandBinaryBuffer(this.size as number);
        buffer.setUint8(requestId);
        buffer.setUint16(archive1Period);
        buffer.setUint16(archive2Period);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveProfileResponse;
