import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


type TObisInfo = {
    obisId: number,
    isStatic: boolean,
    hasProfile: boolean
};

/**
 * IGetObisInfoListResponseParameters command parameters
 */
interface IGetObisInfoListResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    obisInfoList: Array<TObisInfo>
}

const COMMAND_ID = 0x43;

const examples: TCommandExampleList = [
    {
        name: 'response to GetObisInfoList with two elements',
        parameters: {
            requestId: 3,
            isCompleted: true,
            obisInfoList: [
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
        hex: {header: '43 06', body: '03 01 c5 03 c6 01'}
    },
    {
        name: 'response to GetObisInfoList without elements',
        parameters: {
            requestId: 3,
            isCompleted: true,
            obisInfoList: []
        },
        hex: {header: '43 02', body: '03 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObisInfoListResponse from 'jooby-codec/obis-observer/commands/uplink/GetObisInfoListResponse.js';
 *
 * const commandBody = new Uint8Array([0x03, 0x01, 0xc5, 0x03, 0xc6, 0x01]);
 * const command = GetObisInfoListResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     isCompleted: true,
 *     obisInfoList: [
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisInfoList.md#response)
 */
class GetObisInfoListResponse extends Command {
    constructor ( public parameters: IGetObisInfoListResponseParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 1 + parameters.obisInfoList.length * 2;
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
            return new GetObisInfoListResponse({requestId, isCompleted: true, obisInfoList: []});
        }

        const isCompleted = buffer.getUint8();
        const obisInfoList = new Array<TObisInfo>(buffer.bytesLeft / 2);
        let obisId;
        let obisFlags;

        for ( let index = 0; index < obisInfoList.length; ++index ) {
            obisId = buffer.getUint8();
            obisFlags = buffer.getUint8();

            obisInfoList[index] = {
                obisId,
                isStatic: (obisFlags & 1) === 1,
                hasProfile: (obisFlags & 2) === 2
            };
        }

        return new GetObisInfoListResponse({requestId, isCompleted: isCompleted !== 0, obisInfoList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {requestId, isCompleted, obisInfoList} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(isCompleted ? 1 : 0);
        obisInfoList.forEach(obisInfo => {
            const obisFlag:number = (obisInfo.isStatic ? 1 : 0) | (obisInfo.hasProfile ? 2 : 0);

            buffer.setUint8(obisInfo.obisId);
            buffer.setUint8(obisFlag);
        });

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisInfoListResponse;
