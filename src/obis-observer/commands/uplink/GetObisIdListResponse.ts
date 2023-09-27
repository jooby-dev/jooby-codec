import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


interface IObisInfo {
    obisId: number,
    isStatic: boolean,
    hasProfile: boolean
}

/**
 * IGetObisIdListResponseParameters command parameters
 */
interface IGetObisIdListResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    obisIdList: Array<IObisInfo>
}

const COMMAND_ID = 0x41;

const examples: TCommandExampleList = [
    {
        name: 'response to GetObisIdList with two elements',
        parameters: {
            requestId: 3,
            isCompleted: true,
            obisIdList: [
                {
                    obisId: 197,
                    isStatic: true,
                    hasProfile: true
                },
                {
                    obisId: 198,
                    isStatic: true,
                    hasProfile: false
                }
            ]
        },
        hex: {header: '41 06', body: '03 01 c5 03 c6 01'}
    },
    {
        name: 'response to GetObisIdList without elements',
        parameters: {
            requestId: 3,
            isCompleted: true,
            obisIdList: []
        },
        hex: {header: '41 02', body: '03 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObisIdListResponse from 'jooby-codec/obis-observer/commands/uplink/GetObisIdListResponse.js';
 *
 * const commandBody = new Uint8Array([0x03, 0x01, 0xc5, 0x03, 0xc6, 0x01]);
 * const command = GetObisIdListResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     isCompleted: true,
 *     ObisIdList: [
 *         {
 *             obisId: 197,
 *             isStatic: true,
 *             hasProfile: true
 *         },
 *         {
 *             obisId: 198,
 *             isStatic: true,
 *             hasProfile: false
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisIdList.md#response)
 */
class GetObisIdListResponse extends Command {
    constructor ( public parameters: IGetObisIdListResponseParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 1 + parameters.obisIdList.length * 2;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();

        if ( buffer.isEmpty ) {
            return new GetObisIdListResponse({requestId, isCompleted: true, obisIdList: []});
        }

        const isCompleted = buffer.getUint8();
        const ObisIdList = new Array<IObisInfo>(buffer.bytesLeft / 2);
        let obisId;
        let obisFlags;

        for ( let index = 0; index < ObisIdList.length; ++index ) {
            obisId = buffer.getUint8();
            obisFlags = buffer.getUint8();

            ObisIdList[index] = {
                obisId,
                isStatic: (obisFlags & 1) === 1,
                hasProfile: (obisFlags & 2) === 2
            };
        }

        return new GetObisIdListResponse({requestId, isCompleted: isCompleted !== 0, obisIdList: ObisIdList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {requestId, isCompleted, obisIdList: ObisIdList} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(isCompleted ? 1 : 0);
        ObisIdList.forEach(obisInfo => {
            const obisFlag:number = (obisInfo.isStatic ? 1 : 0) | (obisInfo.hasProfile ? 2 : 0);

            buffer.setUint8(obisInfo.obisId);
            buffer.setUint8(obisFlag);
        });

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisIdListResponse;
