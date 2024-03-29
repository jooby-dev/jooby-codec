import {TBytes} from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../command.js';
import {ICommandParameters, TCommandExamples} from '../../command.js';


/**
 * CorrectTime2000 command parameters
 *
 * @example
 * // 120 seconds to the past
 * {sequenceNumber: 45, seconds: -120}
 */
interface ICorrectTime2000Parameters extends ICommandParameters {
    /** unique time manipulation operation number */
    sequenceNumber: number,

    /**
     * seconds
     * range: [-127..+127]
     */
    seconds: number
}


export const id = 0x0c;
export const headerSize = 2;

const COMMAND_BODY_SIZE = 2;

export const examples: TCommandExamples = {
    'correct time 120 seconds to the past': {
        id,
        headerSize,
        parameters: {sequenceNumber: 45, seconds: -120},
        bytes: [
            0x0c, 0x02,
            0x2d, 0x88
        ]
    },
    'correct time 95 seconds to the future': {
        id,
        headerSize,
        parameters: {sequenceNumber: 46, seconds: 95},
        bytes: [
            0x0c, 0x02,
            0x2e, 0x5f
        ]
    }
};


// data - only body (without header)
export const fromBytes = ( data: TBytes ): ICorrectTime2000Parameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(data, false);
    const parameters = {
        sequenceNumber: buffer.getUint8(),
        seconds: buffer.getInt8()
    };

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return parameters;
};

// returns full message - header with body
export const toBytes = ( parameters: ICorrectTime2000Parameters ): TBytes => {
    const {sequenceNumber, seconds} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint8(sequenceNumber);
    buffer.setInt8(seconds);

    return command.toBytes(id, buffer.data);
};
