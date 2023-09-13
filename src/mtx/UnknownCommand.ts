import Command from './Command.js';


/**
 * UnknownCommand command parameters.
 */
interface IUnknownCommandParameters {
    /** command id */
    id: number,
    /** command data size */
    size: number,
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
    static fromBytes ( id: number, size: number, data: Uint8Array ) {
        const parameters: IUnknownCommandParameters = {id, size, data};

        return new UnknownCommand(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {id, size, data} = this.parameters;

        return new Uint8Array([id, size, ...data]);
    }
}


export default UnknownCommand;
