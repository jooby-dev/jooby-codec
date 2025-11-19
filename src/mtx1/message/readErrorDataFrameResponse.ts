import {TBytes, TAccessLevel} from '../types.js';
import {IMessage} from './types.js';
import * as errorDataFrameResponse from '../commands/uplink/errorDataFrameResponse.js';
import * as accessLevels from '../constants/accessLevels.js';


const COMMAND_HEADER_SIZE = 2;
const MESSAGE_HEADER_SIZE = 2;

// errorDataFrameResponse is a special message type indicating an error
// in the incoming DATA_REQUEST frame.
// - It contains a single command: errorDataFrameResponse (id: 0xff).
// - It has no LRC.
// - It may or may not include the access-level byte.
// - The message is always unencrypted.

const tryToReadErrorDataFrameCommand = ( bytes: TBytes ) => {
    const [id] = bytes;

    if ( id === errorDataFrameResponse.id ) {
        try {
            const parameters = errorDataFrameResponse.fromBytes(bytes.slice(COMMAND_HEADER_SIZE));

            return {
                id,
                name: errorDataFrameResponse.name,
                headerSize: COMMAND_HEADER_SIZE,
                bytes,
                parameters
            };
        } catch {
            return null;
        }
    }

    return null;
};

export default ( accessLevel: TAccessLevel, bytes: TBytes ): IMessage | null => {
    const [messageId] = bytes;
    const errorDataFrameCommand1 = tryToReadErrorDataFrameCommand(bytes.slice(MESSAGE_HEADER_SIZE - 1));
    const errorDataFrameCommand2 = tryToReadErrorDataFrameCommand(bytes.slice(MESSAGE_HEADER_SIZE));
    const result = {messageId, bytes};

    if ( errorDataFrameCommand1 ) {
        return {
            ...result,
            accessLevel: accessLevels.UNENCRYPTED,
            commands: [errorDataFrameCommand1]
        };
    }

    if ( errorDataFrameCommand2 ) {
        return {
            ...result,
            accessLevel,
            commands: [errorDataFrameCommand2]
        };
    }

    return null;
};
