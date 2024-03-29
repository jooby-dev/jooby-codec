import Command, {TJsonOptions, defaultJsonOptions} from './Command.js';
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

        this.size = parameters.data.length;
    }

    // data - only body (without header)
    static fromBytes ( id: number, data: Uint8Array ) {
        const parameters: IUnknownCommandParameters = {id, data};

        return new UnknownCommand(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {id, data} = this.parameters;

        return new Uint8Array([id, data.length, ...data]);
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
