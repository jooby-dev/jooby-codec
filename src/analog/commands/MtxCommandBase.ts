import Command, {TCommandExampleList, ICommandBinary} from '../Command.js';
import CommandBinaryBuffer, {IMtxCommand} from '../CommandBinaryBuffer.js';
import getBytesFromHex from '../../utils/getBytesFromHex.js';


const COMMAND_ID = 0x1e;
const MTX_COMMAND_HEADER_SIZE = 2;

const examples: TCommandExampleList = [
    {
        name: 'MtxCommand request',
        parameters: {
            sequence: 2,
            last: false,
            fragmentsNumber: 5,
            fragmentIndex: 3,
            data: getBytesFromHex('00 01 02 03 04')
        },
        hex: {
            header: '1e 07',
            body: '02 53 00 01 02 03 04'
        }
    }
];


export default class MtxCommandBase extends Command {
    constructor ( public parameters: IMtxCommand ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly examples = examples;

    static readonly hasParameters = true;

    // returns full message - header with body
    toBinary (): ICommandBinary {
        const buffer = new CommandBinaryBuffer(MTX_COMMAND_HEADER_SIZE + this.parameters.data.length);

        buffer.setMtxCommand(this.parameters);

        return Command.toBinary(COMMAND_ID, buffer.getBytesToOffset());
    }

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new this(buffer.getMtxCommand());
    }
}
