import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObis} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetObisIdListParameters command parameters
 */
interface IGetObisIdListParameters extends ICommandParameters {
    meterProfileId: number,
    index: number,
    obis: IObis
}


const COMMAND_ID = 0x40;

const examples: TCommandExampleList = [
    {
        name: 'get obisId list for OBIS code 0.9.1 - local time in meter profile 5',
        parameters: {
            requestId: 3,
            meterProfileId: 5,
            index: 1,
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        hex: {header: '40 07', body: '03 05 01 02 00 09 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetObisIdList from 'jooby-codec/obis-observer/commands/downlink/GetObisIdList.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 5,
 *     index: 0,
 *     obis: {
 *         c: 0,
 *         d: 9,
 *         e: 1
 *     }
 * };
 * const command = new GetObisIdList(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 40 07 03 05 00 02 00 09 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisIdList.md#request)
 */
class GetObisIdList extends Command {
    constructor ( public parameters: IGetObisIdListParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 2 + CommandBinaryBuffer.getObisSize(parameters.obis);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetObisIdList({
            requestId: buffer.getUint8(),
            meterProfileId: buffer.getUint8(),
            index: buffer.getUint8(),
            obis: buffer.getObis()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, meterProfileId, index, obis} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size as number);

        buffer.setUint8(requestId);
        buffer.setUint8(meterProfileId);
        buffer.setUint8(index);
        buffer.setObis(obis);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisIdList;
