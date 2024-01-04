import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from './Command.js';
import CommandBinaryBuffer, {IMtxCommand} from './CommandBinaryBuffer.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';


const COMMAND_ID = 0x1e;


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

        this.size = 2 + parameters.data.length;
    }

    static readonly id = COMMAND_ID;

    static readonly examples = examples;

    static readonly hasParameters = true;

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setMtxCommand(parameters);

        return buffer.toUint8Array();
    }
}
