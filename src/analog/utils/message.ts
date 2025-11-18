import {TCommand} from './command.js';
import {TCommandId} from '../../types.js';


export const findCommand = ( commands: Array<TCommand>, commandId: TCommandId ) => commands.find(command => {
    if ( 'id' in command ) {
        return command.id === commandId;
    }

    if ( 'command' in command ) {
        return command.command.id === commandId;
    }

    return null;
});
