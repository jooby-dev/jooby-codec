import Command, {ICommandBinary, TJsonOptions, defaultJsonOptions} from './Command.js';
import {getStringFromBytes} from '../utils/bytesConversion.js';


/**
 * UnknownCommand command parameters.
 */
interface IUnknownCommandParameters {
    /** command id */
    id: number,
    /** raw data */
    data: Uint8Array
}


/**
 * Unknown command.
 */
class UnknownCommand extends Command {
    constructor ( public parameters: IUnknownCommandParameters ) {
        super();
    }

    // data - only body (without header)
    static fromBytes ( data: Uint8Array, id: number ) {
        const parameters: IUnknownCommandParameters = {id, data};

        return new UnknownCommand(parameters);
    }

    toBinary (): ICommandBinary {
        const {id, data} = this.parameters;

        return Command.toBinary(id, data);
    }

    toJson ( options: TJsonOptions = defaultJsonOptions ) {
        const {id, data} = this.parameters;

        return JSON.stringify({
            id,
            data: getStringFromBytes(data, options)
        });
    }
}


export default UnknownCommand;
