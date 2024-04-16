import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import getBytesFromHex from '../../../utils/getBytesFromHex.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IDataSegment} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x1e;
export const name: types.TCommandName = 'dataSegment';
export const headerSize = 2;

const COMMAND_BODY_MIN_SIZE = 2;

export const examples: command.TCommandExamples = {
    'DataSegment request': {
        id,
        name,
        headerSize,
        parameters: {
            segmentationSessionId: 2,
            segmentIndex: 3,
            segmentsNumber: 5,
            isLast: false,
            data: getBytesFromHex('00 01 02 03 04')
        },
        bytes: [
            0x1e, 0x07,
            0x02, 0x53, 0x00, 0x01, 0x02, 0x03, 0x04
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - command body bytes
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IDataSegment => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return buffer.getDataSegment();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDataSegment ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE + parameters.data.length);

    buffer.setDataSegment(parameters);

    return command.toBytes(id, buffer.data);
};


// TODO: add implementation
// export const toJson = ( options: TJsonOptions = defaultJsonOptions ) {
//     const {parameters} = this;

//     return JSON.stringify({
//         ...parameters,
//         data: getStringFromBytes(parameters.data, options)
//     });
// }
